import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, PhoneCall, X, Volume2 } from 'lucide-react';
import { GoogleGenAI, Modality } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

export default function AIVoiceReceptionist() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const sessionRef = useRef<any>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const isMutedRef = useRef(false);

  // Audio playback queue
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);
  const nextPlayTimeRef = useRef(0);

  const playAudioChunk = (base64Audio: string) => {
    if (!outputAudioContextRef.current) return;

    const binaryString = atob(base64Audio);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const int16Array = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32[i] = int16Array[i] / 32768.0;
    }
    audioQueueRef.current.push(float32);
    scheduleNextAudio();
  };

  const scheduleNextAudio = () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0 || !outputAudioContextRef.current) return;

    isPlayingRef.current = true;
    const audioData = audioQueueRef.current.shift()!;
    const ctx = outputAudioContextRef.current;

    const audioBuffer = ctx.createBuffer(1, audioData.length, 24000);
    audioBuffer.getChannelData(0).set(audioData);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    const startTime = Math.max(ctx.currentTime, nextPlayTimeRef.current);
    source.start(startTime);
    nextPlayTimeRef.current = startTime + audioBuffer.duration;

    source.onended = () => {
      isPlayingRef.current = false;
      scheduleNextAudio();
    };
  };

  const startVoiceSession = async () => {
    try {
      setIsConnecting(true);
      setErrorMsg('');
      setTranscript('Connecting to AI Receptionist...');

      // Separate contexts: input at 16kHz for mic, output at 24kHz for playback
      inputAudioContextRef.current = new AudioContext({ sampleRate: 16000 });
      outputAudioContextRef.current = new AudioContext({ sampleRate: 24000 });

      // Get mic access
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      sourceRef.current = inputAudioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
      processorRef.current = inputAudioContextRef.current.createScriptProcessor(2048, 1, 1);

      const ai = new GoogleGenAI({ apiKey: API_KEY });

      const session = await ai.live.connect({
        model: 'gemini-2.0-flash-live-001',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: {
            parts: [{
              text: `You are the friendly virtual receptionist for Summit Estate Nigeria. 
Greet the visitor warmly by name if known. Ask for their name, budget, and preferred location in Abuja.
Keep your responses very short and conversational (1-2 sentences max).
If they want to book an inspection, ask for a preferred date.
Once you have their details, say "Wonderful! A human agent will contact you shortly."`
            }]
          },
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsConnecting(false);
            setTranscript('Connected — speak now!');

            // Wire mic → processor → send to Gemini
            processorRef.current!.onaudioprocess = (e) => {
              if (isMutedRef.current || !session) return;

              const inputData = e.inputBuffer.getChannelData(0);
              // Float32 → Int16 PCM
              const pcm = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                const s = Math.max(-1, Math.min(1, inputData[i]));
                pcm[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
              }
              // Int16 → Base64
              const bytes = new Uint8Array(pcm.buffer);
              let b64 = '';
              for (let i = 0; i < bytes.byteLength; i++) b64 += String.fromCharCode(bytes[i]);

              session.sendRealtimeInput({
                media: { mimeType: 'audio/pcm;rate=16000', data: btoa(b64) },
              });
            };

            sourceRef.current!.connect(processorRef.current!);
            processorRef.current!.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: (msg: any) => {
            // Play audio from AI
            const audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio) playAudioChunk(audio);

            // Clear queue if AI was interrupted
            if (msg.serverContent?.interrupted) {
              audioQueueRef.current = [];
              isPlayingRef.current = false;
            }

            // Show transcription
            const text = msg.serverContent?.outputTranscription?.text || msg.serverContent?.modelTurn?.parts?.[0]?.text;
            if (text) setTranscript(text);
          },
          onerror: (err: any) => {
            console.error('Live API error:', err);
            setErrorMsg('Connection error. Please try again.');
            stopVoiceSession();
          },
          onclose: () => {
            setTranscript('Call ended.');
            stopVoiceSession();
          },
        },
      });

      sessionRef.current = session;

    } catch (err: any) {
      console.error('startVoiceSession error:', err);
      setIsConnecting(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMsg('Microphone access denied. Please allow access and try again.');
      } else {
        setErrorMsg('Failed to connect. Check your API key and internet connection.');
      }
    }
  };

  const stopVoiceSession = () => {
    processorRef.current?.disconnect();
    if (processorRef.current) processorRef.current.onaudioprocess = null;
    sourceRef.current?.disconnect();
    mediaStreamRef.current?.getTracks().forEach(t => t.stop());
    inputAudioContextRef.current?.close();
    outputAudioContextRef.current?.close();
    try { sessionRef.current?.close(); } catch (_) { }

    sessionRef.current = null;
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    nextPlayTimeRef.current = 0;
    setIsConnected(false);
    setIsConnecting(false);
  };

  const toggleMute = () => {
    isMutedRef.current = !isMutedRef.current;
    setIsMuted(isMutedRef.current);
  };

  const handleClose = () => {
    stopVoiceSession();
    setTranscript('');
    setErrorMsg('');
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
    startVoiceSession();
  };

  return (
    <>
      {/* Floating Phone Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-24 right-6 h-14 w-14 bg-ink-800 border border-gold-400/50 hover:bg-ink-700 text-gold-400 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-40"
          title="Start Voice Call"
        >
          <PhoneCall className="h-6 w-6" />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-80 bg-ink-800 border border-white/10 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-ink-900 border-b border-white/10 px-4 py-3 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Volume2 className="h-5 w-5 text-gold-400" />
                <h3 className="font-serif font-semibold text-white">Voice Receptionist</h3>
                {isConnected && <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />}
              </div>
              <button
                onClick={handleClose}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-red-500/80 text-white flex items-center justify-center transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col items-center space-y-5">
              {/* Mic Orb */}
              <div className="relative">
                {isConnected && !isMuted && (
                  <div className="absolute inset-0 bg-gold-400/20 rounded-full animate-ping" />
                )}
                <div className="relative h-24 w-24 bg-ink-900 border-2 border-gold-400/30 rounded-full flex items-center justify-center">
                  {isConnecting ? (
                    <div className="w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Mic className={`h-10 w-10 transition-colors ${isConnected ? (isMuted ? 'text-red-400' : 'text-gold-400') : 'text-gray-500'}`} />
                  )}
                </div>
              </div>

              {/* Status / Transcript */}
              <div className="text-center min-h-[48px] w-full">
                {errorMsg ? (
                  <p className="text-sm text-red-400">{errorMsg}</p>
                ) : (
                  <p className="text-sm text-gray-400 italic line-clamp-3">{transcript || 'Press Start Call to begin'}</p>
                )}
              </div>

              {/* Controls */}
              <div className="flex space-x-3 w-full">
                {!isConnected && !isConnecting ? (
                  <button
                    onClick={startVoiceSession}
                    className="flex-1 bg-gold-400 hover:bg-gold-500 text-ink-900 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="h-4 w-4" />
                    Start Call
                  </button>
                ) : (
                  <>
                    <button
                      onClick={toggleMute}
                      className={`flex-1 border py-3 rounded-xl font-semibold transition-colors flex items-center justify-center
                        ${isMuted ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-ink-900 border-white/10 text-white hover:bg-white/5'}`}
                    >
                      {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={stopVoiceSession}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-colors"
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
