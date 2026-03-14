import React, { useState } from 'react';
import { Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const VoiceAssistant = ({ onTranscript, setSearchQuery }) => {
    const [isListening, setIsListening] = useState(false);
    const [feedback, setFeedback] = useState('');
    const navigate = useNavigate();

    // Memoize the recognition object
    const recognition = React.useMemo(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return null;
        
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';
        return rec;
    }, []);

    React.useEffect(() => {
        if (!recognition) return;

        recognition.onstart = () => {
            setIsListening(true);
            setFeedback('Listening...');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            setFeedback(transcript);
            
            // Intelligence: Handle simple navigation commands
            if (transcript.includes('go to cart') || transcript.includes('open cart')) {
                navigate('/cart');
                setFeedback('Opening your cart...');
            } else if (transcript.includes('go to orders') || transcript.includes('my orders')) {
                navigate('/orders');
                setFeedback('Showing your orders...');
            } else if (transcript.includes('go home') || transcript.includes('homepage')) {
                navigate('/');
                setFeedback('Going home...');
            } else if (transcript.includes('my profile') || transcript.includes('go to profile')) {
                navigate('/profile');
                setFeedback('Going to profile...');
            } else {
                // Search fallback
                if (setSearchQuery) {
                    setSearchQuery(transcript);
                }
                if (onTranscript) {
                    onTranscript(transcript);
                }
            }

            setTimeout(() => {
                setIsListening(false);
                setFeedback('');
            }, 2500);
        };

        recognition.onerror = (event) => {
            setIsListening(false);
            setFeedback('I didn\'t catch that. Try again?');
            setTimeout(() => setFeedback(''), 3000);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        return () => {
            recognition.stop();
        };
    }, [recognition, navigate, onTranscript, setSearchQuery]);

    const toggleListening = () => {
        if (!recognition) {
            alert('Speech Recognition is not supported in your browser. Please try Chrome or Edge.');
            return;
        }

        if (isListening) {
            recognition.stop();
        } else {
            setFeedback('Say something like "find jeans" or "go to cart"');
            recognition.start();
        }
    };

    return (
        <div className="relative flex items-center">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleListening}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                    isListening 
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-600 shadow-sm'
                }`}
            >
                {isListening ? (
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [4, 12, 4] }}
                                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                    className="w-0.5 bg-white rounded-full"
                                />
                            ))}
                        </div>
                        <span className="animate-pulse">Assistant</span>
                    </div>
                ) : (
                    <>
                        <Mic size={18} className="text-purple-500" />
                        <span className="hidden sm:inline">Voice</span>
                    </>
                )}
            </motion.button>

            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full mt-3 right-0 bg-white shadow-2xl rounded-2xl p-4 border border-purple-100 min-w-[220px] z-[110]"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${isListening ? 'bg-red-50' : 'bg-purple-50'}`}>
                                <Mic size={16} className={isListening ? 'text-red-500' : 'text-purple-500'} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Assistant</p>
                                <p className="text-xs font-bold text-gray-800 break-words">
                                    {feedback.startsWith('Say') ? feedback : `"${feedback}"`}
                                </p>
                            </div>
                        </div>
                        
                        {isListening && (
                            <div className="mt-3 pt-3 border-t border-gray-50 flex gap-2 overflow-x-auto no-scrollbar">
                                <span className="text-[8px] font-bold text-gray-400 uppercase whitespace-nowrap">Try:</span>
                                <span className="text-[8px] font-bold text-purple-400 uppercase whitespace-nowrap cursor-pointer hover:text-purple-600">"Go to cart"</span>
                                <span className="text-[8px] font-bold text-purple-400 uppercase whitespace-nowrap cursor-pointer hover:text-purple-600">"My orders"</span>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VoiceAssistant;
