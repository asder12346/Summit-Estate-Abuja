import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, PhoneCall, X, Volume2 } from 'lucide-react';
// import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

// Disabled for Vercel deployment due to Serverless function WebSocket limitations.
export default function AIVoiceReceptionist() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-6 h-14 w-14 bg-ink-800 border border-gold-400/50 hover:bg-ink-700 text-gray-500 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 z-40 ${isOpen ? 'hidden' : 'flex'} opacity-50 cursor-not-allowed`}
        title="Voice features currently unavailable"
      >
        <PhoneCall className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-80 bg-ink-800 border border-white/10 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            <div className="bg-ink-900 border-b border-white/10 p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Volume2 className="h-5 w-5 text-gray-500" />
                <h3 className="font-serif font-semibold text-gray-400">Voice Receptionist</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-8 flex flex-col items-center justify-center space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-4">
                  Voice features are currently disabled for this deployment due to serverless constraints.
                </p>
                <p className="text-sm text-gold-400 cursor-pointer hover:underline" onClick={() => {
                  setIsOpen(false);
                  window.dispatchEvent(new CustomEvent('open-ai-chat'));
                }}>
                  Please use the Text Chatbot instead.
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-ink-900 border border-white/10 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
