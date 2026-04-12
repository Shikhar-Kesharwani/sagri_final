import { useState } from 'react';
import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { Camera, Upload, X, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../components/AuthProvider';
import { BackButton } from '../components/BackButton';

const API_BASE_URL =
  (import.meta as any).env?.VITE_BACKEND_URL?.trim() || 'http://127.0.0.1:8000';

export function DiseaseDetection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { updatePoints } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setAnalyzing(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/detect_disease`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_data: selectedImage
        }),
      });

      if (!response.ok) {
        let errorMessage = 'AI Model Error';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
          const text = await response.text();
          if (text) errorMessage = text;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const safeResult = {
        ...data,
        treatment: Array.isArray(data?.treatment) ? data.treatment : [],
        color: data?.color || 'red',
        disease: data?.disease || 'Unknown disease',
        confidence: typeof data?.confidence === 'number' ? data.confidence : 0,
        severity: data?.severity || 'Unknown',
        recommendation: data?.recommendation || 'No recommendation available.',
      };
      
      setResult(safeResult);
      updatePoints(10);
      toast.success('AI Analysis complete! +10 points');
    } catch (error: any) {
      console.error('AI error:', error);
      if (error.message.includes('Failed to fetch')) {
        toast.error(`Cannot connect to AI backend at ${API_BASE_URL}. Make sure FastAPI is running.`);
      } else {
        toast.error(`AI Error: ${error.message}`);
      }
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <VoiceAssistant />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <BackButton className="mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Crop Disease Detection
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload a photo of your crop to detect diseases using AI
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 mb-6">
          {!selectedImage ? (
            <div>
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer hover:border-green-500 dark:hover:border-green-500 transition-colors bg-gray-50 dark:bg-gray-900/50"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <Camera className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    PNG, JPG or JPEG (MAX. 10MB)
                  </p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                  Tips for best results:
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                  <li>• Take photos in good lighting</li>
                  <li>• Focus on affected leaves or parts</li>
                  <li>• Capture close-up images</li>
                  <li>• Avoid blurry photos</li>
                </ul>
              </div>
            </div>
          ) : (
            <div>
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Selected crop"
                  className="w-full h-96 object-contain rounded-xl bg-gray-100 dark:bg-gray-900"
                />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setResult(null);
                  }}
                  className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!result && !analyzing && (
                <button
                  onClick={analyzeImage}
                  className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Analyze Image
                </button>
              )}

              {analyzing && (
                <div className="mt-6 p-8 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                  <Loader2 className="w-12 h-12 text-green-600 dark:text-green-400 animate-spin mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Analyzing your crop...
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    AI model processing image
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  result.color === 'green'
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : result.color === 'orange'
                    ? 'bg-orange-100 dark:bg-orange-900/30'
                    : 'bg-red-100 dark:bg-red-900/30'
                }`}
              >
                {result.color === 'green' ? (
                  <CheckCircle
                    className={`w-6 h-6 ${
                      result.color === 'green' ? 'text-green-600 dark:text-green-400' : ''
                    }`}
                  />
                ) : (
                  <AlertTriangle
                    className={`w-6 h-6 ${
                      result.color === 'orange'
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.disease}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Confidence: {result.confidence}% • Severity: {result.severity}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Recommendation</h3>
                <p className="text-gray-700 dark:text-gray-300">{result.recommendation}</p>
              </div>

              {Array.isArray(result.treatment) && result.treatment.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Treatment Steps
                  </h3>
                  <div className="space-y-2">
                    {result.treatment.map((step: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setResult(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Analyze Another
                </button>
                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all">
                  Save Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
