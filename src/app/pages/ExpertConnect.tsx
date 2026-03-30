import { useState, useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { MessageCircle, Send, User, CheckCircle, Bot, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { BackButton } from '../components/BackButton';

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

  // AI response generator based on expert's specialty
  const generateAIResponse = (userMessage: string, expert: typeof experts[0]): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Greet responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('namaste')) {
      return `Hello! ${expert.name} here. ${expert.greeting}`;
    }

    // Disease-related (Dr. Rajesh Verma)
    if (expert.name === 'Dr. Rajesh Verma') {
      if (lowerMessage.includes('spot') || lowerMessage.includes('brown') || lowerMessage.includes('yellow')) {
        return 'Based on the symptoms you described, this could be a fungal infection or nutrient deficiency. Can you tell me: 1) Which crop is affected? 2) When did you first notice these spots? 3) What\'s the weather like in your area? This will help me provide a more accurate diagnosis.';
      }
      if (lowerMessage.includes('wheat') || lowerMessage.includes('rice') || lowerMessage.includes('cotton')) {
        return 'I see you\'re asking about crop health. To give you the best advice, could you describe the symptoms you\'re seeing? Are there any visible spots, discoloration, or unusual growth patterns? Also, have you noticed any pests?';
      }
      if (lowerMessage.includes('pest') || lowerMessage.includes('insect')) {
        return 'For pest management, I recommend an integrated approach: 1) Identify the specific pest (can you describe it?), 2) Use neem-based organic pesticides initially, 3) Implement crop rotation, 4) Maintain field hygiene. What type of pest are you dealing with?';
      }
      if (lowerMessage.includes('treatment') || lowerMessage.includes('cure') || lowerMessage.includes('spray')) {
        return 'Treatment depends on the specific disease. Generally: 1) Remove and destroy infected plants, 2) Apply appropriate fungicide or pesticide, 3) Improve drainage and air circulation, 4) Follow up with preventive measures. Can you tell me what disease you\'re treating?';
      }
    }

    // Soil-related (Dr. Sunita Sharma)
    if (expert.name === 'Dr. Sunita Sharma') {
      if (lowerMessage.includes('test') || lowerMessage.includes('testing')) {
        return 'Soil testing is crucial! I recommend getting your soil tested every 2-3 years. The test will check pH, NPK levels, organic matter, and micronutrients. You can get it done at your nearest agricultural office or through our SAGRI Soil Health feature. Would you like guidance on collecting soil samples?';
      }
      if (lowerMessage.includes('fertilizer') || lowerMessage.includes('npk')) {
        return 'Fertilizer recommendations depend on your soil test results and crop. Generally for Punjab soils: For Wheat - Use 120kg N, 60kg P2O5, 40kg K2O per hectare. For Rice - 150kg N, 60kg P2O5, 40kg K2O. But I strongly recommend soil testing first. What crop are you planning to grow?';
      }
      if (lowerMessage.includes('ph') || lowerMessage.includes('acidic') || lowerMessage.includes('alkaline')) {
        return 'Soil pH is very important! Most crops prefer pH 6.0-7.5. If your soil is too acidic (below 6), add lime. If too alkaline (above 8), add gypsum or sulfur. What\'s your current pH level? If you don\'t know, I can guide you on how to test it.';
      }
      if (lowerMessage.includes('organic') || lowerMessage.includes('compost')) {
        return 'Organic matter is excellent for soil health! I recommend: 1) Add compost (5-10 tons per hectare), 2) Use green manure crops like dhaincha, 3) Apply farmyard manure, 4) Practice crop rotation. This improves soil structure, water retention, and nutrient availability. How much land are you working with?';
      }
    }

    // Irrigation-related (Dr. Vikram Singh)
    if (expert.name === 'Dr. Vikram Singh') {
      if (lowerMessage.includes('drip') || lowerMessage.includes('irrigation')) {
        return 'Drip irrigation is highly efficient! Benefits: 1) Saves 40-60% water, 2) Better crop yield, 3) Reduced labor cost, 4) Prevents weed growth. Initial investment is ₹50,000-₹1 lakh per acre, but you\'ll recover it in 2-3 years. Subsidy of 50-80% is available under government schemes. Interested in setting it up?';
      }
      if (lowerMessage.includes('water') || lowerMessage.includes('schedule')) {
        return 'Watering schedule depends on crop and season. For wheat: 5-6 irrigations needed. For rice: Keep 2-3 inches standing water. For cotton: Irrigate every 15-20 days. Best time is early morning or evening. Avoid midday watering. What crop are you irrigating?';
      }
      if (lowerMessage.includes('sprinkler')) {
        return 'Sprinkler systems are great for uniform water distribution! Best for: 1) Wheat, 2) Vegetables, 3) Uneven land. Water saving: 30-40%. Cost: ₹30,000-₹60,000 per acre. Government provides 50% subsidy. Would you like to know about installation process?';
      }
    }

    // Organic farming (Dr. Priya Patel)
    if (expert.name === 'Dr. Priya Patel') {
      if (lowerMessage.includes('organic') || lowerMessage.includes('certification')) {
        return 'Organic certification is a great move! Process: 1) 3-year conversion period, 2) Stop all chemical inputs, 3) Maintain detailed records, 4) Annual inspections. Cost: ₹15,000-₹30,000 yearly. But organic products fetch 20-50% premium price! Shall I guide you through the certification process?';
      }
      if (lowerMessage.includes('pesticide') || lowerMessage.includes('natural')) {
        return 'Natural pest control options: 1) Neem oil spray (very effective!), 2) Garlic-chili spray for aphids, 3) Tobacco extract for caterpillars, 4) Cow urine fermentation, 5) Release beneficial insects like ladybugs. These are safe and effective! Which pest problem are you facing?';
      }
      if (lowerMessage.includes('compost') || lowerMessage.includes('vermi')) {
        return 'Composting is the heart of organic farming! Methods: 1) Vermicompost (best quality) - ready in 45-60 days, 2) Pit composting - 3-4 months, 3) NADEP composting - 90 days. Use kitchen waste, crop residue, animal manure. 1 ton of compost replaces 5-6 bags of chemical fertilizer! Want to start composting?';
      }
    }

    // General responses
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return `You're welcome! I'm always here to help. Feel free to ask if you have more questions about ${expert.specialty.toLowerCase()}. Happy farming! 🌾`;
    }

    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return 'For pricing and cost-related queries, I recommend checking the Market Price section in SAGRI app. It shows real-time mandi prices. For input costs, I can guide you based on your specific needs. What would you like to know about?';
    }

    if (lowerMessage.includes('weather') || lowerMessage.includes('rain')) {
      return 'Weather is crucial for farming! I recommend checking the Weather Intelligence dashboard in SAGRI for accurate forecasts. Based on weather, I can advise on: 1) Irrigation scheduling, 2) Pest prevention, 3) Harvesting timing. What\'s your specific weather-related concern?';
    }

    // Default helpful response
    const defaultResponses = [
      `That's an interesting question about ${expert.specialty.toLowerCase()}. Could you provide more details so I can give you specific advice? For example: your crop type, current conditions, and what you're trying to achieve.`,
      `As a ${expert.specialty}, I'd be happy to help with that. To give you the best advice, could you tell me more about your specific situation? What crop are you growing and what exactly are you observing?`,
      `I have ${expert.experience} of experience in ${expert.specialty.toLowerCase()}. I can definitely help you with this. Can you provide more context? What symptoms or issues are you seeing?`,
      `Good question! In my experience, the solution depends on several factors. Could you share: 1) Your crop type, 2) Current growth stage, 3) Any visible symptoms? This will help me provide tailored advice.`,
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

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

  const handleSendMessage = () => {
    if (!message.trim() || selectedExpert === null) return;

    const newUserMessage: Message = {
      sender: 'user',
      message: message.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages([...chatMessages, newUserMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(newUserMessage.message, experts[selectedExpert]);
      const newExpertMessage: Message = {
        sender: 'expert',
        message: aiResponse,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, newExpertMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Random delay 1.5-2.5 seconds for realistic feel
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