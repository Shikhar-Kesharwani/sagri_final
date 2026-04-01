"""
DISEASE DETECTION TRAINING SCRIPT (MobileNetV2 Transfer Learning)
-----------------------------------------------------------------
INSTRUCTIONS FOR GOOGLE COLAB:
1. Go to https://colab.research.google.com/
2. Change Runtime to GPU (Runtime -> Change runtime type -> T4 GPU).
3. Paste this code into a new notebook cell.
4. Upload your Kaggle `kaggle.json` token to download the dataset automatically.
5. Run the cell to train and save the model as `disease_mobilenet.keras`.
"""

import os
import tensorflow as tf
from tensorflow.keras import layers, models, applications

def main():
    print("🚀 Starting Crop Disease Detection Training...")
    
    # Check GPU
    if not tf.config.list_physical_devices('GPU'):
        print("⚠️ Warning: No GPU detected! Training will be very slow. Switch to GPU in Colab.")
    else:
        print("✅ GPU detected! Training will be fast.")

    # 1. Download Dataset automagically from Kaggle using Token
    dataset_dir = "dataset/New Plant Diseases Dataset(Augmented)/New Plant Diseases Dataset(Augmented)"
    if not os.path.exists(dataset_dir):
        print("📥 Downloading PlantVillage dataset from Kaggle...")
        os.system("pip install -q kaggle")
        
        # New Kaggle authentication token system
        os.environ['KAGGLE_API_TOKEN'] = "KGAT_8d51afc36811ec9b9dd732c28bb2a9a0"
        
        os.system("kaggle datasets download -d vipoooool/new-plant-diseases-dataset")
        os.system("unzip -q new-plant-diseases-dataset.zip -d dataset")

    # Paths (adjust if dataset structure is different)
    train_dir = os.path.join(dataset_dir, "train")
    valid_dir = os.path.join(dataset_dir, "valid")
    
    if not os.path.exists(train_dir):
        raise FileNotFoundError(f"Cannot find training directory exactly at: {train_dir}. Please check your extracted files.")

    # 2. Data Generators (Loads images efficiently)
    print("📂 Loading images...")
    BATCH_SIZE = 32
    IMG_SIZE = (224, 224)

    train_dataset = tf.keras.utils.image_dataset_from_directory(train_dir, shuffle=True, batch_size=BATCH_SIZE, image_size=IMG_SIZE)
    valid_dataset = tf.keras.utils.image_dataset_from_directory(valid_dir, shuffle=True, batch_size=BATCH_SIZE, image_size=IMG_SIZE)

    class_names = train_dataset.class_names
    print(f"Found {len(class_names)} disease classes.")

    # Optional: Improve performance by caching
    AUTOTUNE = tf.data.AUTOTUNE
    train_dataset = train_dataset.prefetch(buffer_size=AUTOTUNE)
    valid_dataset = valid_dataset.prefetch(buffer_size=AUTOTUNE)

    # 3. Model Architecture (Transfer Learning)
    print("🧠 Building MobileNetV2 Model...")
    # Preprocessing layer specifically for MobileNetV2
    preprocess_input = tf.keras.applications.mobilenet_v2.preprocess_input

    # Base pretrained model
    base_model = applications.MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
    base_model.trainable = False # Freeze base weights

    # Add custom head
    inputs = tf.keras.Input(shape=(224, 224, 3))
    x = preprocess_input(inputs)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.2)(x) # Prevent overfitting
    outputs = layers.Dense(len(class_names), activation='softmax')(x)

    model = tf.keras.Model(inputs, outputs)

    # 4. Compile Model
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.001), 
                  loss='sparse_categorical_crossentropy', 
                  metrics=['accuracy'])

    # 5. Train Model
    print("🔥 Training Model (Fast mode: 5 epochs)...")
    history = model.fit(train_dataset, validation_data=valid_dataset, epochs=5)

    # 6. Save Model
    # Saving as .keras format which is the new standard
    model_filename = "disease_mobilenet.keras"
    model.save(model_filename)
    
    # Also save the class names to a text file so your backend knows how to map indices to names
    with open("disease_classes.txt", "w") as f:
        for name in class_names:
            f.write(f"{name}\n")
            
    print(f"🎯 Model trained and saved as '{model_filename}'!")
    print("🎯 Class labels saved as 'disease_classes.txt'!")
    print("Download both files and place them in your backend folder.")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Error: {e}")
