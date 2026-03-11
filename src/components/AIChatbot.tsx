import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Hello! Welcome to **Summit Estate Nigeria**. I am your professional real estate advisor, dedicated to helping you secure the best land opportunities in Abuja.\n\nWhether you are looking for high-yield investment advice, need clarity on documentation such as a Certificate of Occupancy (C of O) or Right of Occupancy (R of O), or want to explore our prime listings, I am here to guide you.\n\nWe have excellent options across the FCT, including:\n* **Lugbe:** ₦15M – ₦30M (High growth area)\n* **Guzape/Asokoro:** ₦80M – ₦150M+\n* **Maitama:** ₦200M+\n\nHow can I assist you today? I highly recommend **booking an inspection** to see our available plots and start your journey toward land ownership.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-chat', handleOpen);
    return () => window.removeEventListener('open-ai-chat', handleOpen);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!chatRef.current) {
      chatRef.current = ai.chats.create({
        model: 'gemini-2.0-flash-exp', // Or suitable model
        config: {
          systemInstruction: `You are a helpful and professional AI real estate advisor for Summit Estate Nigeria. 
          You help users find land in Abuja, explain documentation (C of O, R of O), and provide investment advice.
          Keep answers concise, professional, and persuasive.
          If asked about prices, give realistic estimates (e.g., Lugbe: 15M-30M, Maitama: 100M+).
          Always encourage users to book an inspection.`,
        }
      });
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMessage });
      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 h-14 w-14 bg-gold-400 hover:bg-gold-500 text-ink-900 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 z-40 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-ink-800 border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-ink-900 border-b border-white/10 p-4 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gold-400/20 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5 text-gold-400" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-white">AI Advisor</h3>
                  <p className="text-xs text-green-400 flex items-center">
                    <span className="h-2 w-2 bg-green-400 rounded-full mr-1"></span> Online
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.role === 'user'
                    ? 'bg-gold-400 text-ink-900 rounded-tr-sm'
                    : 'bg-ink-900 border border-white/10 text-gray-200 rounded-tl-sm'
                    }`}>
                    {msg.role === 'user' ? (
                      msg.text
                    ) : (
                      <div className="space-y-4 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-1 [&>ol]:list-decimal [&>ol]:pl-5 [&_strong]:text-gold-400">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-ink-900 border border-white/10 rounded-2xl rounded-tl-sm p-4 flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-ink-900 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about properties..."
                  className="flex-1 bg-ink-800 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="h-10 w-10 bg-gold-400 hover:bg-gold-500 disabled:opacity-50 disabled:hover:bg-gold-400 text-ink-900 rounded-full flex items-center justify-center transition-colors"
                >
                  <Send className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
