import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Upload, CheckCircle, Clock, Image as ImageIcon, Sparkles, Mic, ShoppingBag, Scan } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PrintMachine = ({ compact = false }) => {
    const [status, setStatus] = useState('idle'); // idle, scanning, printing, completed, voice
    const [preview, setPreview] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [voiceFeedback, setVoiceFeedback] = useState('');
    
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                startPrintingProcess();
            };
            reader.readAsDataURL(file);
        }
    };

    const startPrintingProcess = () => {
        setStatus('scanning');
        setTimeout(() => {
            setStatus('printing');
            setTimeout(() => {
                setStatus('completed');
            }, 4000);
        }, 2000);
    };

    const handleScanClick = () => {
        fileInputRef.current.click();
    };

    const handleVoiceSearch = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'auto'; // Detect language automatically
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
            setVoiceFeedback('Listening in any language...');
            setStatus('voice');
        };

        recognition.onresult = async (event) => {
            const transcript = event.results[0][0].transcript;
            setVoiceFeedback(`"${transcript}"`);
            
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
                // Send to AI for translation and product matching
                const { data } = await axios.post('http://localhost:5000/api/ai/chat', { 
                    message: `The user said this in their language: "${transcript}". Please translate to English and find related products or if they want to print something.` 
                }, config);
                
                setVoiceFeedback(data.reply);
                // If the AI reply contains keywords, we can show specific products
                // For now, let's just show a success message
            } catch (error) {
                setVoiceFeedback("Sorry, I couldn't understand that. Please try again.");
            }
        };

        recognition.onerror = () => {
            setIsListening(false);
            setStatus('idle');
        };

        recognition.onend = () => {
            setIsListening(false);
            setTimeout(() => setStatus('idle'), 5000);
        };

        recognition.start();
    };

    const resetMachine = () => {
        setStatus('idle');
        setPreview(null);
        setVoiceFeedback('');
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className={`relative ${compact ? 'p-4 rounded-[24px] gap-6' : 'p-8 rounded-[40px] gap-12 my-12'} bg-white shadow-2xl border border-gray-100 flex flex-col md:flex-row items-center transition-all duration-500`}>
            {/* Top Right Quick Controls */}
            <div className="absolute top-4 right-4 flex gap-2 z-[60]">
                <button 
                    onClick={handleVoiceSearch}
                    className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center hover:bg-purple-100 hover:scale-110 transition-all shadow-sm border border-purple-100/50"
                    title="AI Voice Assistant"
                >
                    <Mic size={18} />
                </button>
                <button 
                    onClick={handleScanClick}
                    className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center hover:bg-blue-100 hover:scale-110 transition-all shadow-sm border border-blue-100/50"
                    title="Document Scanner"
                >
                    <Scan size={18} />
                </button>
            </div>
            {/* Left Side: The Machine Visual */}
            <div className={`relative ${compact ? 'w-24 h-24' : 'w-full md:w-1/2 aspect-square'} bg-gray-50 rounded-2xl overflow-hidden border-2 border-gray-50 flex items-center justify-center p-4`}>
                {!compact && (
                    <div className="absolute top-4 left-6 flex gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${status === 'idle' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className={`w-2 h-2 rounded-full ${status === 'scanning' ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></div>
                        <div className={`w-2 h-2 rounded-full ${status === 'printing' ? 'bg-purple-500 animate-pulse' : 'bg-gray-300'}`}></div>
                    </div>
                )}

                <AnimatePresence mode="wait">

                    {status === 'voice' && (
                        <motion.div 
                            key="voice"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center p-6 w-full"
                        >
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <motion.div 
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute inset-0 bg-purple-500 rounded-full"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-purple-600 rounded-full text-white">
                                    <Mic size={32} />
                                </div>
                            </div>
                            <h3 className="text-lg font-black text-gray-800 mb-2">Multilingual AI</h3>
                            <p className="text-sm font-bold text-purple-600 animate-pulse min-h-[40px] leading-tight">
                                {voiceFeedback || 'Speak now...'}
                            </p>
                            {!isListening && (
                                <button 
                                    onClick={() => navigate('/products')}
                                    className="mt-4 px-6 py-2 bg-primary-gradient text-white rounded-xl font-bold text-xs flex items-center gap-2 mx-auto"
                                >
                                    <ShoppingBag size={14} /> View Recommended Products
                                </button>
                            )}
                        </motion.div>
                    )}

                    {status === 'idle' && (
                        <motion.div 
                            key="idle"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="text-center"
                        >
                            <div className={`${compact ? 'w-10 h-10 mb-0' : 'w-24 h-24 mb-6'} bg-purple-100 rounded-full flex items-center justify-center mx-auto`}>
                                <Printer size={compact ? 20 : 40} className="text-purple-600" />
                            </div>
                            {!compact && (
                                <>
                                    <h3 className="text-2xl font-black text-gray-800 mb-2">Smart Print Station</h3>
                                    <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">Express 2h Delivery</p>
                                </>
                            )}
                        </motion.div>
                    )}

                    {(status === 'scanning' || status === 'printing') && (
                        <motion.div 
                            key="active"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative w-full h-full flex flex-col items-center justify-center"
                        >
                            {status === 'scanning' && (
                                <motion.div 
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="absolute left-0 right-0 h-1 bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10"
                                />
                            )}
                            
                            {status === 'printing' && (
                                <motion.div 
                                    className="absolute bottom-0 left-0 right-0 bg-white shadow-md border-t-2 border-purple-500 overflow-hidden"
                                    initial={{ height: 0 }}
                                    animate={{ height: '100%' }}
                                    transition={{ duration: 4 }}
                                >
                                    <img src={preview} alt="Print Preview" className="w-full h-full object-cover opacity-50 contrast-125" />
                                </motion.div>
                            )}

                            <div className={`relative z-0 opacity-30 grayscale ${compact ? 'max-h-16' : ''}`}>
                                <img src={preview} alt="Work" className={`${compact ? 'h-16' : 'max-h-60'} rounded-lg`} />
                            </div>
                            
                            {!compact && (
                                <p className="mt-8 font-black text-purple-600 uppercase tracking-widest animate-pulse">
                                    {status === 'scanning' ? 'Analyzing Image...' : 'Printing High-Res...'}
                                </p>
                            )}
                        </motion.div>
                    )}

                    {status === 'completed' && (
                        <motion.div 
                            key="completed"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <div className={`${compact ? 'w-10 h-10 mb-0' : 'w-24 h-24 mb-6'} bg-green-100 rounded-full flex items-center justify-center mx-auto`}>
                                <CheckCircle size={compact ? 20 : 40} className="text-green-600" />
                            </div>
                            {!compact && (
                                <>
                                    <h3 className="text-3xl font-black text-gray-800 mb-2">Order Confirmed!</h3>
                                    <div className="flex items-center justify-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-black text-xs uppercase tracking-tighter mx-auto w-max mb-6">
                                        <Clock size={14} /> Delivered in 2 Hours
                                    </div>
                                    <button 
                                        onClick={resetMachine}
                                        className="text-purple-600 font-bold hover:underline"
                                    >
                                        Print Another One
                                    </button>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Right Side: Controls */}
            <div className={`flex-1 ${compact ? 'space-y-3' : 'space-y-8'}`}>
                <div>
                    <h2 className={`${compact ? 'text-xl' : 'text-4xl'} font-black text-gray-900 mb-1 leading-tight`}>
                        {compact ? 'Quick Print' : 'Snap, Scan'} <br />
                        <span className="text-gradient">{compact ? '2hr Delivery' : 'Delivered in 2 Hours.'}</span>
                    </h2>
                    {!compact && (
                        <p className="text-gray-500 font-medium leading-relaxed">
                            The world's fastest physical printing service. Send your images/designs and get them delivered to your doorstep in less than 2 hours.
                        </p>
                    )}
                </div>

                {!compact && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-3xl border border-gray-200">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3">
                                <ImageIcon size={20} className="text-blue-500" />
                            </div>
                            <h4 className="font-black text-sm text-gray-800">Premium Glossy</h4>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Ultra High Res</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-3xl border border-gray-200">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3">
                                <Sparkles size={20} className="text-yellow-500" />
                            </div>
                            <h4 className="font-black text-sm text-gray-800">AI Enhanced</h4>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Auto Color Fix</p>
                        </div>
                    </div>
                )}

                {status === 'idle' ? (
                    <div className="flex items-center justify-center w-full py-4">
                        <div className="flex flex-col items-center gap-2 group">
                            <button 
                                onClick={() => fileInputRef.current.click()}
                                className="w-20 h-20 bg-primary-gradient text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all border-4 border-white"
                                title="Upload Image"
                            >
                                <Upload size={32} />
                            </button>
                            <span className="text-xs font-black uppercase tracking-widest text-gray-500">Upload & Print</span>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileUpload} 
                                className="hidden" 
                                accept="image/*"
                            />
                        </div>
                    </div>
                ) : (
                    <div className={`w-full bg-gray-100 ${compact ? 'py-3' : 'py-5'} rounded-2xl text-gray-400 font-black ${status === 'completed' ? 'cursor-pointer' : 'cursor-not-allowed'} flex items-center justify-center gap-3 text-sm transition-colors`}>
                        <Printer size={16} className="animate-bounce" />
                        {status === 'completed' && compact ? (
                            <button onClick={resetMachine} className="text-purple-600">Reset</button>
                        ) : 'Processing...'}
                    </div>
                )}

                {compact && status === 'completed' && (
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-tighter w-max">
                        <CheckCircle size={12} className="text-green-600" /> Order confirmed: Delivery in 2 hours
                    </div>
                )}

                {!compact && (
                    <div className="flex items-center gap-2 px-2">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            +1.2k People used this today
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrintMachine;
