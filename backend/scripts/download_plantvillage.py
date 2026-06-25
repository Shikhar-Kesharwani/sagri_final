import os
from datasets import load_dataset
from PIL import Image

def download_and_extract():
    print("Downloading PlantVillage dataset from HuggingFace...")
    # This dataset has 38 classes of leaf diseases (the standard PlantVillage)
    try:
        ds = load_dataset("aymen31/PlantVillage", split="train")
    except Exception as e:
        print(f"Failed to load dataset: {e}")
        return
    
    base_dir = os.path.join(os.path.dirname(__file__), "..", "data", "PlantVillage")
    os.makedirs(base_dir, exist_ok=True)
    
    # HuggingFace datasets provides 'label' as an int, we need the string name
    labels = ds.features['label'].names
    
    # Create directories for each class
    for label_name in labels:
        os.makedirs(os.path.join(base_dir, label_name), exist_ok=True)
        
    print(f"Extracting {len(ds)} images to {base_dir}...")
    
    for i, item in enumerate(ds):
        img = item['image']
        label_idx = item['label']
        label_name = labels[label_idx]
        
        # Some images might be 'L' or 'RGBA', convert to 'RGB' to standardize
        if img.mode != 'RGB':
            img = img.convert('RGB')
            
        img_path = os.path.join(base_dir, label_name, f"image_{i}.jpg")
        img.save(img_path)
        
        if (i + 1) % 5000 == 0:
            print(f"Extracted {i + 1}/{len(ds)} images...")
            
    print("Download and extraction complete!")

if __name__ == "__main__":
    download_and_extract()
