import { useState, useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { MessageCircle, Send, User, CheckCircle, Bot, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { BackButton } from '../components/BackButton';
import { expertApi } from '../../utils/api';

interface Message {
  sender: 'expert' | 'user';
  message: string;
  time: string;
}

export function ExpertConnect() {
  const [selectedExpert, setSelectedExpert] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const experts = [
    {
      name: 'Dr. Rajesh Verma',
      specialty: 'Crop Disease Specialist',
      experience: '15 years',
      rating: 4.8,
      available: true,
      languages: ['Hindi', 'English', 'Punjabi'],
      greeting: 'Namaste! I am Dr. Rajesh Verma, crop disease specialist. How can I help you with your crops today?',
      expertise: ['wheat diseases', 'pest control', 'fungal infections', 'crop treatment'],
    },
    {
      name: 'Dr. Sunita Sharma',
      specialty: 'Soil Health Expert',
      experience: '12 years',
      rating: 4.9,
      available: true,
      languages: ['Hindi', 'English'],
      greeting: 'Hello! Dr. Sunita Sharma here. I specialize in soil health. What would you like to know about your soil?',
      expertise: ['soil testing', 'fertilizer recommendations', 'pH balance', 'organic matter'],
    },
    {
      name: 'Dr. Vikram Singh',
      specialty: 'Irrigation & Water Management',
      experience: '18 years',
      rating: 4.7,
      available: false,
      languages: ['Hindi', 'Punjabi'],
      greeting: 'Sat Sri Akal! Dr. Vikram Singh speaking. I can help you with irrigation and water management. What is your question?',
      expertise: ['drip irrigation', 'water conservation', 'sprinkler systems', 'scheduling'],
    },
    {
      name: 'Dr. Priya Patel',
      specialty: 'Organic Farming Advisor',
      experience: '10 years',
      rating: 4.9,
      available: true,
      languages: ['Hindi', 'English', 'Gujarati'],
      greeting: 'Hello! I am Dr. Priya Patel, organic farming specialist. How can I assist you with sustainable farming practices?',
      expertise: ['organic certification', 'natural pesticides', 'composting', 'biofertilizers'],
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleExpertSelect = (index: number) => {
    setSelectedExpert(index);
    // Start with expert's greeting
    const expert = experts[index];
    setChatMessages([
      {
        sender: 'expert',
        message: expert.greeting,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || selectedExpert === null) return;

    const currentExpert = experts[selectedExpert];
    const newUserMessage: Message = {
      sender: 'user',
      message: message.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newUserMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      const res = await expertApi.chat({
        message: newUserMessage.message,
        expert_name: currentExpert.name,
        expert_specialty: currentExpert.specialty
      });
      
      setChatMessages((prev) => [...prev, {
        sender: 'expert',
        message: res.response,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [...prev, {
        sender: 'expert',
        message: "I'm having trouble connecting to my knowledge base right now. Please try again later.",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <VoiceAssistant />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <BackButton className="mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Connect with Experts
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get professional advice from agricultural experts powered by AI
          </p>
          <div className="mt-2 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <Sparkles className="w-4 h-4" />
            <span>AI-powered assistants available 24/7</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Experts List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              Available Experts
            </h2>
            {experts.map((expert, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExpertSelect(index)}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 p-4 cursor-pointer transition-all ${
                  selectedExpert === index
                    ? 'border-green-500 ring-2 ring-green-200 dark:ring-green-900'
                    : 'border-gray-100 dark:border-gray-700 hover:border-green-300'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {expert.name.charAt(0)}
                    </div>
                    {expert.available && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
                        title="AI Assistant Active"
                      >
                        <Bot className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{expert.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{expert.specialty}</p>
                  </div>
                  {expert.available && (
                    <div className="w-3 h-3 bg-green-500 rounded-full" title="Available" />
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <span>⭐ {expert.rating}</span>
                    <span>•</span>
                    <span>{expert.experience}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {expert.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  className={`w-full mt-3 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    expert.available
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!expert.available}
                >
                  <Bot className="w-4 h-4" />
                  {expert.available ? 'Start AI Chat' : 'Busy'}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            {selectedExpert !== null ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 h-[600px] flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 rounded-t-2xl">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {experts[selectedExpert].name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      {experts[selectedExpert].name}
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-normal">
                        AI Assistant
                      </span>
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {experts[selectedExpert].specialty}
                    </p>
                  </div>
                  <Sparkles className="w-5 h-5 text-green-500" />
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900/50">
                  {chatMessages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}
                    >
                      {msg.sender === 'expert' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          {experts[selectedExpert].name.charAt(0)}
                        </div>
                      )}
                      <div
                        className={`max-w-md ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                        } rounded-2xl px-4 py-2 shadow-md`}
                      >
                        <p className="text-sm whitespace-pre-line">{msg.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender === 'user'
                              ? 'text-green-100'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {experts[selectedExpert].name.charAt(0)}
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                              className="w-2 h-2 bg-gray-400 rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-2xl">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your farming question..."
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && message.trim()) {
                          handleSendMessage();
                        }
                      }}
                    />
                    <button
                      disabled={!message.trim() || isTyping}
                      onClick={handleSendMessage}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    💡 Powered by AI • Responses are generated based on agricultural expertise
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <Bot className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Select an Expert
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Choose an AI expert assistant from the list to start chatting
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-400">
                    <Sparkles className="w-4 h-4" />
                    <span>All experts are AI-powered for instant 24/7 support</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}