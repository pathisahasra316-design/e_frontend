import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, Truck, CheckCircle } from 'lucide-react';

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useContext(CartContext);
    const { user, setAuthData, getProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    const isDigitalTicketOnly = cart.every(item => ['movies', 'bus', 'hotels', 'metro'].includes(item.category?.toLowerCase() || ''));
    const hasHotelsOnly = cart.length > 0 && cart.every(item => item.category?.toLowerCase() === 'hotels');
    const hasBusOnly = cart.length > 0 && cart.every(item => item.category?.toLowerCase() === 'bus');
    const [checkoutStep, setCheckoutStep] = useState(isDigitalTicketOnly ? 'payment' : 'shipping'); // 'shipping' or 'payment'
    const [isSavingAddress, setIsSavingAddress] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({
        address: user?.profile?.address || '',
        city: user?.profile?.city || '',
        pincode: user?.profile?.pincode || '',
        phone: user?.profile?.phone || '',
        landmark: user?.profile?.landmark || '',
        state: user?.profile?.state || ''
    });

    const [paymentMethod, setPaymentMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState({
        upiId: '',
        transactionId: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        cardHolder: ''
    });

    const [storeSettings, setStoreSettings] = useState({
        gstPercentage: 18,
        deliveryCharge: 0,
        freeDeliveryThreshold: 500
    });

    useEffect(() => {
        if (cart.length === 0 && !orderSuccess) {
            navigate('/cart');
        }
        fetchSettings();
    }, [cart, navigate, orderSuccess]);

    useEffect(() => {
        if (user?.profile) {
            setShippingAddress({
                address: user.profile.address || '',
                city: user.profile.city || '',
                pincode: user.profile.pincode || '',
                phone: user.profile.phone || '',
                landmark: user.profile.landmark || '',
                state: user.profile.state || ''
            });
        }
    }, [user]);

    const fetchSettings = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/settings');
            setStoreSettings(res.data);
        } catch (error) {
            console.error("Error fetching settings:", error);
        }
    };

    const handleShippingSubmit = async (e) => {
        e.preventDefault();
        setIsSavingAddress(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Save address to user profile
            const res = await axios.put('http://localhost:5000/api/users/profile', { profile: shippingAddress }, config);
            
            // Update local auth context with new profile data
            setAuthData({ profile: res.data.profile });
            
            setCheckoutStep('payment');
        } catch (error) {
            console.error("Error saving address:", error);
            // Even if saving fails, we proceed to payment step for better UX
            setCheckoutStep('payment');
        } finally {
            setIsSavingAddress(false);
        }
    };

    const [tokensToUse, setTokensToUse] = useState(0);

    const subtotal = getCartTotal();
    const gstAmount = subtotal * (storeSettings.gstPercentage / 100);
    const isFreeDelivery = subtotal >= storeSettings.freeDeliveryThreshold;
    const deliveryCharge = isFreeDelivery ? 0 : storeSettings.deliveryCharge;
    
    // Token Discount Logic: 5 tokens = 25% discount
    const discountMultiplier = (tokensToUse / 5) * 0.25;
    const tokenDiscountAmount = subtotal * discountMultiplier;
    const grandTotal = subtotal + gstAmount + deliveryCharge - tokenDiscountAmount;

    const maxTokensPossible = Math.min(Math.floor((user?.tokens || 0) / 5) * 5, 20);

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (!paymentMethod) {
            alert('Please select a payment method');
            return;
        }

        if (paymentMethod === 'PhonePe/UPI' && !paymentDetails.transactionId) {
            alert('Please enter Transaction ID');
            return;
        }

        if (paymentMethod === 'Credit/Debit Card') {
            if (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv) {
                alert('Please fill all card details');
                return;
            }
        }

        setIsProcessing(true);

        // Simulate payment gateway delay
        setTimeout(async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                
                const products = cart.map(item => ({
                    productId: item._id,
                    quantity: item.quantity,
                    extraDetails: item.extraDetails
                }));
                
                const orderData = {
                    products,
                    totalPrice: grandTotal,
                    tokensUsed: tokensToUse,
                    discountAmount: tokenDiscountAmount,
                    paymentMethod,
                    paymentDetails: paymentMethod.includes('Cash') ? {} : paymentDetails,
                    shippingAddress: isDigitalTicketOnly ? {
                        address: 'Digital Ticket / Online Booking',
                        city: 'N/A',
                        pincode: '000000',
                        phone: user?.profile?.phone || 'N/A',
                        state: 'N/A'
                    } : shippingAddress
                };

                const res = await axios.post('http://localhost:5000/api/orders', orderData, config);
                
                setLastOrder(res.data);
                clearCart();
                setIsProcessing(false);
                setOrderSuccess(true);
                getProfile();
            } catch (error) {
                console.error('Error creating order', error);
                alert('Payment failed. Please try again.');
                setIsProcessing(false);
            }
        }, 2000);
    };

    if (orderSuccess && lastOrder) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 py-20">
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-green-100 p-6 rounded-full text-green-600 mb-8 shadow-xl shadow-green-200/50"
                >
                    <CheckCircle size={100} />
                </motion.div>
                
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Order Confirmed!</h1>
                <p className="text-gray-500 text-center max-w-md mb-8 text-lg">
                    Order ID: <span className="font-mono text-purple-600 font-bold">#{lastOrder._id.slice(-8).toUpperCase()}</span>
                </p>

                <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 max-w-2xl w-full mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Payment Summary</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                    <span className="text-sm text-gray-500">Method</span>
                                    <span className="text-sm font-bold text-gray-900">{paymentMethod}</span>
                                </div>
                                {paymentMethod === 'PhonePe/UPI' && (
                                    <div className="flex justify-between items-center bg-purple-50 p-3 rounded-xl border border-purple-100">
                                        <span className="text-sm text-purple-600">Transaction ID</span>
                                        <span className="text-sm font-bold text-purple-900">{paymentDetails.transactionId}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                    <span className="text-sm text-gray-500">Amount Paid</span>
                                    <span className="text-sm font-bold text-gray-900">₹{lastOrder.totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {!isDigitalTicketOnly && (
                            <div>
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Delivery Details</h4>
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-gray-900 uppercase">{user.name}</p>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {lastOrder.shippingAddress.address}<br />
                                        {lastOrder.shippingAddress.city}, {lastOrder.shippingAddress.state} - {lastOrder.shippingAddress.pincode}
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Estimated Delivery</p>
                                        <p className="text-sm font-bold text-gray-900">By Saturday, 15th March</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {isDigitalTicketOnly && (
                            <div className="flex flex-col items-center justify-center p-6 bg-purple-50 rounded-2xl border border-dashed border-purple-200">
                                <div className="bg-purple-100 p-3 rounded-full text-purple-600 mb-3">
                                    <CheckCircle size={32} />
                                </div>
                                <h4 className="text-lg font-black text-purple-900">Booking Confirmed!</h4>
                                <p className="text-xs text-purple-500 text-center font-bold mt-1">Show this ID at the entry counter or ticket booth.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <Link to="/orders" className="flex-1 bg-primary-gradient text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all text-center">
                        Track Your Order
                    </Link>
                    <Link to="/" className="flex-1 bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all text-center">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    // grandTotal is already defined above
    // const grandTotal = getCartTotal() * 1.18; 

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-5xl">
                {/* Breadcrumbs / Steps */}
                <div className="flex items-center justify-center mb-12 gap-4">
                    {!isDigitalTicketOnly && (
                        <>
                            <div className={`flex items-center gap-2 ${checkoutStep === 'shipping' ? 'text-purple-600' : 'text-gray-400'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${checkoutStep === 'shipping' ? 'border-purple-600 bg-purple-50' : 'border-gray-200'}`}>1</div>
                                <span className="font-bold">Shipping</span>
                            </div>
                            <div className="w-12 h-0.5 bg-gray-200"></div>
                        </>
                    )}
                    <div className={`flex items-center gap-2 ${checkoutStep === 'payment' ? 'text-purple-600' : 'text-gray-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${checkoutStep === 'payment' ? 'border-purple-600 bg-purple-50' : 'border-gray-200'}`}>{isDigitalTicketOnly ? '1' : '2'}</div>
                        <span className="font-bold">{isDigitalTicketOnly ? 'Complete Reservation' : 'Payment'}</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Section */}
                    <div className="lg:w-2/3">
                        <AnimatePresence mode="wait">
                            {checkoutStep === 'shipping' ? (
                                <motion.div 
                                    key="shipping"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
                                >
                                    <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                        <Truck className="text-purple-600" /> Delivery Address
                                    </h3>
                                    <form onSubmit={handleShippingSubmit} className="grid grid-cols-2 gap-5">
                                        <div className="col-span-2 space-y-1">
                                            <label className="text-sm font-bold text-gray-600 caps">Complete Address</label>
                                            <input 
                                                required 
                                                type="text" 
                                                className="w-full border rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition" 
                                                value={shippingAddress.address}
                                                onChange={e => setShippingAddress({...shippingAddress, address: e.target.value})}
                                                placeholder="House No, Street, Area" 
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-gray-600 caps">City</label>
                                            <input 
                                                required 
                                                type="text" 
                                                className="w-full border rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition" 
                                                value={shippingAddress.city}
                                                onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})}
                                                placeholder="e.g. Mumbai" 
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-gray-600 caps">Pincode</label>
                                            <input 
                                                required 
                                                type="text" 
                                                className="w-full border rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition" 
                                                value={shippingAddress.pincode}
                                                onChange={e => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                                                placeholder="6-digit code" 
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-gray-600 caps">Phone Number</label>
                                            <input 
                                                required 
                                                type="tel" 
                                                className="w-full border rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition" 
                                                value={shippingAddress.phone}
                                                onChange={e => setShippingAddress({...shippingAddress, phone: e.target.value})}
                                                placeholder="Contact number" 
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-gray-600 caps">State</label>
                                            <input 
                                                required 
                                                type="text" 
                                                className="w-full border rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition" 
                                                value={shippingAddress.state}
                                                onChange={e => setShippingAddress({...shippingAddress, state: e.target.value})}
                                                placeholder="e.g. Maharashtra" 
                                            />
                                        </div>
                                        <div className="col-span-2 space-y-1">
                                            <label className="text-sm font-bold text-gray-600 caps">Landmark (Optional)</label>
                                            <input 
                                                type="text" 
                                                className="w-full border rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition" 
                                                value={shippingAddress.landmark}
                                                onChange={e => setShippingAddress({...shippingAddress, landmark: e.target.value})}
                                                placeholder="Near mall, park, etc." 
                                            />
                                        </div>
                                        <div className="col-span-2 pt-4">
                                            <button 
                                                type="submit" 
                                                disabled={isSavingAddress}
                                                className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
                                            >
                                                {isSavingAddress ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                        Saving Address...
                                                    </>
                                                ) : 'Save & Continue to Payment'}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="payment"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                            <CreditCard className="text-purple-600" /> Payment Method
                                        </h3>
                                        <button onClick={() => setCheckoutStep('shipping')} className="text-purple-600 text-sm font-bold hover:underline">Change Address</button>
                                    </div>
                                    
                                    <form onSubmit={handleCheckout} className="space-y-4">
                                        <div className="space-y-4">
                                            <label className={`flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'PhonePe/UPI' ? 'border-purple-600 bg-purple-50' : 'border-gray-100 hover:border-purple-200 bg-gray-50'}`}>
                                                <input type="radio" name="payment" value="PhonePe/UPI" checked={paymentMethod === 'PhonePe/UPI'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-purple-600" />
                                                <div className="ml-4 flex items-center gap-3">
                                                    <div className="bg-white p-2 rounded-full shadow-sm"><Smartphone size={24} className="text-purple-600" /></div>
                                                    <div>
                                                        <span className="block font-bold text-gray-900">PhonePe / UPI</span>
                                                        <span className="block text-sm text-gray-500">Google Pay, PhonePe, Paytm</span>
                                                    </div>
                                                </div>
                                            </label>
                                            
                                            {paymentMethod === 'PhonePe/UPI' && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="p-5 bg-white border-2 border-purple-100 rounded-2xl space-y-3 ml-4"
                                                >
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-bold text-gray-500 uppercase">UPI Transaction ID (UTR)</label>
                                                        <input 
                                                            type="text" 
                                                            required
                                                            placeholder="Enter 12-digit Transaction ID"
                                                            className="w-full border rounded-xl px-4 py-2 outline-none focus:border-purple-500"
                                                            value={paymentDetails.transactionId}
                                                            onChange={(e) => setPaymentDetails({...paymentDetails, transactionId: e.target.value})}
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <label className={`flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'Credit/Debit Card' ? 'border-purple-600 bg-purple-50' : 'border-gray-100 hover:border-purple-200 bg-gray-50'}`}>
                                                <input type="radio" name="payment" value="Credit/Debit Card" checked={paymentMethod === 'Credit/Debit Card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-purple-600" />
                                                <div className="ml-4 flex items-center gap-3">
                                                    <div className="bg-white p-2 rounded-full shadow-sm"><CreditCard size={24} className="text-blue-500" /></div>
                                                    <div>
                                                        <span className="block font-bold text-gray-900">Credit / Debit Card</span>
                                                        <span className="block text-sm text-gray-500">Visa, MasterCard, RuPay</span>
                                                    </div>
                                                </div>
                                            </label>

                                            {paymentMethod === 'Credit/Debit Card' && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="p-5 bg-white border-2 border-purple-100 rounded-2xl space-y-4 ml-4"
                                                >
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-bold text-gray-500 uppercase">Card Holder Name</label>
                                                        <input 
                                                            type="text" 
                                                            required
                                                            placeholder="Enter name on card"
                                                            className="w-full border rounded-xl px-4 py-2 outline-none focus:border-purple-500"
                                                            value={paymentDetails.cardHolder}
                                                            onChange={(e) => setPaymentDetails({...paymentDetails, cardHolder: e.target.value})}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-bold text-gray-500 uppercase">Card Number</label>
                                                        <input 
                                                            type="text" 
                                                            required
                                                            maxLength="16"
                                                            placeholder="0000 0000 0000 0000"
                                                            className="w-full border rounded-xl px-4 py-2 outline-none focus:border-purple-500"
                                                            value={paymentDetails.cardNumber}
                                                            onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <label className="text-xs font-bold text-gray-500 uppercase">Expiry (MM/YY)</label>
                                                            <input 
                                                                type="text" 
                                                                required
                                                                placeholder="MM/YY"
                                                                className="w-full border rounded-xl px-4 py-2 outline-none focus:border-purple-500"
                                                                value={paymentDetails.expiry}
                                                                onChange={(e) => setPaymentDetails({...paymentDetails, expiry: e.target.value})}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-xs font-bold text-gray-500 uppercase">CVV</label>
                                                            <input 
                                                                type="password" 
                                                                required
                                                                maxLength="3"
                                                                placeholder="***"
                                                                className="w-full border rounded-xl px-4 py-2 outline-none focus:border-purple-500"
                                                                value={paymentDetails.cvv}
                                                                onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                                                            />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>

                                        <label className={`flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'Cash Payment' ? 'border-purple-600 bg-purple-50' : 'border-gray-100 hover:border-purple-200 bg-gray-50'}`}>
                                            <input type="radio" name="payment" value="Cash Payment" checked={paymentMethod === 'Cash Payment'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-purple-600" />
                                            <div className="ml-4 flex items-center gap-3">
                                                <div className="bg-white p-2 rounded-full shadow-sm"><Truck size={24} className="text-orange-500" /></div>
                                                <div>
                                                    <span className="block font-bold text-gray-900">
                                                        {hasHotelsOnly ? 'Pay at Hotel / Cash' : (hasBusOnly ? 'Pay to Driver / Cash' : (isDigitalTicketOnly ? 'Pay at Counter / Cash' : 'Cash on Delivery'))}
                                                    </span>
                                                    <span className="block text-sm text-gray-500">
                                                        {hasHotelsOnly ? 'Reserve now, pay when you check-in' : (hasBusOnly ? 'Reserve seat, pay while boarding' : (isDigitalTicketOnly ? 'Reserve now, pay at venue' : 'Pay securely at your doorstep'))}
                                                    </span>
                                                </div>
                                            </div>
                                        </label>

                                        <div className="pt-6">
                                            <button 
                                                type="submit" 
                                                disabled={isProcessing}
                                                className={`w-full bg-primary-gradient text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-purple-500/30 transition-all flex items-center justify-center gap-2 ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                                            >
                                                {isProcessing ? 'Confirming Order...' : `Complete Order - ₹${grandTotal.toFixed(0).toLocaleString('en-IN')}`}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 overflow-hidden">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-4 border-b">Order Summary</h3>
                            
                            {/* Token Discount Section */}
                            {user?.tokens >= 5 && (
                                <div className="mb-6 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                                    <h4 className="text-xs font-black text-yellow-700 uppercase tracking-widest mb-3">Apply Tokens</h4>
                                    <p className="text-[10px] text-yellow-600 mb-3">5 Tokens = 25% Off | 20 Tokens = 100% Off</p>
                                    <div className="flex flex-wrap gap-2">
                                        {[0, 5, 10, 15, 20].map(val => (
                                            val <= maxTokensPossible && (
                                                <button
                                                    key={val}
                                                    onClick={() => setTokensToUse(val)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                        tokensToUse === val 
                                                        ? 'bg-yellow-500 text-white shadow-md' 
                                                        : 'bg-white text-yellow-700 border border-yellow-200 hover:bg-yellow-100'
                                                    }`}
                                                >
                                                    {val === 0 ? 'None' : `${val} Trs`}
                                                </button>
                                            )
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-bold text-yellow-800 mt-2">Available: {user.tokens} Tokens</p>
                                </div>
                            )}

                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                                {cart.map(item => (
                                    <div key={item._id} className="flex flex-col gap-1 border-b border-gray-50 pb-3 mb-3 last:border-0">
                                        <div className="flex justify-between items-start gap-4 text-sm">
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900 truncate">{item.productName}</p>
                                                <p className="text-gray-500 text-xs">{item.quantity} x ₹{item.price.toLocaleString()}</p>
                                            </div>
                                            <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                        {item.extraDetails && Array.isArray(item.extraDetails) && (
                                            <div className="flex flex-wrap gap-1">
                                                {item.extraDetails.map(detail => (
                                                    <span key={detail} className="bg-purple-100 text-purple-700 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                                                        {item.category.toLowerCase() === 'hotels' ? 'Room' : 'Seat'} {detail}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-dashed pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">GST ({storeSettings.gstPercentage}%)</span>
                                    <span className="font-bold">₹{gstAmount.toFixed(0).toLocaleString()}</span>
                                </div>
                                {tokenDiscountAmount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span className="font-bold">Token Discount ({tokensToUse} tokens)</span>
                                        <span className="font-bold">-₹{tokenDiscountAmount.toFixed(0).toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Delivery Charge</span>
                                    <span className={`font-bold ${isFreeDelivery ? 'text-green-600' : ''}`}>
                                        {isFreeDelivery ? 'FREE' : `₹${deliveryCharge.toLocaleString()}`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end pt-2 border-t mt-2">
                                    <span className="font-black text-gray-900">Total Payable</span>
                                    <span className="text-2xl font-black text-purple-600">₹{grandTotal.toFixed(0).toLocaleString()}</span>
                                </div>
                            </div>
                            
                            {checkoutStep === 'payment' && (
                                <div className="mt-6 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">Shipping To</p>
                                    <p className="text-xs font-bold text-purple-900 leading-relaxed">
                                        {shippingAddress.address}, {shippingAddress.city} - {shippingAddress.pincode}
                                    </p>
                                    <p className="text-xs text-purple-600 mt-1">{shippingAddress.phone}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
