import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, PhoneCall, X, Volume2 } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export default function AIVoiceReceptionist() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<string>('');

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Audio playback queue
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);
  const nextPlayTimeRef = useRef(0);

  const startVoiceSession = async () => {
    try {
      setIsConnecting(true);
      setTranscript('Connecting to AI Receptionist...');

      // 1. Setup Audio Context - Capture at 16kHz as required by Gemini
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

      // 2. Get Microphone Access
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      sourceRef.current = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);

      // 3. Setup Audio Processor (Capture)
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      // 4. Connect Gemini Live API
      const sessionPromise = ai.live.connect({
        model: "models/gemini-2.0-flash", // Using the standard production model name
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: `You are the virtual receptionist for Summit Estate Nigeria. 
          Your job is to greet visitors warmly, ask for their name, budget, and preferred location in Abuja.
          Keep your responses very short and conversational.
          If they want to book an inspection, ask for a preferred date.
          Once you have their details, say "I will have a human agent contact you shortly."`,
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsConnecting(false);
            setTranscript('Connected. Speak now...');

            // Start processing microphone input
            processorRef.current!.onaudioprocess = (e) => {
              if (isMuted) return;

              const inputData = e.inputBuffer.getChannelData(0);
              // Convert Float32 to Int16 PCM
              const pcmData = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                const s = Math.max(-1, Math.min(1, inputData[i]));
                pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
              }

              // Convert to Base64
              const buffer = new Uint8Array(pcmData.buffer);
              let binary = '';
              for (let i = 0; i < buffer.byteLength; i++) {
                binary += String.fromCharCode(buffer[i]);
              }
              const base64Data = btoa(binary);

              sessionPromise.then((session) => {
                session.sendRealtimeInput({
                  media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
                });
              });
            };

            sourceRef.current!.connect(processorRef.current!);
            processorRef.current!.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              playAudioChunk(base64Audio);
            }

            // Handle Interruption
            if (message.serverContent?.interrupted) {
              audioQueueRef.current = [];
              isPlayingRef.current = false;
            }

            // Handle Transcription
            const outputText = message.serverContent?.modelTurn?.parts[0]?.text;
            if (outputText) {
              setTranscript(prev => prev + ' ' + outputText);
            }
          },
          onerror: (error) => {
            console.error("Live API Error:", error);
            setTranscript('Connection error occurred.');
            stopVoiceSession();
          },
          onclose: () => {
            setTranscript('Call ended.');
            stopVoiceSession();
          }
        }
      });

      sessionRef.current = await sessionPromise;

    } catch (error) {
      console.error("Failed to start voice session:", error);
      setIsConnecting(false);
      setTranscript('Microphone access denied. Please allow mic access (requires localhost or HTTPS).');
    }
  };

  const playAudioChunk = (base64Audio: string) => {
    if (!audioContextRef.current) return;

    // Decode base64 to Int16Array
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const int16Array = new Int16Array(bytes.buffer);

    // Convert Int16 to Float32
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / (int16Array[i] < 0 ? 32768 : 32767);
    }

    audioQueueRef.current.push(float32Array);
    scheduleNextAudio();
  };

  const scheduleNextAudio = () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0 || !audioContextRef.current) return;

    isPlayingRef.current = true;
    const audioData = audioQueueRef.current.shift()!;

    const audioBuffer = audioContextRef.current.createBuffer(1, audioData.length, 24000); // Gemini Live Output is 24kHz
    audioBuffer.getChannelData(0).set(audioData);

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);

    const currentTime = audioContextRef.current.currentTime;
    const startTime = Math.max(currentTime, nextPlayTimeRef.current);

    source.start(startTime);
    nextPlayTimeRef.current = startTime + audioBuffer.duration;

    source.onended = () => {
      isPlayingRef.current = false;
      scheduleNextAudio();
    };
  };

  const stopVoiceSession = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current.onaudioprocess = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (sessionRef.current) {
      sessionRef.current.close();
    }

    setIsConnected(false);
    setIsConnecting(false);
    audioQueueRef.current = [];
    isPlayingRef.current = false;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleClose = () => {
    stopVoiceSession();
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          startVoiceSession();
        }}
        className={`fixed bottom-24 right-6 h-14 w-14 bg-ink-800 border border-gold-400/50 hover:bg-ink-700 text-gold-400 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 z-40 ${isOpen ? 'hidden' : 'flex'}`}
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
                <Volume2 className="h-5 w-5 text-gold-400" />
                <h3 className="font-serif font-semibold text-white">Voice Receptionist</h3>
              </div>
              <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-8 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className={`absolute inset-0 bg-gold-400/20 rounded-full ${isConnected && !isMuted ? 'animate-ping' : ''}`}></div>
                <div className="relative h-24 w-24 bg-ink-900 border border-gold-400/30 rounded-full flex items-center justify-center">
                  {isConnecting ? (
                    <div className="w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Mic className={`h-10 w-10 ${isConnected ? 'text-gold-400' : 'text-gray-500'}`} />
                  )}
                </div>
              </div>

              <div className="text-center h-16">
                <p className="text-sm text-gray-400 italic line-clamp-2">
                  {transcript || (isConnected ? "Listening..." : "Click start to call")}
                </p>
              </div>

              <div className="flex space-x-4 w-full">
                {!isConnected && !isConnecting ? (
                  <button
                    onClick={startVoiceSession}
                    className="flex-1 bg-gold-400 hover:bg-gold-500 text-ink-900 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center"
                  >
                    <PhoneCall className="h-5 w-5 mr-2" />
                    Start Call
                  </button>
                ) : (
                  <>
                    <button
                      onClick={toggleMute}
                      className={`flex-1 ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-ink-900 text-white'} border border-white/10 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center`}
                    >
                      {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={stopVoiceSession}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center"
                    >
                      End Call
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
