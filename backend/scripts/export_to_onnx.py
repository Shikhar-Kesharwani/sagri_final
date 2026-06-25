import os
import sys
import torch

# Import our custom architecture
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "models"))
from crop_disease_net import CropDiseaseNet
import json

def export():
    model_path = os.path.join(os.path.dirname(__file__), "..", "models", "best_disease_model.pth")
    onnx_path = os.path.join(os.path.dirname(__file__), "..", "models", "disease_model.onnx")
    class_names_path = os.path.join(os.path.dirname(__file__), "..", "models", "class_names.json")
    
    if not os.path.exists(model_path):
        print(f"Error: Could not find PyTorch model at {model_path}. Please train the model first.")
        return
        
    if not os.path.exists(class_names_path):
        print(f"Error: Could not find {class_names_path}.")
        return
        
    with open(class_names_path, 'r') as f:
        classes = json.load(f)
        
    num_classes = len(classes)
    
    print(f"Loading PyTorch model with {num_classes} classes...")
    model = CropDiseaseNet(num_classes=num_classes)
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.eval()
    
    # Create dummy input matching the shape expected by the model (batch_size=1, channels=3, height=224, width=224)
    dummy_input = torch.randn(1, 3, 224, 224)
    
    print("Exporting to ONNX...")
    torch.onnx.export(
        model, 
        dummy_input, 
        onnx_path, 
        export_params=True,
        opset_version=14, 
        do_constant_folding=True,
        input_names=['input'], 
        output_names=['output'],
        dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}}
    )
    
    print(f"Successfully exported to {onnx_path}")
    
if __name__ == "__main__":
    export()
