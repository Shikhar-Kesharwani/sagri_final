import os
import shutil

def prepare_dataset():
    base_dir = os.path.dirname(__file__)
    src_dir = os.path.join(base_dir, "..", "data", "temp_plantvillage", "raw", "color")
    dest_dir = os.path.join(base_dir, "..", "data", "PlantVillage")
    temp_repo = os.path.join(base_dir, "..", "data", "temp_plantvillage")
    
    if not os.path.exists(src_dir):
        print(f"Error: {src_dir} does not exist. Did the git clone fail?")
        return
        
    print(f"Moving images from {src_dir} to {dest_dir}...")
    
    # Create dest if it doesn't exist
    os.makedirs(dest_dir, exist_ok=True)
    
    # Move each class folder
    for item in os.listdir(src_dir):
        s = os.path.join(src_dir, item)
        d = os.path.join(dest_dir, item)
        if os.path.isdir(s):
            if os.path.exists(d):
                shutil.rmtree(d) # Replace if exists
            shutil.move(s, d)
            print(f"Moved {item}")
            
    print("All classes moved successfully!")
    
    # Cleanup git repo
    print(f"Cleaning up temporary repository {temp_repo}...")
    # Change permissions for .git objects to allow deletion on Windows
    def onerror(func, path, exc_info):
        import stat
        if not os.access(path, os.W_OK):
            os.chmod(path, stat.S_IWUSR)
            func(path)
        else:
            raise
            
    shutil.rmtree(temp_repo, onerror=onerror)
    print("Cleanup complete. Dataset is ready at backend/data/PlantVillage")

if __name__ == "__main__":
    prepare_dataset()
