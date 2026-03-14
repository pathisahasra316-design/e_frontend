import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Settings, Save, AlertCircle, Percent, Truck, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSettings = () => {
    const { user } = useContext(AuthContext);
    const [settings, setSettings] = useState({
        gstPercentage: 0,
        deliveryCharge: 0,
        freeDeliveryThreshold: 0
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/settings');
            setSettings(res.data);
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            const res = await axios.put('http://localhost:5000/api/settings', settings, config);
            setSettings(res.data);
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update settings.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
    );

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    <Settings className="text-purple-600" size={40} /> Store Settings
                </h1>
                <p className="text-gray-500 mt-2 font-medium">Manage global tax rates and shipping charges for your store.</p>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
            >
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* GST Settings */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-blue-100 rounded-lg"><Percent size={20} className="text-blue-600" /></div>
                                <h3 className="text-lg font-bold text-gray-900">Tax Configuration</h3>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-600">GST Percentage (%)</label>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    className="w-full border rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition font-medium" 
                                    value={settings.gstPercentage}
                                    onChange={e => setSettings({...settings, gstPercentage: parseFloat(e.target.value)})}
                                />
                                <p className="text-xs text-gray-400 mt-1 italic">Applied on cart subtotal</p>
                            </div>
                        </div>

                        {/* Delivery Settings */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-orange-100 rounded-lg"><Truck size={20} className="text-orange-600" /></div>
                                <h3 className="text-lg font-bold text-gray-900">Delivery Charges</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-600">Standard Delivery Fee (₹)</label>
                                    <input 
                                        type="number" 
                                        className="w-full border rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition font-medium" 
                                        value={settings.deliveryCharge}
                                        onChange={e => setSettings({...settings, deliveryCharge: parseFloat(e.target.value)})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-600">Free Delivery Threshold (₹)</label>
                                    <input 
                                        type="number" 
                                        className="w-full border rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition font-medium" 
                                        value={settings.freeDeliveryThreshold}
                                        onChange={e => setSettings({...settings, freeDeliveryThreshold: parseFloat(e.target.value)})}
                                    />
                                    <p className="text-xs text-gray-400 mt-1 italic">Free delivery if order total exceeds this amount</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                        {message && (
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold animate-pulse ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                <AlertCircle size={18} />
                                {message.text}
                            </div>
                        )}
                        <button 
                            type="submit" 
                            disabled={saving}
                            className={`ml-auto flex items-center gap-2 bg-primary-gradient text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all ${saving ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                        >
                            <Save size={20} />
                            {saving ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminSettings;
