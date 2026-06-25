import os
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader, Subset
from torch.optim.lr_scheduler import SequentialLR, LinearLR, CosineAnnealingWarmRestarts
from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_class_weight
import albumentations as A
from albumentations.pytorch import ToTensorV2
import cv2
import numpy as np
import json
import time

# Import our custom architecture
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "models"))
from crop_disease_net import CropDiseaseNet

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "PlantVillage")

train_transform = A.Compose([
    A.RandomResizedCrop(size=(224, 224), scale=(0.5, 1.0), ratio=(0.75, 1.33)),
    A.HorizontalFlip(p=0.5),
    A.VerticalFlip(p=0.3),
    A.Rotate(limit=45, p=0.7),
    A.ColorJitter(brightness=0.4, contrast=0.4, saturation=0.3, hue=0.15, p=0.8),
    A.GaussianBlur(blur_limit=(3, 7), p=0.3),
    A.GaussNoise(var_limit=(10, 50), p=0.3),
    A.CoarseDropout(max_holes=8, max_height=32, max_width=32, fill_value=0, p=0.3),
    A.RandomShadow(shadow_roi=(0, 0, 1, 1), num_shadows_lower=1, num_shadows_upper=2, shadow_dimension=5, p=0.3),
    A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ToTensorV2()
])

infer_transform = A.Compose([
    A.Resize(height=256, width=256),
    A.CenterCrop(height=224, width=224),
    A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ToTensorV2()
])

class LeafDiseaseDataset(Dataset):
    def __init__(self, root_dir, transform=None):
        self.transform = transform
        self.samples = []
        if not os.path.exists(root_dir):
            raise ValueError(f"Dataset dir not found: {root_dir}")
        self.classes = sorted([d for d in os.listdir(root_dir) if os.path.isdir(os.path.join(root_dir, d))])
        self.class_to_idx = {c: i for i, c in enumerate(self.classes)}
        
        for cls in self.classes:
            cls_dir = os.path.join(root_dir, cls)
            for img_file in os.listdir(cls_dir):
                if img_file.lower().endswith(('.jpg', '.jpeg', '.png')):
                    self.samples.append((os.path.join(cls_dir, img_file), self.class_to_idx[cls]))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        path, label = self.samples[idx]
        img = cv2.imread(path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        if self.transform:
            img = self.transform(image=img)['image']
        return img, label

def cutmix_batch(images, labels, alpha=1.0):
    lam = np.random.beta(alpha, alpha)
    rand_index = torch.randperm(images.size(0))
    W, H = images.size(3), images.size(2)
    cut_ratio = np.sqrt(1 - lam)
    cut_w, cut_h = int(W * cut_ratio), int(H * cut_ratio)
    cx, cy = np.random.randint(W), np.random.randint(H)
    x1 = np.clip(cx - cut_w//2, 0, W); x2 = np.clip(cx + cut_w//2, 0, W)
    y1 = np.clip(cy - cut_h//2, 0, H); y2 = np.clip(cy + cut_h//2, 0, H)
    images[:, :, y1:y2, x1:x2] = images[rand_index, :, y1:y2, x1:x2]
    lam = 1 - (x2-x1)*(y2-y1)/(W*H)
    return images, labels, labels[rand_index], lam

def train_epoch(model, loader, optimizer, criterion, device, cutmix_p=0.5):
    model.train()
    total_loss, correct, total = 0, 0, 0
    for imgs, labels in loader:
        imgs, labels = imgs.to(device), labels.to(device)
        
        if np.random.rand() < cutmix_p:
            imgs, labels_a, labels_b, lam = cutmix_batch(imgs, labels)
            outputs = model(imgs)
            loss = lam * criterion(outputs, labels_a) + (1 - lam) * criterion(outputs, labels_b)
        else:
            outputs = model(imgs)
            loss = criterion(outputs, labels)
            
        optimizer.zero_grad()
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
        optimizer.step()
        
        total_loss += loss.item()
        correct += (outputs.argmax(1) == labels).sum().item()
        total += labels.size(0)
    return total_loss / len(loader), correct / total

def val_epoch(model, loader, criterion, device):
    model.eval()
    total_loss, correct, total = 0, 0, 0
    with torch.no_grad():
        for imgs, labels in loader:
            imgs, labels = imgs.to(device), labels.to(device)
            outputs = model(imgs)
            loss = criterion(outputs, labels)
            total_loss += loss.item()
            correct += (outputs.argmax(1) == labels).sum().item()
            total += labels.size(0)
    return total_loss / len(loader), correct / total

def main():
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    print("Loading dataset...")
    full_ds_train = LeafDiseaseDataset(DATA_DIR, transform=train_transform)
    full_ds_infer = LeafDiseaseDataset(DATA_DIR, transform=infer_transform)
    
    # Save class names for API later
    with open(os.path.join(os.path.dirname(__file__), '..', 'models', 'class_names.json'), 'w') as f:
        json.dump(full_ds_train.classes, f)
        
    labels = [s[1] for s in full_ds_train.samples]
    indices = list(range(len(full_ds_train)))
    
    idx_trainval, idx_test = train_test_split(indices, test_size=0.1, stratify=labels, random_state=42)
    labels_trainval = [labels[i] for i in idx_trainval]
    idx_train, idx_val = train_test_split(idx_trainval, test_size=0.1/0.9, stratify=labels_trainval, random_state=42)
    
    with open(os.path.join(os.path.dirname(__file__), '..', 'models', 'data_splits.json'), 'w') as f:
        json.dump({'train': idx_train, 'val': idx_val, 'test': idx_test}, f)
        
    train_ds = Subset(full_ds_train, idx_train)
    val_ds = Subset(full_ds_infer, idx_val)
    
    # Check if we should run a fast sanity test
    num_workers = 0 if os.name == 'nt' else 4 # Windows multiproc issues
    train_loader = DataLoader(train_ds, batch_size=64, shuffle=True, num_workers=num_workers)
    val_loader = DataLoader(val_ds, batch_size=128, shuffle=False, num_workers=num_workers)
    
    print("Calculating class weights...")
    weights = compute_class_weight('balanced', classes=np.unique(labels), y=labels)
    class_weights = torch.tensor(weights, dtype=torch.float32).to(device)
    
    num_classes = len(full_ds_train.classes)
    print(f"Initializing CropDiseaseNet with {num_classes} classes...")
    model = CropDiseaseNet(num_classes=num_classes).to(device)
    
    # Mathematical Focal Loss Implementation
    class FocalLoss(nn.Module):
        def __init__(self, weight=None, gamma=2.0, reduction='mean'):
            super(FocalLoss, self).__init__()
            self.weight = weight
            self.gamma = gamma
            self.reduction = reduction

        def forward(self, input_tensor, target_tensor):
            log_prob = F.log_softmax(input_tensor, dim=-1)
            prob = torch.exp(log_prob)
            return F.nll_loss(
                ((1 - prob) ** self.gamma) * log_prob, 
                target_tensor, 
                weight=self.weight,
                reduction=self.reduction
            )
            
    criterion = FocalLoss(weight=class_weights, gamma=2.0)
    
    # Only pass parameters that require gradients (the classifier head) to the optimizer
    trainable_params = filter(lambda p: p.requires_grad, model.parameters())
    optimizer = torch.optim.Adam(trainable_params, lr=0.001, weight_decay=1e-4)
    
    warmup = LinearLR(optimizer, start_factor=0.001, total_iters=2)
    # Cosine Annealing with Warm Restarts (SGDR)
    cosine = CosineAnnealingWarmRestarts(optimizer, T_0=5, T_mult=2, eta_min=1e-6)
    scheduler = SequentialLR(optimizer, schedulers=[warmup, cosine], milestones=[2])
    
    EPOCHS = 15
    best_val_acc = 0
    patience, patience_counter = 10, 0
    
    model_path = os.path.join(os.path.dirname(__file__), "..", "models", "best_disease_model.pth")
    if os.path.exists(model_path):
        print(f"Resuming from existing checkpoint: {model_path}")
        model.load_state_dict(torch.load(model_path, map_location=device))
        
        # We don't have the exact best_val_acc saved in the file directly, 
        # but since we are resuming, any further improvement will overwrite it.
        # We will do a quick validation pass to set the baseline best_val_acc!
        print("Evaluating resumed model to set baseline accuracy...")
        _, best_val_acc = val_epoch(model, val_loader, criterion, device)
        print(f"Baseline accuracy from checkpoint: {best_val_acc:.3f}")
        
    print("Starting Training...")
    for epoch in range(EPOCHS):
        start_t = time.time()
        train_loss, train_acc = train_epoch(model, train_loader, optimizer, criterion, device)
        val_loss, val_acc = val_epoch(model, val_loader, criterion, device)
        scheduler.step()
        end_t = time.time()
        
        print(f"Epoch {epoch+1:3d} ({end_t-start_t:.1f}s) | Train loss {train_loss:.4f} acc {train_acc:.3f} | Val loss {val_loss:.4f} acc {val_acc:.3f}")
        
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            patience_counter = 0
            model_path = os.path.join(os.path.dirname(__file__), "..", "models", "best_disease_model.pth")
            torch.save(model.state_dict(), model_path)
            print(f"--> Saved new best model to {model_path}")
        else:
            patience_counter += 1
            if patience_counter >= patience:
                print(f"Early stopping triggered at epoch {epoch+1}")
                break

if __name__ == "__main__":
    main()
