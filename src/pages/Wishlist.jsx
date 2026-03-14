import React, { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const { wishlist, toggleWishlist } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <Heart size={80} className="text-gray-300 mb-6" />
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Your Wishlist is Empty</h1>
                <p className="text-gray-500 text-center max-w-sm mb-8 text-lg">
                    Looks like you haven't liked any products yet. Discover some amazing items and add them here!
                </p>
                <Link to="/products" className="bg-primary-gradient text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all text-lg">
                    Discover Products
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-6">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <motion.h2 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3"
                    >
                        <Heart className="text-red-500 fill-red-500" size={36} /> My Wishlist
                    </motion.h2>
                    <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-bold">
                        {wishlist.length} Items
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {wishlist.map((product, idx) => (
                        <motion.div 
                            key={product._id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group"
                        >
                            <div className="h-48 bg-gray-100 overflow-hidden relative">
                                {product.images?.[0] ? (
                                    <img src={product.images[0]} alt={product.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow flex items-center gap-1 text-gray-800">
                                    <Star size={14} className="text-yellow-500" /> {product.rating || 'N/A'}
                                </div>
                                <button 
                                    onClick={() => toggleWishlist(product)}
                                    className="absolute top-4 left-4 bg-red-50 hover:bg-red-100 backdrop-blur-sm p-2 rounded-full shadow transition"
                                    title="Remove from Wishlist"
                                >
                                    <Trash2 size={18} className="text-red-500" />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="text-xs font-bold text-purple-600 tracking-wider uppercase mb-2">{product.category}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{product.productName}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{product.description}</p>
                                <div className="flex justify-between items-center mt-4 border-t pt-4">
                                    <span className="text-2xl font-black text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                                    <motion.button 
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => addToCart(product)}
                                        className="bg-primary-gradient text-white p-3 rounded-full shadow-lg hover:shadow-purple-500/40"
                                    >
                                        <ShoppingCart size={20} />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
