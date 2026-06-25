import torch
import torch.nn as nn
from torchvision import models

class CropDiseaseNet(nn.Module):
    def __init__(self, num_classes=38):
        super(CropDiseaseNet, self).__init__()
        # Load the pre-trained EfficientNet-B0
        self.base_model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.IMAGENET1K_V1)
        
        # Freeze all layers in the base model feature extractor
        for param in self.base_model.features.parameters():
            param.requires_grad = False
            
        # Replace the final classifier head
        # EfficientNet-b0 classifier is a Sequential block. We replace the Linear layer to output num_classes.
        num_ftrs = self.base_model.classifier[1].in_features
        self.base_model.classifier[1] = nn.Linear(num_ftrs, num_classes)

    def forward(self, x):
        return self.base_model(x)

if __name__ == "__main__":
    model = CropDiseaseNet(num_classes=38)
    print("Model Architecture:")
    print(model)
    
    # Test forward pass
    dummy_input = torch.randn(1, 3, 224, 224)
    out = model(dummy_input)
    print(f"Output shape: {out.shape}")
