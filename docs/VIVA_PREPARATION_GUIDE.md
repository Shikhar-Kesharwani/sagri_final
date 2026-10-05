# SAGRI: AIML Lab Viva Preparation & Defense Guide
**Course:** Artificial Intelligence and Machine Learning Laboratory (Lab Week 8)  
**Project:** SAGRI (Smart Agriculture and Krishi Sahayak)  
**Institution:** Bennett University, Greater Noida  
**Evaluator:** Monu Singh  
**Team Members:**
- Shikhar Kesharwani (S24CSEU0502) - Lead Machine Learning Engineer
- Santusht Lakhanpal (S24CSEU0465) - Computer Vision Engineer
- Sanchit Jain (S24CSEU0460) - Full-Stack & Integration Engineer

---

## High-Probability Viva Questions & Model Answers

### Question 1 (For Shikhar): Why did you choose Random Forest instead of a Deep Neural Network (MLP) for crop recommendation?
**Model Answer:**
> "Agricultural soil and weather data is tabular, not spatial like images or sequential like audio. In tabular agronomic data, there are sharp, orthogonal threshold rules (for example, rice strictly requires annual rainfall above 180 mm and neutral to slightly acidic pH). Neural networks require heavy normalization, large training sets, and extensive hyperparameter tuning to converge on tabular data, and they risk overfitting on small sample sizes (our dataset has 2,200 samples across 22 crops). 
> 
> Random Forest uses an ensemble of 100 decision trees with Gini Impurity splits. It natively handles non-linear boundaries without feature scaling sensitivity, avoids overfitting through bagging, trains in seconds, and provides clean class probability distributions via `.predict_proba()` so we can display the top-3 recommended crops with percentage confidence."

---

### Question 2 (For Santusht): What is Depthwise Separable Convolution, and why did you use MobileNetV2 instead of ResNet-50?
**Model Answer:**
> "In standard convolutions (like in VGG or ResNet), spatial filtering across height and width and channel cross-correlation across color channels are calculated together in a single heavy step. The computational cost is $D_K^2 \cdot M \cdot N \cdot D_F^2$.
> 
> MobileNetV2 breaks this into two separate steps:
> 1. **Depthwise Convolution:** A single 3x3 filter is applied to each input channel separately to capture spatial edges.
> 2. **Pointwise Convolution:** A 1x1 filter is applied across all channels to combine them into new features.
> 
> Mathematically, the computation ratio is $\frac{1}{N} + \frac{1}{D_K^2} \approx \frac{1}{9}$. This gives about 8 to 9 times fewer operations with less than 1% drop in top-1 accuracy. Furthermore, by exporting the model into ONNX format (`disease_model.onnx`), we can run inference using `onnxruntime` on a standard laptop CPU in just 112 milliseconds without needing an expensive GPU."

---

### Question 3 (For Shikhar): What is "Temporal Data Leakage" in your Crop Risk model, and how did you prevent it?
**Model Answer:**
> "In many published student papers and Kaggle notebooks, researchers use standard random k-fold cross-validation. When you randomly split climate data across years, samples from the same drought year (like the severe 2015 drought) end up in both the training set and the test set. The model simply memorizes that 2015 was dry, instead of learning generalizable risk relationships. This is called temporal data leakage and gives falsely inflated test scores.
> 
> In SAGRI, we used a strict chronological split: we trained our regularized XGBoost classifier only on historical records from 1960 to 2012 (230,252 records), and evaluated it strictly on the subsequent 2013 to 2017 seasons (95,166 records). Our model achieved an ROC-AUC of 0.892 on this holdout period, proving it genuinely generalizes to future unseen agricultural cycles."

---

### Question 4 (For Shikhar / Sanchit): Why was inflation adjustment necessary for mandi price forecasting?
**Model Answer:**
> "A quintal of wheat sold for Rs 300 twenty years ago and sells for over Rs 2,200 today. If you feed raw rupee numbers from the past 20 years into a regression model, the model mistakes general currency depreciation for an agricultural supply-and-demand trend.
> 
> To fix this, we adjusted historical modal prices using India's monthly Wholesale Price Index (WPI): 
> $\text{Price}_{\text{adjusted}} = \text{Price}_{\text{nominal}} \times (\text{WPI}_{\text{base}} / \text{WPI}_t)$.
> We then extracted a 1-month lag feature along with month-of-year cyclical variables and local rainfall. This allowed our Random Forest regressor to achieve a Mean Absolute Percentage Error (MAPE) of 8.35%."

---

### Question 5 (For Sanchit): How does your frontend communicate with the machine learning models?
**Model Answer:**
> "We built an asynchronous REST gateway using Python FastAPI in `backend/main.py`. The models are loaded into server memory once during application startup using `@app.on_event('startup')`. 
> 
> When the farmer enters data in the React frontend (running on port 5173), Axios makes an HTTP POST request to endpoints like `/api/predict_crop` or `/api/detect_disease` on port 8000. FastAPI uses Pydantic schemas to validate that all values (such as soil N, P, K, pH) are realistic numbers. The preloaded in-memory model executes in under 50 milliseconds, and returns a JSON response containing the prediction, confidence percentages, and advisory tips, which React immediately renders into responsive cards."

---

### Question 6 (For Sanchit): What happens if a farmer does not know their exact soil N-P-K numbers?
**Model Answer:**
> "We recognized that many small farmers in India do not have recent soil health test cards. To make SAGRI practical and feasible, we integrated an ICAR-backed state profile database in `backend/data/state_profiles.csv`. 
> 
> When a farmer selects their state from the dropdown, our `/api/state-profile/{state}` endpoint automatically fetches and pre-fills the regional average soil N, P, K, pH, and rainfall values. The farmer can either use these averages directly or adjust them if they have partial information."
