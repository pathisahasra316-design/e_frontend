import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useContext(CartContext);
    const [storeSettings, setStoreSettings] = React.useState({
        gstPercentage: 18,
        deliveryCharge: 0,
        freeDeliveryThreshold: 500
    });

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/settings');
                setStoreSettings(res.data);
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        };
        fetchSettings();
    }, []);

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="bg-purple-100 p-6 rounded-full text-purple-600 mb-6">
                    <ShoppingBag size={80} />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Your Cart is Empty</h1>
                <p className="text-gray-500 text-center max-w-sm mb-8 text-lg">
                    Looks like you haven't added anything to your cart yet. Let's fix that!
                </p>
                <Link to="/products" className="bg-primary-gradient text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all text-lg">
                    Start Shopping
                </Link>
            </div>
        );
    }

    const subtotal = getCartTotal();
    const gstAmount = subtotal * (storeSettings.gstPercentage / 100);
    const isFreeDelivery = subtotal >= storeSettings.freeDeliveryThreshold;
    const deliveryCharge = isFreeDelivery ? 0 : storeSettings.deliveryCharge;
    const grandTotal = subtotal + gstAmount + deliveryCharge;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                    <motion.h2 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3"
                    >
                        <ShoppingCart className="text-purple-600" size={36} /> Shopping Cart
                    </motion.h2>
                    <button 
                        onClick={clearCart}
                        className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full transition flex items-center gap-1"
                    >
                        <Trash2 size={16} /> Clear All
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items List */}
                    <div className="lg:w-2/3 space-y-4">
                        <AnimatePresence>
                            {cart.map((item) => (
                                <motion.div 
                                    key={item._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                    className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4 group"
                                >
                                    {/* Product Image */}
                                    <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-grow-0 flex-shrink-0">
                                        {item.images?.[0] ? (
                                            <img src={item.images[0].startsWith('/') ? `http://localhost:5000${item.images[0]}` : item.images[0]} alt={item.productName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs text-center p-2">No Image</div>
                                        )}
                                    </div>
                                    
                                    {/* Info */}
                                    <div className="flex-1 text-center sm:text-left w-full sm:w-auto">
                                        <h3 className="text-lg font-bold text-gray-900 truncate mb-1">{item.productName}</h3>
                                        <div className="text-sm font-bold text-purple-600 mb-2 uppercase tracking-wide text-xs">{item.category}</div>
                                        <div className="text-xl font-black text-gray-900">₹{item.price.toLocaleString('en-IN')}</div>
                                        {item.extraDetails && Array.isArray(item.extraDetails) && (
                                            <div className="mt-2 flex flex-wrap gap-1 justify-center sm:justify-start">
                                                {item.extraDetails.map(detail => (
                                                    <span key={detail} className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter border border-purple-200">
                                                        {item.category.toLowerCase() === 'hotels' ? 'Room' : 'Seat'} {detail}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Counter */}
                                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-2 rounded-full shadow-inner">
                                        <button 
                                            onClick={() => updateQuantity(item._id, -1)}
                                            className="w-8 h-8 rounded-full bg-white hover:bg-purple-100 flex items-center justify-center text-gray-600 shadow-sm transition"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="font-bold text-gray-900 w-4 text-center">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item._id, 1)}
                                            className="w-8 h-8 rounded-full bg-white hover:bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm transition font-bold"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    {/* Remove */}
                                    <button 
                                        onClick={() => removeFromCart(item._id)}
                                        className="sm:ml-4 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                                        title="Remove Item"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 sticky top-24">
                            <h3 className="text-xl font-extrabold text-gray-900 mb-6 pb-4 border-b">Order Summary</h3>
                            
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span className="font-medium">Subtotal ({cart.length} items)</span>
                                    <span className="font-bold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span className="font-medium">Delivery Fee</span>
                                    <span className={`font-bold ${isFreeDelivery ? 'text-green-600' : 'text-gray-900'}`}>
                                        {isFreeDelivery ? 'FREE' : `₹${deliveryCharge.toLocaleString('en-IN')}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600 border-b border-dashed pb-4">
                                    <span className="font-medium">GST ({storeSettings.gstPercentage}%)</span>
                                    <span className="font-bold text-gray-900">₹{gstAmount.toFixed(0).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-end pt-2">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-3xl font-black text-purple-600 leading-none">
                                        ₹{grandTotal.toFixed(0).toLocaleString('en-IN')}
                                    </span>
                                </div>
                                {!isFreeDelivery && (
                                    <p className="text-[10px] text-gray-400 font-medium italic">
                                        * Add ₹{(storeSettings.freeDeliveryThreshold - subtotal).toLocaleString()} more for FREE delivery
                                    </p>
                                )}
                            </div>

                            <Link to="/checkout" className="w-full bg-primary-gradient text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 group mb-4">
                                Checkout securely 
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <p className="text-center text-xs text-gray-400 mt-4 font-medium flex justify-center gap-1 items-center">
                                <ShoppingCart size={12} /> Secure encrypted checkout
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
