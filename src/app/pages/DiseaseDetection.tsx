import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import {
  Upload,
  CheckCircle,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  Leaf,
  FlaskConical,
  RefreshCw,
  Printer,
  Sparkles,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../components/AuthProvider';
import { BackButton } from '../components/BackButton';
import { supabase } from '../lib/supabase';
import { diagnoseCropDisease, DiagnosisResult } from '../lib/aiService';

const DIAGNOSTIC_STEPS = [
  'Inspecting leaf morphology & cellular tissue...',
  'Evaluating pathogen markers against CIBRC database...',
  'Formulating organic biocontrol & chemical schedule...'
];

export function DiseaseDetection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosticStepIndex, setDiagnosticStepIndex] = useState(0);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const { user, updatePoints } = useAuth();

  useEffect(() => {
    let interval: any;
    if (analyzing) {
      interval = setInterval(() => {
        setDiagnosticStepIndex((prev) => (prev + 1) % DIAGNOSTIC_STEPS.length);
      }, 900);
    } else {
      setDiagnosticStepIndex(0);
    }
    return () => clearInterval(interval);
  }, [analyzing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        toast.error('Image is too large. Please choose an image under 15MB.');
        return;
      }
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
      // Execute multimodal vision AI diagnostic pipeline
      const diagnosis = await diagnoseCropDisease(selectedImage);

      setResult(diagnosis);
      updatePoints(10);
      toast.success('Pathology analysis complete! +10 Krishi points earned.');

      if (user?.email) {
        try {
          await supabase.from('prediction_history').insert([
            {
              user_email: user.email,
              prediction_type: 'Disease Detection',
              input_data: { image: 'leaf_photo_analyzed' },
              result: diagnosis.disease,
            }
          ]);
        } catch (_) {}
        try {
          const list = JSON.parse(localStorage.getItem('sagri_prediction_history') || '[]');
          list.unshift({
            prediction_type: 'Disease Detection',
            result: diagnosis.disease,
            input_data: { image: 'leaf_photo_analyzed' },
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('sagri_prediction_history', JSON.stringify(list.slice(0, 50)));
        } catch (_) {}
      }
    } catch (error: any) {
      console.error('Diagnostic error:', error);
      toast.error(`Pathology analysis error: ${error.message || 'Please try again.'}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'None':
        return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-300';
      case 'Low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300';
      case 'High':
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <Header />
      <VoiceAssistant />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Leaf className="w-8 h-8 text-green-600 dark:text-green-400" />
              Multimodal Plant Pathology & Disease Detection
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Autonomous vision model for instant crop disease diagnosis, organic remedies, and CIBRC chemical prescriptions.
            </p>
          </div>
        </div>

        {!selectedImage ? (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-12 text-center bg-white dark:bg-gray-800 shadow-sm hover:border-green-500 transition-colors">
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
              <div className="p-5 bg-green-100 dark:bg-green-900/40 rounded-full shadow-inner">
                <Upload className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-1">
                <span className="text-xl font-semibold text-gray-900 dark:text-white block">
                  Upload or Capture Crop Leaf Image
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 block">
                  Supports JPG, PNG, WEBP up to 15MB. Ensure good natural lighting on leaf symptoms.
                </span>
              </div>
            </label>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
            {/* Image Preview Banner */}
            <div className="relative">
              <img src={selectedImage} alt="Crop Specimen" className="w-full h-72 object-cover" />
              {!analyzing && !result && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button
                    onClick={analyzeImage}
                    className="px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-lg shadow-xl flex items-center gap-2 transform hover:scale-105 transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Run AI Pathology Diagnosis
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 md:p-8">
              {/* Loading State */}
              {analyzing && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-full">
                    <Loader2 className="w-10 h-10 text-green-600 dark:text-green-400 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Analyzing Plant Pathology
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium animate-pulse mt-1">
                      {DIAGNOSTIC_STEPS[diagnosticStepIndex]}
                    </p>
                  </div>
                </div>
              )}

              {/* Diagnosis Output Results */}
              {result && (
                <div className="space-y-6">
                  {/* Top Diagnosis Card */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Identified Condition
                        </span>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
                          {result.disease}
                        </h2>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityBadgeColor(
                            result.severity
                          )}`}
                        >
                          Severity: {result.severity}
                        </span>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-full text-xs font-semibold">
                          Confidence: {(result.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {result.recommendation}
                      </p>
                    </div>
                  </div>

                  {/* Dual Treatment Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Organic Biocontrols */}
                    <div className="p-6 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                          <Leaf className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                        </div>
                        <h3 className="font-bold text-emerald-950 dark:text-emerald-300 text-lg">
                          Organic & Biocontrol Remedies
                        </h3>
                      </div>
                      <ul className="space-y-2.5">
                        {(result.organicTreatment || []).map((item: any, idx) => {
                          const text = typeof item === 'object' && item !== null
                            ? [item.name, item.dosage, item.frequency].filter(Boolean).join(' — ') || JSON.stringify(item)
                            : String(item ?? '');
                          return (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm text-emerald-900 dark:text-emerald-200"
                            >
                              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>{text}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Chemical CIBRC Protocol */}
                    <div className="p-6 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                          <FlaskConical className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                        </div>
                        <h3 className="font-bold text-blue-950 dark:text-blue-300 text-lg">
                          CIBRC Approved Chemical Therapy
                        </h3>
                      </div>
                      <ul className="space-y-2.5">
                        {(result.treatment || []).map((item: any, idx) => {
                          const text = typeof item === 'object' && item !== null
                            ? [item.name, item.dosage, item.frequency].filter(Boolean).join(' — ') || JSON.stringify(item)
                            : String(item ?? '');
                          return (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm text-blue-900 dark:text-blue-200"
                            >
                              <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                              <span>{text}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  {/* Prevention Protocol */}
                  {result.prevention && result.prevention.length > 0 && (
                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-base mb-3 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                        Preventive Agronomic Practices
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {result.prevention.map((prev: any, idx) => {
                          const text = typeof prev === 'object' && prev !== null
                            ? [prev.name, prev.tip, prev.action].filter(Boolean).join(' — ') || JSON.stringify(prev)
                            : String(prev ?? '');
                          return (
                            <div
                              key={idx}
                              className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2"
                            >
                              <span className="w-5 h-5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                                {idx + 1}
                              </span>
                              <span>{text}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setResult(null);
                      }}
                      className="flex-1 px-6 py-3.5 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Diagnose Another Leaf
                    </button>
                    <button
                      onClick={() => {
                        window.print();
                        toast.success('Pathology report ready for print/PDF export.');
                      }}
                      className="flex-1 px-6 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Printer className="w-4 h-4" />
                      Export Pathology Report
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
