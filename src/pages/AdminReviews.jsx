import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Star, MessageSquare, Search, Filter, AlertCircle, CheckCircle } from 'lucide-react';

const AdminReviews = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRating, setFilterRating] = useState('All');
    const [actionStatus, setActionStatus] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/products');
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reviews:', error);
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const handleDeleteReview = async (productId, reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`http://localhost:5000/api/products/${productId}/reviews/${reviewId}`, config);
            
            // Update local state
            setProducts(prevProducts => prevProducts.map(p => {
                if (p._id === productId) {
                    const updatedReviews = p.reviews.filter(r => r._id !== reviewId);
                    return { ...p, reviews: updatedReviews, numReviews: updatedReviews.length };
                }
                return p;
            }));
            
            setActionStatus({ type: 'success', message: 'Review deleted successfully' });
            setTimeout(() => setActionStatus(null), 3000);
        } catch (error) {
            setActionStatus({ type: 'error', message: error.response?.data?.message || 'Error deleting review' });
            setTimeout(() => setActionStatus(null), 3000);
        }
    };

    // Flatten all reviews for display
    const allReviews = products.flatMap(p => 
        (p.reviews || []).map(r => ({ ...r, productName: p.productName, productId: p._id }))
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const filteredReviews = allReviews.filter(rev => {
        const matchesSearch = rev.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             rev.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             rev.productName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRating = filterRating === 'All' || rev.rating === parseInt(filterRating);
        return matchesSearch && matchesRating;
    });

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold">Loading community feedback...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 mb-2">Review Management</h1>
                <p className="text-gray-500 font-medium">Monitor and manage customer feedback across all products.</p>
            </div>

            {/* Action Status Toast */}
            <AnimatePresence>
                {actionStatus && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-10 right-10 z-[1000] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-white ${
                            actionStatus.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                    >
                        {actionStatus.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        {actionStatus.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Controls */}
            <div className="bg-white p-6 rounded-[32px] shadow-xl border border-gray-100 flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by customer, product, or comment..." 
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-200 transition-all font-medium text-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <select 
                            className="pl-12 pr-10 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-200 transition-all font-bold text-gray-600 appearance-none cursor-pointer"
                            value={filterRating}
                            onChange={(e) => setFilterRating(e.target.value)}
                        >
                            <option value="All">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-[32px] text-white shadow-xl shadow-indigo-200">
                    <div className="flex justify-between items-start mb-4">
                        <MessageSquare size={24} className="opacity-80" />
                        <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Total Feedback</span>
                    </div>
                    <p className="text-4xl font-black mb-1">{allReviews.length}</p>
                    <p className="text-sm font-medium opacity-80">Reviews across all categories</p>
                </div>
                
                <div className="bg-gradient-to-br from-amber-400 to-amber-500 p-6 rounded-[32px] text-white shadow-xl shadow-amber-200">
                    <div className="flex justify-between items-start mb-4">
                        <Star size={24} className="opacity-80" />
                        <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Highly Rated</span>
                    </div>
                    <p className="text-4xl font-black mb-1">{allReviews.filter(r => r.rating >= 4).length}</p>
                    <p className="text-sm font-medium opacity-80">4+ star experiences</p>
                </div>

                <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-6 rounded-[32px] text-white shadow-xl shadow-rose-200">
                    <div className="flex justify-between items-start mb-4">
                        <AlertCircle size={24} className="opacity-80" />
                        <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Improvement</span>
                    </div>
                    <p className="text-4xl font-black mb-1">{allReviews.filter(r => r.rating <= 2).length}</p>
                    <p className="text-sm font-medium opacity-80">Low rated reviews for action</p>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {filteredReviews.length === 0 ? (
                    <div className="bg-white p-20 rounded-[40px] text-center border-2 border-dashed border-gray-100 flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200">
                            <Search size={40} />
                        </div>
                        <p className="text-gray-400 font-bold text-lg italic">No results found matching your filters.</p>
                    </div>
                ) : (
                    filteredReviews.map((rev, idx) => (
                        <motion.div 
                            key={rev._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white p-6 rounded-[32px] shadow-lg border border-gray-100 hover:border-purple-200 transition-all group flex flex-col md:flex-row gap-6 items-start"
                        >
                            {/* Product & User Info */}
                            <div className="md:w-1/4 space-y-3">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Customer</p>
                                    <h4 className="font-black text-gray-900 text-lg leading-tight">{rev.userName}</h4>
                                    <p className="text-xs text-gray-400 font-bold">Buyer #{rev.userId?.slice(-6)}</p>
                                </div>
                                <div className="space-y-1 pt-3 border-t border-gray-50">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Product</p>
                                    <p className="font-bold text-gray-700 leading-tight">{rev.productName}</p>
                                </div>
                            </div>

                            {/* Comment */}
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={16} 
                                                className={i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-100'}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[11px] font-black text-gray-300 flex items-center gap-1">
                                        {new Date(rev.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                                <p className="text-gray-600 font-medium leading-relaxed bg-gray-50 p-4 rounded-2xl italic">
                                    "{rev.comment}"
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex md:flex-col gap-2 shrink-0 self-center md:self-start">
                                <button 
                                    onClick={() => handleDeleteReview(rev.productId, rev._id)}
                                    className="p-3 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                    title="Delete Review"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminReviews;
