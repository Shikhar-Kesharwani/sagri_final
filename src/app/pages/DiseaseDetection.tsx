import { useState } from 'react';
import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { Camera, Upload, X, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../components/AuthProvider';
import { BackButton } from '../components/BackButton';
import { supabase } from '../lib/supabase';

const API_BASE_URL =
  (import.meta as any).env?.VITE_BACKEND_URL?.trim() || 'http://127.0.0.1:8000';

export function DiseaseDetection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { user, updatePoints } = useAuth();

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
        disease: data?.disease || 'Unknown disease',
        confidence: typeof data?.confidence === 'number' ? data.confidence : 0,
        severity: data?.severity || 'Unknown',
        immediate_action: data?.immediate_action || '',
        chemical_treatment: data?.chemical_treatment || '',
        organic_treatment: data?.organic_treatment || '',
        recheck_days: data?.recheck_days || 0,
        color: data?.color || 'red',
        // Fallbacks for missing database case
        recommendation: data?.recommendation || '',
        treatment: Array.isArray(data?.treatment) ? data.treatment : [],
      };
      
      setResult(safeResult);
      updatePoints(10);
      toast.success('AI Analysis complete! +10 points');

      if (user?.email) {
        await supabase.from('prediction_history').insert([{
          user_email: user.email,
          prediction_type: 'Disease Detection',
          input_data: { image: 'uploaded_image' },
          result: safeResult.disease,
        }]);
      }

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <Header />
      <VoiceAssistant />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton />
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Disease Detection</h1>

        {!selectedImage ? (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 text-center bg-white dark:bg-gray-800">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center gap-4"
            >
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Upload className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-lg font-medium text-gray-900 dark:text-white">Upload leaf image</span>
            </label>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
            <img src={selectedImage} alt="Selected" className="w-full h-64 object-cover" />
            <div className="p-6">
              {!result && !analyzing && (
                <button
                  onClick={analyzeImage}
                  className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Analyze Image
                </button>
              )}
              
              {analyzing && (
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </div>
              )}

              {result && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{result.disease}</h3>
                    <p className="text-sm text-gray-500">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
                  </div>
                  
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
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
