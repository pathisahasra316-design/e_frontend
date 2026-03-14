import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, MapPin, Phone, Mail, FileText, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <div className="p-8 text-center text-gray-500">Please login to view your profile.</div>;
    }

    const { profile } = user;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-32 bg-primary-gradient opacity-10"></div>
                    
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-purple-100 flex items-center justify-center overflow-hidden">
                            {profile?.avatar ? (
                                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User size={50} className="text-purple-500" />
                            )}
                        </div>
                        {user.role === 'admin' && (
                            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 rounded-full shadow-lg" title="Admin User">
                                <CheckCircle size={16} />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 text-center md:text-left z-10 pt-2">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{user.name}</h1>
                        <p className="text-purple-600 font-bold tracking-widest uppercase text-xs mb-4">{user.role}</p>
                        
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                                <Mail size={16} className="text-gray-400" />
                                <span>{user.email}</span>
                            </div>
                            {profile?.phone && (
                                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                                    <Phone size={16} className="text-gray-400" />
                                    <span>{profile.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="z-10">
                        <Link to="/create-profile" className="px-6 py-2 bg-purple-50 text-purple-600 font-bold rounded-xl hover:bg-purple-100 transition shadow-sm border border-purple-200 block text-center">
                            Edit Profile
                        </Link>
                    </div>
                </motion.div>

                {/* Details Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
                >
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                        <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                            <MapPin size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Delivery Address Details</h2>
                    </div>

                    {profile ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">House / Flat Number</p>
                                <p className="text-lg font-medium text-gray-900">{profile.houseNumber || 'Not provided'}</p>
                            </div>
                            
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Street / Location</p>
                                <p className="text-lg font-medium text-gray-900">{profile.address || 'Not provided'}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Landmark</p>
                                <p className="text-lg font-medium text-gray-900">{profile.landmark || 'Not provided'}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">City</p>
                                <p className="text-lg font-medium text-gray-900">{profile.city || 'Not provided'}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">District</p>
                                <p className="text-lg font-medium text-gray-900">{profile.district || 'Not provided'}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">State</p>
                                <p className="text-lg font-medium text-gray-900">{profile.state || 'Not provided'}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">PIN Code</p>
                                <p className="text-lg font-medium text-gray-900">{profile.pincode || 'Not provided'}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Country</p>
                                <p className="text-lg font-medium text-gray-900">{profile.country || 'Not provided'}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col flex-1 items-center justify-center p-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <FileText size={48} className="text-gray-300 mb-4" />
                            <h3 className="text-xl font-bold text-gray-600 mb-2">No Profile Information</h3>
                            <p className="text-gray-500 text-center mb-6 max-w-sm">You haven't added your delivery address and contact information yet.</p>
                            <Link to="/create-profile" className="px-8 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/30 hover:bg-purple-700 transition">
                                Set up Profile
                            </Link>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
