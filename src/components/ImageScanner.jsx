import React, { useState, useRef } from 'react';
import { Scan, X, Image as ImageIcon, Sparkles, CheckCircle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ImageScanner = () => {
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, scanning, result
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                startScanning();
            };
            reader.readAsDataURL(file);
        }
    };

    const startScanning = () => {
        setStatus('scanning');
        setTimeout(() => {
            setStatus('result');
            // After scanning, we could potentially navigate to products with a search term
            // For now, let's just show a success message or mock results
        }, 3000);
    };

    const resetScanner = () => {
        setIsScannerOpen(false);
        setStatus('idle');
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSearchClick = () => {
        navigate('/products', { state: { search: 'scanned item' } });
        resetScanner();
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsScannerOpen(true)}
                className="p-2.5 bg-gray-100 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                title="Scan Image"
            >
                <Scan size={20} />
            </button>

            <AnimatePresence>
                {isScannerOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={resetScanner}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg relative overflow-hidden"
                        >
                            <div className="p-8">
                                <button 
                                    onClick={resetScanner}
                                    className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
                                >
                                    <X size={20} />
                                </button>

                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Scan size={32} className="text-blue-600" />
                                    </div>
                                    <h2 className="text-3xl font-black text-gray-900">Visual Scanner</h2>
                                    <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-2">Find anything by image</p>
                                </div>

                                <div className="relative aspect-video bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center">
                                    {preview ? (
                                        <div className="relative w-full h-full">
                                            <img src={preview} alt="Scanning" className="w-full h-full object-cover" />
                                            {status === 'scanning' && (
                                                <motion.div 
                                                    animate={{ top: ['0%', '100%', '0%'] }}
                                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                                    className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center p-6">
                                            <ImageIcon size={48} className="text-gray-300 mx-auto mb-4" />
                                            <p className="text-sm font-bold text-gray-400">Select an image to start scanning</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 space-y-4">
                                    {status === 'idle' && (
                                        <button 
                                            onClick={() => fileInputRef.current.click()}
                                            className="w-full bg-primary-gradient py-5 rounded-2xl text-white font-black shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                        >
                                            <ImageIcon size={24} />
                                            Choose Image
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                onChange={handleFileSelect} 
                                                className="hidden" 
                                                accept="image/*"
                                            />
                                        </button>
                                    )}

                                    {status === 'scanning' && (
                                        <div className="w-full bg-gray-100 py-5 rounded-2xl text-gray-400 font-black flex items-center justify-center gap-3 animate-pulse">
                                            <Sparkles size={24} />
                                            Analyzing Visual Features...
                                        </div>
                                    )}

                                    {status === 'result' && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-4"
                                        >
                                            <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center gap-4">
                                                <div className="bg-green-500 p-2 rounded-full text-white">
                                                    <CheckCircle size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-green-800">Scan Complete!</p>
                                                    <p className="text-xs font-bold text-green-600 uppercase tracking-tighter">AI found matching products</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={handleSearchClick}
                                                className="w-full bg-dark-gradient py-5 rounded-2xl text-white font-black shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                            >
                                                <Search size={24} />
                                                View Matching Products
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImageScanner;
