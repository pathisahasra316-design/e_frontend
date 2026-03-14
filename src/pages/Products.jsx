import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, Heart, Check, ArrowRight } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import TicketSelector from '../components/TicketSelector';

const categories = ['All', 'Men', 'Women', 'Kids', 'Girls', 'Mobiles', 'Electronics', 'Movies', 'Hotels', 'Metro', 'Bus', 'Books', 'Toys'];

const Products = () => {
    const [products, setProducts] = useState([]);
    const location = useLocation();
    const [selectedCategory, setSelectedCategory] = useState(location.state?.category || 'All');
    const [searchQuery, setSearchQuery] = useState(location.state?.search || '');
    const [addedToCart, setAddedToCart] = useState(null);
    const [selectedProductDetails, setSelectedProductDetails] = useState(null);
    const { toggleWishlist, isInWishlist } = React.useContext(WishlistContext);
    const { addToCart, cart } = React.useContext(CartContext);
    const navigate = useNavigate();

    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [activeTicketProduct, setActiveTicketProduct] = useState(null);
    const [ticketDestination, setTicketDestination] = useState(null); // 'cart' or 'checkout'

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/products');
                setProducts(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (location.state?.category) {
            setSelectedCategory(location.state.category);
        }
        if (location.state?.search) {
            setSearchQuery(location.state.search);
        }
    }, [location.state]);

    const handleAddToCart = (product) => {
        const cat = product.category.toLowerCase();
        if (['movies', 'bus', 'hotels', 'metro'].includes(cat)) {
            setActiveTicketProduct(product);
            setTicketDestination('cart');
            setIsTicketModalOpen(true);
            return;
        }
        addToCart(product);
        setAddedToCart(product._id);
        setTimeout(() => setAddedToCart(null), 3000);
    };

    const handleBuyNow = (product) => {
        const cat = product.category.toLowerCase();
        if (['movies', 'bus', 'hotels', 'metro'].includes(cat)) {
            setActiveTicketProduct(product);
            setTicketDestination('checkout');
            setIsTicketModalOpen(true);
            return;
        }
        addToCart(product);
        navigate('/checkout');
    };

    const handleConfirmTickets = (selections) => {
        addToCart(activeTicketProduct, selections);
        setIsTicketModalOpen(false);
        
        if (ticketDestination === 'checkout') {
            navigate('/checkout');
        } else {
            setAddedToCart(activeTicketProduct._id);
            setTimeout(() => setAddedToCart(null), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-6 relative">
            {/* Added to Cart Toast */}
            <AnimatePresence>
                {addedToCart && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 50, x: '-50%' }}
                        className="fixed bottom-24 left-1/2 z-50 bg-white shadow-2xl rounded-2xl px-6 py-4 border border-purple-100 flex items-center gap-4 min-w-[320px]"
                    >
                        <div className="bg-green-100 text-green-600 p-2 rounded-full">
                            <Check size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-gray-900">Added to Cart!</p>
                            <p className="text-xs text-gray-500">Ready to complete your purchase?</p>
                        </div>
                        <button 
                            onClick={() => navigate('/checkout')}
                            className="bg-primary-gradient text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-purple-200 flex items-center gap-1"
                        >
                            Buy Now <ArrowRight size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto">
                <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight"
                >
                    Discover Products
                </motion.h2>

                {/* Category Filter */}
                <div className="flex overflow-x-auto gap-3 pb-4 mb-8 scrollbar-hide">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 shadow-sm ${
                                selectedCategory === category 
                                ? 'bg-primary-gradient text-white shadow-purple-500/30' 
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.filter(p => {
                        const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
                        const matchesSearch = !searchQuery || p.productName.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
                        return matchesCategory && matchesSearch;
                    }).length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 py-20 text-xl font-medium">
                            <p>No results matching your request.</p>
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="text-purple-600 font-bold underline mt-2"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    ) : (
                        products.filter(p => {
                            const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
                            const matchesSearch = !searchQuery || p.productName.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
                            return matchesCategory && matchesSearch;
                        }).map((product, idx) => {
                            const inCart = cart.some(item => item._id === product._id);
                            return (
                                <motion.div 
                                    key={product._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ y: -10 }}
                                    className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                                    onClick={() => setSelectedProductDetails(product)}
                                >
                                    <div className="h-48 bg-gray-100 overflow-hidden relative">
                                        {product.images?.[0] ? (
                                            <img 
                                                src={product.images[0].startsWith('/') ? `http://localhost:5000${product.images[0]}` : product.images[0]} 
                                                alt={product.productName} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                                        )}
                                        
                                        {/* Badges */}
                                        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                                            <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl text-[10px] font-black shadow-xl flex items-center gap-1.5 text-gray-900 border border-white/50">
                                                <Star size={12} className="text-amber-400 fill-amber-400" />
                                                {product.rating ? product.rating.toFixed(1) : 'N/A'}
                                                <span className="text-gray-300 mx-0.5 font-normal">|</span>
                                                <span className="text-gray-400">{product.numReviews || 0}</span>
                                            </div>
                                            
                                            {product.rating >= 4.5 && (
                                                <div className="bg-primary-gradient px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest shadow-lg shadow-purple-500/30 flex items-center gap-1">
                                                    <Check size={10} strokeWidth={4} /> Top Rated
                                                </div>
                                            )}
                                        </div>

                                        <button 
                                            onClick={() => toggleWishlist(product)}
                                            className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow hover:scale-110 transition group/heart"
                                        >
                                            <Heart 
                                                size={18} 
                                                className={`${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover/heart:text-red-400'}`} 
                                            />
                                        </button>
                                    </div>
                                    <div className="p-6">
                                        <div className="text-xs font-bold text-purple-600 tracking-wider uppercase mb-2">{product.category}</div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{product.productName}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{product.description}</p>
                                        
                                        <div className="mt-4 border-t pt-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-2xl font-black text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                                                <div className="flex gap-2">
                                                    <motion.button 
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleAddToCart(product)}
                                                        className={`p-3 rounded-xl shadow-lg transition-all ${inCart ? 'bg-green-500 text-white shadow-green-200' : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'}`}
                                                    >
                                                        {inCart ? <Check size={20} /> : <ShoppingCart size={20} />}
                                                    </motion.button>
                                                </div>
                                            </div>
                                            
                                            <motion.button 
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleBuyNow(product)}
                                                className="w-full bg-primary-gradient text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-purple-200 flex items-center justify-center gap-2"
                                            >
                                                Buy Now <ArrowRight size={16} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Ticket Selection Modal */}
            <TicketSelector 
                isOpen={isTicketModalOpen}
                product={activeTicketProduct}
                onClose={() => setIsTicketModalOpen(false)}
                onConfirm={handleConfirmTickets}
            />

            {/* Product Details Modal */}
            <AnimatePresence>
                {selectedProductDetails && (
                    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProductDetails(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[40px] max-w-4xl w-full h-[85vh] relative z-[510] shadow-2xl overflow-hidden flex flex-col md:flex-row"
                        >
                            {/* Close Button */}
                            <button 
                                onClick={() => setSelectedProductDetails(null)}
                                className="absolute top-6 right-6 z-10 bg-white/50 backdrop-blur-md p-2 rounded-full hover:bg-white transition-all shadow-xl"
                            >
                                <Check size={24} className="rotate-45 text-gray-900" />
                            </button>

                            {/* Image Section */}
                            <div className="w-full md:w-1/2 bg-gray-50 h-64 md:h-full relative">
                                <img 
                                    src={selectedProductDetails.images?.[0]?.startsWith('/') ? `http://localhost:5000${selectedProductDetails.images[0]}` : selectedProductDetails.images?.[0]} 
                                    alt={selectedProductDetails.productName} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl text-lg font-black shadow-xl flex items-center gap-2">
                                    <Star size={20} className="text-yellow-400 fill-yellow-400" /> {selectedProductDetails.rating?.toFixed(1) || 'No Ratings'}
                                </div>
                            </div>

                            {/* Infomation Section */}
                            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col">
                                <div className="mb-8">
                                    <span className="text-sm font-black text-purple-600 uppercase tracking-widest bg-purple-50 px-4 py-1.5 rounded-full">{selectedProductDetails.category}</span>
                                    <h2 className="text-4xl font-black text-gray-900 mt-4 mb-4 leading-tight">{selectedProductDetails.productName}</h2>
                                    <p className="text-gray-500 font-medium leading-relaxed">{selectedProductDetails.description}</p>
                                </div>

                                <div className="flex items-center justify-between mb-10 py-6 border-y border-gray-100">
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Price</p>
                                        <p className="text-3xl font-black text-gray-900">₹{selectedProductDetails.price.toLocaleString()}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleAddToCart(selectedProductDetails)}
                                            className="bg-gray-100 p-4 rounded-2xl hover:bg-gray-200 transition-all"
                                        >
                                            <ShoppingCart size={24} className="text-gray-700" />
                                        </button>
                                        <button 
                                            onClick={() => handleBuyNow(selectedProductDetails)}
                                            className="bg-primary-gradient px-8 py-4 rounded-2xl text-white font-black shadow-xl hover:scale-105 transition-all"
                                        >
                                            Order Now
                                        </button>
                                    </div>
                                </div>

                                {/* Reviews Section */}
                                <div className="mt-8 flex-grow">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                            Community Reviews
                                            <span className="bg-violet-100 text-violet-600 text-xs px-3 py-1 rounded-full font-black uppercase tracking-widest">
                                                {selectedProductDetails.numReviews || 0}
                                            </span>
                                        </h3>
                                        
                                        {selectedProductDetails.numReviews > 0 && (
                                            <div className="flex items-center gap-2">
                                                <div className="text-right">
                                                    <div className="flex gap-0.5 justify-end">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star 
                                                                key={i} 
                                                                size={14} 
                                                                className={i < Math.round(selectedProductDetails.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                                                            />
                                                        ))}
                                                    </div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                                        Average Rating
                                                    </p>
                                                </div>
                                                <div className="text-3xl font-black text-violet-600 leading-none">
                                                    {selectedProductDetails.rating?.toFixed(1)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {selectedProductDetails.reviews && selectedProductDetails.reviews.length > 0 ? (
                                        <div className="space-y-5">
                                            {selectedProductDetails.reviews.map((rev, i) => {
                                                // Extract tags from comment if present: [Tag1, Tag2] Pure Comment
                                                const tagMatch = rev.comment.match(/^\[(.*?)\]\s*(.*)$/);
                                                const tags = tagMatch ? tagMatch[1].split(', ') : [];
                                                const comment = tagMatch ? tagMatch[2] : rev.comment;
                                                
                                                return (
                                                    <motion.div 
                                                        key={i}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                                                    >
                                                        {/* Subtle Background Accent */}
                                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-50 to-transparent -mr-12 -mt-12 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                        
                                                        <div className="flex items-start gap-4 relative z-10">
                                                            {/* Avatar */}
                                                            <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-2xl flex items-center justify-center font-black text-violet-600 shrink-0 shadow-inner">
                                                                {rev.userName?.charAt(0).toUpperCase() || 'U'}
                                                            </div>
                                                            
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                                                                    <div>
                                                                        <div className="flex items-center gap-2">
                                                                            <p className="font-black text-gray-900">{rev.userName}</p>
                                                                            <div className="flex items-center gap-1 text-[8px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-widest border border-emerald-100">
                                                                                <Check size={8} strokeWidth={4} /> Validated
                                                                            </div>
                                                                        </div>
                                                                        <p className="text-[10px] text-gray-400 font-bold">
                                                                            {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent Purchase'}
                                                                        </p>
                                                                    </div>
                                                                    
                                                                    <div className="flex gap-0.5">
                                                                        {[...Array(5)].map((_, star) => (
                                                                            <Star 
                                                                                key={star} 
                                                                                size={16} 
                                                                                className={`${star < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} 
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Tags */}
                                                                {tags.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                                                        {tags.map(tag => (
                                                                            <span key={tag} className="text-[9px] font-black bg-violet-50 text-violet-500 px-2 py-1 rounded-lg border border-violet-100 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                                                                                {tag}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                
                                                                <p className="text-sm font-medium text-gray-600 leading-relaxed italic group-hover:text-gray-800 transition-colors">
                                                                    "{comment}"
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="py-16 text-center bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm">
                                                <Star size={32} />
                                            </div>
                                            <div>
                                                <p className="text-slate-900 font-black text-lg">No reviews yet</p>
                                                <p className="text-slate-400 font-medium text-sm">Be the first to share your experience with this item!</p>
                                            </div>
                                        </div>
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

export default Products;
