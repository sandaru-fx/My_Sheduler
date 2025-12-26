import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, X, Sparkles, Command, Loader2 } from 'lucide-react';
import { parseCommand } from '../utils/aiParser';
import { addScheduleItem } from '../services/db';
import { ScheduleItem } from '../types';
import { extractTaskInfo } from '../services/aiService';
import { v4 as uuidv4 } from 'uuid';

interface CommandCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: () => void;
}

const CommandCenter: React.FC<CommandCenterProps> = ({ isOpen, onClose, onTaskAdded }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    
    // Initialize speech recognition if available
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        setFeedback('Processing voice input...');
        processVoiceInput(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setFeedback(`Voice input error: ${event.error}. Please try again or type instead.`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isOpen]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      setFeedback('Voice input not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setFeedback(null);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setFeedback('Listening... Speak now');
      } catch (error) {
        console.error('Voice input error:', error);
        setFeedback('Could not start microphone. Check permissions.');
        setIsListening(false);
      }
    }
  };

  // Local storage fallback for when API fails
  const saveScheduleItemLocally = (item: Omit<ScheduleItem, '_id'>) => {
    try {
      // Get existing items
      const existingItemsStr = localStorage.getItem('timeflow_schedule') || '[]';
      const existingItems = JSON.parse(existingItemsStr);
      
      // Add new item with a temporary ID
      const newItem = { ...item, _id: uuidv4() };
      existingItems.push(newItem);
      
      // Save back to localStorage
      localStorage.setItem('timeflow_schedule', JSON.stringify(existingItems));
      
      return newItem;
    } catch (e) {
      console.error('Error saving to localStorage:', e);
      return null;
    }
  };

  const processVoiceInput = async (text: string) => {
    setIsAiProcessing(true);
    try {
      // Use direct parsing for voice commands
      const parsedItem = parseCommand(text);
      
      if (parsedItem) {
        console.log('Scheduling item from voice:', parsedItem);
        
        try {
          // Try API first
          await addScheduleItem(parsedItem as Omit<ScheduleItem, '_id'>);
        } catch (apiError) {
          console.error('API error, using local storage fallback:', apiError);
          // If API fails, use localStorage fallback
          saveScheduleItemLocally(parsedItem as Omit<ScheduleItem, '_id'>);
        }
        
        setFeedback(`Scheduled: ${parsedItem.title} at ${parsedItem.startTime}`);
        setInput('');
        onTaskAdded(); // Notify parent to refresh schedule
        
        // Auto close after success
        setTimeout(() => {
          onClose();
          setFeedback(null);
        }, 1500);
      } else {
        setFeedback("Couldn't understand the command. Try 'Meeting tomorrow at 3pm'");
      }
    } catch (error) {
      console.error('Voice processing error:', error);
      setFeedback("Failed to schedule task. Please try again.");
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleBasicParsing = async (text: string) => {
    try {
      const parsedItem = parseCommand(text);
      if (parsedItem) {
        await addScheduleItem(parsedItem as Omit<ScheduleItem, '_id'>);
        setFeedback(`Scheduled: ${parsedItem.title} at ${parsedItem.startTime}`);
        setInput('');
        onTaskAdded();
        
        // Auto close after success
        setTimeout(() => {
          onClose();
          setFeedback(null);
        }, 1500);
      } else {
        setFeedback("Couldn't understand the command. Try 'Meeting tomorrow at 3pm'");
      }
    } catch (error) {
      console.error(error);
      setFeedback("Failed to schedule task.");
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    setFeedback(null);

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    // Process the input directly
    await processVoiceInput(input);
    setIsProcessing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* AI Background Glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-pink-500 to-indigo-500 animate-gradient-x" />
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-indigo-600/20 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/20">
                <Sparkles size={20} className="text-indigo-400" />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">AI Command Center</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center">
              <Command className="absolute left-4 text-gray-500" size={20} />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI to schedule something... (e.g., 'Team meeting tomorrow at 10am')"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-12 pr-14 text-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
              />
              <div className="absolute right-3 flex items-center gap-2">
                 <button 
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`p-2 rounded-xl transition-colors ${isListening 
                    ? 'bg-red-600 text-white animate-pulse' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                  aria-label="Toggle voice input"
                >
                  <Mic size={20} />
                </button>
                <button 
                  type="submit"
                  disabled={!input.trim() || isProcessing}
                  className={`p-2 rounded-xl transition-all ${
                    input.trim() && !isProcessing
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95' 
                      : 'bg-white/5 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {isProcessing || isAiProcessing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Feedback Area */}
          <div className="mt-4 min-h-[24px]">
            {feedback && (
              <p className={`text-sm font-medium text-center animate-in fade-in slide-in-from-top-2 ${
                feedback.includes('Failed') || feedback.includes("Couldn't") ? 'text-red-400' : 'text-emerald-400'
              }`}>
                {feedback}
              </p>
            )}
            {!feedback && (
               <div className="flex items-center justify-center gap-6 text-xs font-bold text-gray-600 uppercase tracking-widest">
                 <span><span className="text-indigo-500">Enter</span> to send</span>
                 <span><span className="text-indigo-500">Esc</span> to close</span>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
