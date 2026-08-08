import joblib
import sys
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def shrink_model():
    model_path = Path('models/price_forecast_model.pkl')
    cloud_model_path = Path('models/price_forecast_model_cloud.pkl')
    
    if not model_path.exists():
        logger.error(f"Original model not found at {model_path}")
        return
        
    logger.info(f"Loading massive model from {model_path}...")
    try:
        data = joblib.load(model_path)
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        return
        
    model = data['model']
    logger.info(f"Original model has {model.n_estimators} estimators.")
    
    # Shrink the random forest to just 5 trees
    TARGET_TREES = 5
    if model.n_estimators > TARGET_TREES:
        logger.info(f"Shrinking forest to {TARGET_TREES} trees...")
        model.estimators_ = model.estimators_[:TARGET_TREES]
        model.n_estimators = TARGET_TREES
        
    # Re-package and save
    data['model'] = model
    
    logger.info(f"Saving shrunken model to {cloud_model_path}...")
    joblib.dump(data, cloud_model_path, compress=3)
    
    # Calculate sizes
    original_size = model_path.stat().st_size / (1024 * 1024)
    cloud_size = cloud_model_path.stat().st_size / (1024 * 1024)
    
    logger.info(f"Original size: {original_size:.2f} MB")
    logger.info(f"Shrunken size: {cloud_size:.2f} MB")
    logger.info("Successfully created the cloud-only model!")

if __name__ == "__main__":
    shrink_model()
