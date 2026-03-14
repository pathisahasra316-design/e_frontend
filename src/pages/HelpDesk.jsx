import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Phone, Mail, HelpCircle, ChevronRight, Search, Zap, LifeBuoy, FileText } from 'lucide-react';

const HelpDesk = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFaq, setActiveFaq] = useState(null);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [showChat, setShowChat] = useState(false);

    const faqs = [
        { q: "How can I track the status of my order?", a: "Go to 'Orders' in your profile to see real-time tracking. We provide a tracking number as soon as the item is dispatched. For our Smart Print Station orders, you can track the courier's exact location after the printing window." },
        { q: "What is your return and exchange policy?", a: "We offer a 30-day hassle-free return policy for most items. Items must be in original condition with tags. For electronics, the return window is 7 days. You can initiate a return directly from the order details page." },
        { q: "Which payment methods do you support?", a: "We support all major Credit/Debit cards (Visa, Mastercard, Amex), UPI (Google Pay, PhonePe, Paytm), and Net Banking. All transactions are secured with 256-bit SSL encryption." },
        { q: "What should I do if I receive a damaged item?", a: "Please report any damages within 48 hours of delivery. You can do this by clicking 'Report Issue' on the order page or by contacting our Live Chat. We will arrange a free replacement immediately." },
        { q: "How does the 2-hour printing delivery work?", a: "When you use the Smart Print Station, your document is sent to our nearest hub. After a 15-minute high-res printing process, our dedicated couriers deliver it to your GPS location within the remaining time." }
    ];

    const contactOptions = [
        { 
            icon: <MessageSquare className="text-purple-600" />, 
            title: "Live Chat", 
            detail: "Online & Ready to Help", 
            color: "bg-purple-50", 
            action: () => setShowChat(true) 
        },
        { 
            icon: <Phone className="text-blue-600" />, 
            title: "Phone Support", 
            detail: "1800-SMART-99", 
            color: "bg-blue-50", 
            link: "tel:18007627899" 
        },
        { 
            icon: <Mail className="text-green-600" />, 
            title: "Email Us", 
            detail: "support@smartstore.com", 
            color: "bg-green-50", 
            link: "mailto:support@smartstore.com" 
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header section */}
            <div className="bg-dark-gradient pt-16 pb-32 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32 animate-pulse delay-700"></div>
                
                <div className="container mx-auto max-w-4xl relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 -translate-y-2">
                            24/7 Smart Help Desk
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-8">
                            We're here to <br />
                            <span className="text-gradient">Assist You</span>
                        </h1>
                        
                        <div className="relative max-w-2xl mx-auto group">
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for answers, orders, or policies..."
                                className="w-full bg-white/95 backdrop-blur-xl border-none rounded-[24px] py-5 px-14 text-sm font-bold shadow-2xl focus:ring-4 focus:ring-purple-500/20 transition-all outline-none"
                            />
                            <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                            <kbd className="absolute right-5 top-1/2 -translate-y-1/2 bg-gray-100 px-2 py-1 rounded text-[10px] font-black text-gray-400 hidden sm:block">ESC</kbd>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-6 -mt-16 relative z-20">
                {/* Contact grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {contactOptions.map((opt, i) => (
                        opt.link ? (
                            <a 
                                key={i} 
                                href={opt.link} 
                                className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-100 flex flex-col items-center text-center group cursor-pointer hover:scale-[1.02] transition-all"
                            >
                                <div className={`${opt.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    {React.cloneElement(opt.icon, { size: 32 })}
                                </div>
                                <h3 className="text-lg font-black text-gray-900 mb-2">{opt.title}</h3>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-tight">{opt.detail}</p>
                            </a>
                        ) : (
                            <motion.button 
                                key={i}
                                onClick={() => {
                                    console.log("Chat triggered");
                                    setShowChat(true);
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-100 flex flex-col items-center text-center group cursor-pointer transition-all hover:border-purple-200 w-full"
                            >
                                <div className={`${opt.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    {React.cloneElement(opt.icon, { size: 32 })}
                                </div>
                                <h3 className="text-lg font-black text-gray-900 mb-2">{opt.title}</h3>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-tight">{opt.detail}</p>
                            </motion.button>
                        )
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* FAQ section */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 mb-2">Popular Questions</h2>
                            <p className="text-gray-500 font-bold uppercase tracking-wider text-xs">Quick solutions for common issues</p>
                        </div>
                        
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <motion.div 
                                    key={i}
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    className={`bg-white p-6 rounded-3xl border transition-all cursor-pointer group ${activeFaq === i ? 'border-purple-400 shadow-lg' : 'border-gray-100 hover:border-purple-200'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <h4 className={`font-black transition-colors ${activeFaq === i ? 'text-purple-600' : 'text-gray-800 group-hover:text-purple-600 font-bold'}`}>{faq.q}</h4>
                                        <ChevronRight size={18} className={`text-gray-300 transition-all ${activeFaq === i ? 'rotate-90 text-purple-500' : 'group-hover:text-purple-500 transform group-hover:translate-x-1'}`} />
                                    </div>
                                    <AnimatePresence>
                                        {activeFaq === i && (
                                            <motion.p 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="mt-4 text-sm text-gray-500 font-medium leading-relaxed border-t pt-4"
                                            >
                                                {faq.a}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Resources section */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 mb-2">Safety & Policy</h2>
                            <p className="text-gray-500 font-bold uppercase tracking-wider text-xs">Essential guides for a smart experience</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <ResourceCard 
                                onClick={() => setSelectedPolicy({ title: "Buyer Protection", detail: "Standard E-commerce Protection: We ensure that your money is safe until you receive your product. If the item is defective or significantly different from the description, you are eligible for a full refund or replacement. Our 100% money-back guarantee covers you from click to delivery." })}
                                icon={<LifeBuoy className="text-blue-500" />} 
                                title="Buyer Protection" 
                                text="Secure payments and 100% money-back guarantee." 
                            />
                            <ResourceCard 
                                onClick={() => setSelectedPolicy({ title: "Secure Payments", detail: "We use PCI-DSS compliant payment gateways and 256-bit SSL encryption. We never store your full card details on our servers. All transactions through UPI and Wallets are handled via secure provider APIs." })}
                                icon={<Zap className="text-teal-500" />} 
                                title="Data Security" 
                                text="Encrypted transactions and secure personal data handling." 
                            />
                            <ResourceCard 
                                onClick={() => setSelectedPolicy({ title: "Privacy & Data", detail: "Our policy is simple: We only collect necessary data to deliver your products and improve your experience. We do not sell your personal information to third parties. You can request data deletion at any time." })}
                                icon={<FileText className="text-green-500" />} 
                                title="Privacy & Trust" 
                                text="Transparent data usage and privacy-first standards." 
                            />
                        </div>

                        <div className="bg-purple-600 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                            <HelpCircle className="mb-6 opacity-40" size={40} />
                            <h3 className="text-2xl font-black mb-2 leading-tight text-white font-bold">Need a Smart Agent?</h3>
                            <p className="text-purple-100 font-medium mb-6 leading-relaxed">Our AI and human experts are ready to resolve any concerns.</p>
                            <button 
                                onClick={() => setShowChat(true)}
                                className="bg-white text-purple-600 px-8 py-3 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-all font-bold"
                            >
                                Start Smart Chat
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Policy Modal */}
            <AnimatePresence>
                {selectedPolicy && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPolicy(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[40px] p-8 max-w-lg w-full relative z-[310] shadow-2xl"
                        >
                            <h3 className="text-3xl font-black text-gray-900 mb-4">{selectedPolicy.title}</h3>
                            <p className="text-gray-600 font-medium leading-relaxed mb-8">{selectedPolicy.detail}</p>
                            <button 
                                onClick={() => setSelectedPolicy(null)}
                                className="w-full bg-primary-gradient py-4 rounded-2xl text-white font-black shadow-lg hover:scale-[1.02] transition-all font-bold"
                            >
                                Close Information
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Smart Chat Sheet */}
            <AnimatePresence>
                {showChat && (
                    <div className="fixed inset-0 z-[500] flex items-end justify-end p-4 sm:p-10 pointer-events-none">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowChat(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
                        />
                        <motion.div 
                            initial={{ opacity: 0, y: 100, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.9 }}
                            className="bg-white w-full max-w-lg h-[80vh] rounded-[48px] shadow-[0_50px_100px_rgba(0,0,0,0.3)] relative z-[510] overflow-hidden flex flex-col border border-gray-100 pointer-events-auto"
                        >
                            <div className="bg-primary-gradient p-8 text-white flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                            <Zap size={24} className="text-white fill-white" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-base">Smart Assistant</h3>
                                        <p className="text-[10px] opacity-80 font-black uppercase tracking-widest">Active Now</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowChat(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20">
                                    <HelpCircle size={24} className="rotate-45" />
                                </button>
                            </div>
                            
                            <div className="flex-grow p-10 flex flex-col items-center justify-center text-center space-y-6">
                                <div className="w-20 h-20 bg-purple-50 rounded-[32px] flex items-center justify-center">
                                    <MessageSquare className="text-purple-600" size={40} />
                                </div>
                                <h4 className="text-2xl font-black text-gray-900 leading-tight">How can we help you <br /> today?</h4>
                                <p className="text-sm text-gray-500 font-medium px-8">Our agents typically reply in under a minute to assist with orders and returns.</p>
                            </div>

                            <div className="p-8 pb-10 bg-gray-50 border-t border-gray-100 flex gap-4">
                                <input 
                                    type="text" 
                                    placeholder="Type your message..."
                                    className="flex-grow bg-white border-none rounded-[20px] px-6 py-4 text-sm font-bold shadow-xl focus:ring-4 focus:ring-purple-500/10 outline-none"
                                />
                                <button className="bg-purple-600 text-white p-4 rounded-[20px] shadow-2xl hover:bg-purple-700 active:scale-95 transition-all">
                                    <MessageSquare size={24} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ResourceCard = ({ icon, title, titleExtra, text, onClick }) => (
    <div 
        onClick={onClick}
        className="bg-white p-6 rounded-[32px] border border-gray-100 flex gap-5 hover:shadow-md transition-shadow cursor-pointer group hover:border-purple-200"
    >
        <div className="bg-gray-50 p-4 rounded-2xl h-max w-max group-hover:bg-purple-50 transition-colors font-black">
            {icon}
        </div>
        <div>
            <div className="flex items-center gap-2 mb-2">
                <h4 className="font-black text-gray-900 group-hover:text-purple-600 transition-colors uppercase tracking-tight font-bold">{title}</h4>
                {titleExtra && (
                    <span className="bg-yellow-100 text-yellow-700 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase italic tracking-tighter shadow-sm">{titleExtra}</span>
                )}
            </div>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">{text}</p>
        </div>
    </div>
);

export default HelpDesk;
