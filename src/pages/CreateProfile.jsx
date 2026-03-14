import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, MapPin, Phone, Camera } from 'lucide-react';

const CreateProfile = () => {
    const { user, login } = useContext(AuthContext); // Re-use login to update context if needed
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        phone: '',
        houseNumber: '',
        address: '',
        landmark: '',
        city: '',
        district: '',
        state: '',
        country: '',
        pincode: '',
        avatar: ''
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Call our new backend API to save it to MongoDB permanently
            const { data } = await axios.put('http://localhost:5000/api/users/profile', { profile: formData }, config);
            
            // Re-store the new fetched User document (with nested profile and all id fields)
            localStorage.setItem('userInfo', JSON.stringify(data));
            
            // We just quickly navigate to home after profile setup!
            alert('Profile successfully created!');
            navigate('/');
            // Optionally reload to update app-wide state if necessary
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Failed to save profile');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full bg-white rounded-3xl p-10 shadow-2xl border border-gray-100"
            >
                <div className="text-center mb-10">
                    <div className="mx-auto bg-purple-100 text-purple-600 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                        <User size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Complete Your Profile</h2>
                    <p className="text-gray-500 tracking-wide">Tell us a bit more about yourself to personalize your experience.</p>
                </div>

                <form className="space-y-6" onSubmit={submitHandler}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Phone size={16} className="text-purple-500" /> Phone Number
                            </label>
                            <input
                                type="tel"
                                required
                                placeholder="+91 9876543210"
                                className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition bg-gray-50"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Camera size={16} className="text-purple-500" /> Avatar Image URL
                            </label>
                            <input
                                type="url"
                                placeholder="https://..."
                                className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition bg-gray-50"
                                value={formData.avatar}
                                onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-1">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <MapPin size={16} className="text-purple-500" /> House Number / Flat
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="A-101"
                                className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition bg-gray-50"
                                value={formData.houseNumber}
                                onChange={(e) => setFormData({...formData, houseNumber: e.target.value})}
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-1">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <MapPin size={16} className="text-purple-500" /> Street Address / Location
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="123 Smart Store Ave"
                                className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition bg-gray-50"
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-1">
                            <label className="text-sm font-bold text-gray-700">Landmark</label>
                            <input
                                type="text"
                                required
                                placeholder="Opposite to Central Park"
                                className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition bg-gray-50"
                                value={formData.landmark}
                                onChange={(e) => setFormData({...formData, landmark: e.target.value})}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">City</label>
                            <input
                                type="text"
                                required
                                placeholder="Mumbai"
                                className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition bg-gray-50"
                                value={formData.city}
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">District</label>
                            <input
                                type="text"
                                required
                                placeholder="Mumbai Suburban"
                                className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition bg-gray-50"
                                value={formData.district}
                                onChange={(e) => setFormData({...formData, district: e.target.value})}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">State</label>
                            <input
                                type="text"
                                required
                                placeholder="Maharashtra"
                                className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition bg-gray-50"
                                value={formData.state}
                                onChange={(e) => setFormData({...formData, state: e.target.value})}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">PIN Code</label>
                            <input
                                type="text"
                                required
                                placeholder="400001"
                                className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition bg-gray-50"
                                value={formData.pincode}
                                onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-1">
                            <label className="text-sm font-bold text-gray-700">Country</label>
                            <input
                                type="text"
                                required
                                placeholder="India"
                                className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition bg-gray-50"
                                value={formData.country}
                                onChange={(e) => setFormData({...formData, country: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-purple-500/30 transition-shadow"
                        >
                            Save Profile & Continue
                        </motion.button>
                        
                        <button 
                            type="button"
                            onClick={() => navigate('/')}
                            className="w-full mt-4 text-gray-500 font-bold hover:text-gray-700 transition"
                        >
                            Skip for now
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateProfile;
