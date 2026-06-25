import os
import tensorflow_datasets as tfds
from PIL import Image

def download_and_extract():
    print("Downloading PlantVillage dataset via TFDS...")
    
    # load the dataset
    ds, info = tfds.load('plant_village', split='train', with_info=True)
    
    base_dir = os.path.join(os.path.dirname(__file__), "..", "data", "PlantVillage")
    os.makedirs(base_dir, exist_ok=True)
    
    # Get the class names
    class_names = info.features['label'].names
    
    # Create directories for each class
    for label_name in class_names:
        os.makedirs(os.path.join(base_dir, label_name), exist_ok=True)
        
    print(f"Extracting images to {base_dir}...")
    
    for i, ex in enumerate(ds):
        img_array = ex['image'].numpy()
        label_idx = ex['label'].numpy()
        label_name = class_names[label_idx]
        
        img = Image.fromarray(img_array)
        
        if img.mode != 'RGB':
            img = img.convert('RGB')
            
        img_path = os.path.join(base_dir, label_name, f"image_{i}.jpg")
        img.save(img_path)
        
        if (i + 1) % 5000 == 0:
            print(f"Extracted {i + 1} images...")
            
    print("Download and extraction complete!")

if __name__ == "__main__":
    download_and_extract()
