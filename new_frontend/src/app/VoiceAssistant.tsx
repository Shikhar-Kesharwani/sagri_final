import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";

type Language = "en-IN" | "hi-IN" | "pa-IN";

export function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [lang, setLang] = useState<Language>("hi-IN");
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang;

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleVoiceCommand(text);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [lang]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      setResponse("");
      recognitionRef.current.lang = lang;
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        /* already started */
      }
    }
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceCommand = (rawText: string) => {
    const text = rawText.toLowerCase();

    if (text.includes("disease") || text.includes("bimari") || text.includes("रोग") || text.includes("leaf")) {
      const reply = "Opening Disease Detection scanner.";
      setResponse(reply);
      speak(reply);
      setTimeout(() => navigate("/disease-detection"), 1000);
    } else if (text.includes("crop") || text.includes("fasal") || text.includes("फसल") || text.includes("recommend")) {
      const reply = "Opening Crop Recommendation Engine.";
      setResponse(reply);
      speak(reply);
      setTimeout(() => navigate("/crop-recommendation"), 1000);
    } else if (text.includes("price") || text.includes("mandi") || text.includes("bhav") || text.includes("भाव") || text.includes("रेट")) {
      const reply = "Opening Mandi Price Forecaster.";
      setResponse(reply);
      speak(reply);
      setTimeout(() => navigate("/price-forecasting"), 1000);
    } else if (text.includes("risk") || text.includes("khatra") || text.includes("नुकसान") || text.includes("जोखिम")) {
      const reply = "Opening Crop Failure Risk Radar.";
      setResponse(reply);
      speak(reply);
      setTimeout(() => navigate("/risk-prediction"), 1000);
    } else if (text.includes("weather") || text.includes("mausam") || text.includes("मौसम") || text.includes("rain")) {
      const reply = "Checking local weather and spraying window.";
      setResponse(reply);
      speak(reply);
      setTimeout(() => navigate("/weather"), 1000);
    } else if (text.includes("scheme") || text.includes("yojana") || text.includes("योजना") || text.includes("subsidy")) {
      const reply = "Opening Government Schemes and PM-Kisan.";
      setResponse(reply);
      speak(reply);
      setTimeout(() => navigate("/schemes"), 1000);
    } else if (text.includes("loan") || text.includes("kcc") || text.includes("कर्ज")) {
      const reply = "Opening Kisan Credit Card loan eligibility.";
      setResponse(reply);
      speak(reply);
      setTimeout(() => navigate("/loans"), 1000);
    } else {
      const reply = `I heard: "${rawText}". Taking you to Krishi Sahayak AI for detailed guidance.`;
      setResponse(reply);
      speak(reply);
      setTimeout(() => navigate(`/expert-connect?q=${encodeURIComponent(rawText)}`), 1200);
    }
  };

  return (
    <>
      {/* Floating trigger button in bottom right */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsOpen(true);
            toggleListening();
          }}
          className={`flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-colors ${
            isListening ? "bg-red-500 text-white animate-pulse" : "bg-emerald-600 text-white hover:bg-emerald-500"
          }`}
          title="Voice Assistant (Hindi / English / Punjabi)"
        >
          {isListening ? <Mic className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </motion.button>
      </div>

      {/* Floating Dialog Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl border border-line bg-card p-5 shadow-2xl backdrop-blur-lg print:hidden"
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-500" />
                <h4 className="font-semibold text-foreground">Krishi Voice Assistant</h4>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (recognitionRef.current) recognitionRef.current.stop();
                  setIsListening(false);
                }}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Language:</span>
              <div className="flex gap-1">
                {(
                  [
                    ["hi-IN", "हिंदी"],
                    ["en-IN", "English"],
                    ["pa-IN", "ਪੰਜਾਬੀ"],
                  ] as const
                ).map(([l, name]) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`rounded px-2 py-0.5 font-medium ${
                      lang === l ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div className="my-4 min-h-[70px] rounded-xl bg-muted/50 p-3 text-sm">
              {isListening && !transcript && (
                <p className="animate-pulse text-muted-foreground">Listening... (Speak in Hindi or English)</p>
              )}
              {transcript && (
                <p className="font-medium text-foreground">
                  <span className="text-xs text-muted-foreground">You said: </span>"{transcript}"
                </p>
              )}
              {response && (
                <p className="mt-2 text-emerald-600 dark:text-emerald-400 font-medium">
                  {response}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={toggleListening}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors ${
                  isListening ? "bg-red-500 hover:bg-red-600" : "bg-emerald-600 hover:bg-emerald-500"
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4" /> Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" /> Tap to Speak
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
