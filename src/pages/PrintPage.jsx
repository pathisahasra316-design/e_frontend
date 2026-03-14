import React from 'react';
import { motion } from 'framer-motion';
import { Printer } from 'lucide-react';
import PrintMachine from '../components/PrintMachine';

const PrintPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-fuchsia-50/20 py-10 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex items-center gap-4"
                >
                    <div className="w-14 h-14 bg-primary-gradient rounded-[18px] flex items-center justify-center shadow-xl shadow-violet-200">
                        <Printer size={26} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Smart Print Station</h1>
                        <p className="text-gray-400 text-sm font-bold">Upload, scan &amp; get prints delivered in 2 hours</p>
                    </div>
                </motion.div>

                {/* Full Print Machine */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <PrintMachine compact={false} />
                </motion.div>
            </div>
        </div>
    );
};

export default PrintPage;
