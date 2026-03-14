import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { MessageCircle, X, Send } from 'lucide-react';

const AiAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ role: 'system', content: 'Hi! I am your AI Shopping Assistant. How can I help you today?' }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const sendMessage = async () => {
        if (!input.trim() || !userInfo) return;
        const newMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setLoading(true);

        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.post('http://localhost:5000/api/ai/chat', { message: input }, config);
            setMessages(prev => [...prev, { role: 'system', content: data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'system', content: 'You must be logged in to use the AI assistant.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <motion.div 
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
                >
                    <div className="bg-secondary-gradient p-4 text-white flex justify-between items-center">
                        <h3 className="font-bold flex items-center gap-2"><MessageCircle size={18} /> AI Assistant</h3>
                        <button onClick={() => setIsOpen(false)}><X size={18} className="hover:text-red-300" /></button>
                    </div>
                    
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                        {messages.map((msg, i) => (
                            <div key={i} className={`p-3 rounded-xl max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-primary-gradient text-white self-end rounded-br-none shadow-md' : 'bg-white border text-gray-800 self-start rounded-bl-none shadow-sm'}`}>
                                {msg.content}
                            </div>
                        ))}
                        {loading && <div className="text-gray-400 text-xs italic ml-2">AI is typing...</div>}
                    </div>

                    <div className="p-3 bg-white border-t flex items-center gap-2">
                        <input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            className="flex-1 border-gray-300 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Ask me anything..."
                        />
                        <button onClick={sendMessage} className="p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition shadow-md">
                            <Send size={16} />
                        </button>
                    </div>
                </motion.div>
            ) : (
                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-primary-gradient text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-purple-500/50 transition-shadow"
                >
                    <MessageCircle size={28} />
                </motion.button>
            )}
        </div>
    );
};

export default AiAssistant;
