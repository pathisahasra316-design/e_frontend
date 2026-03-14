import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, Truck, CheckCircle, Clock, Calendar,
    ChevronDown, ChevronUp, MapPin, Star,
    ThumbsUp, Send, X, Award, ShoppingBag, Sparkles,
    CreditCard, Banknote, BadgeCheck, Flame
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// ─── Status helpers ──────────────────────────────────────────────────────────
const STATUS_CFG = {
    Pending:          { icon: Clock,         dot: 'bg-amber-400',    pill: 'bg-amber-50  text-amber-700  ring-amber-200'  },
    Processing:       { icon: Package,       dot: 'bg-blue-500',     pill: 'bg-blue-50   text-blue-700   ring-blue-200'   },
    Shipped:          { icon: Truck,         dot: 'bg-indigo-500',   pill: 'bg-indigo-50 text-indigo-700 ring-indigo-200' },
    'Out for Delivery':{ icon: MapPin,       dot: 'bg-fuchsia-500',  pill: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200'},
    Delivered:        { icon: CheckCircle,   dot: 'bg-emerald-500',  pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200'},
};
const cfg = (s) => STATUS_CFG[s] || STATUS_CFG['Pending'];

const RATING_LABELS = ['', 'Poor 😞', 'Fair 😐', 'Good 😊', 'Great 😁', 'Excellent 🤩'];
const QUICK_TAGS = ['Fast Delivery','Well Packaged','As Described','Great Quality','Value for Money','Easy to Use','Would Recommend'];

// ─── Star Rating ─────────────────────────────────────────────────────────────
const Stars = ({ value, onChange, size = 38, readonly = false }) => {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex gap-1 justify-center select-none">
            {[1,2,3,4,5].map(n => (
                <button
                    key={n} type="button"
                    disabled={readonly}
                    onClick={() => !readonly && onChange?.(n)}
                    onMouseEnter={() => !readonly && setHover(n)}
                    onMouseLeave={() => !readonly && setHover(0)}
                    className={`transition-all duration-100 ${readonly ? 'cursor-default' : 'hover:scale-125 active:scale-105 cursor-pointer'}`}
                    style={{ fontSize: size, lineHeight: 1 }}
                >
                    <span className={`transition-colors duration-100 ${n <= (hover || value) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                </button>
            ))}
        </div>
    );
};

// ─── Review Modal ─────────────────────────────────────────────────────────────
const ReviewModal = ({ product, orderId, user, onClose, onSuccess }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [tags, setTags] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [err, setErr] = useState('');

    const toggleTag = t => setTags(p => p.includes(t) ? p.filter(x=>x!==t) : [...p, t]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) { setErr('Please write something about your experience.'); return; }
        setSubmitting(true); setErr('');
        try {
            const body = comment.trim();
            const fullComment = tags.length ? `[${tags.join(', ')}] ${body}` : body;
            await axios.post(
                `${API_BASE_URL}/products/${product.productId?._id}/reviews`,
                { rating, comment: fullComment, userName: user?.name || 'Customer', orderId },
                { headers: { Authorization: `Bearer ${user?.token}` } }
            );
            setDone(true);
            setTimeout(() => { onSuccess(product.productId?._id); }, 1800);
        } catch (ex) {
            setErr(ex.response?.data?.message || 'Something went wrong. Please try again.');
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Sheet / Modal */}
            <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 60, scale: 0.96 }}
                transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                className="relative z-[510] w-full sm:max-w-md bg-white rounded-t-[32px] sm:rounded-[28px] overflow-hidden shadow-2xl"
            >
                {/* Gradient Header */}
                <div className="bg-primary-gradient px-6 pt-6 pb-8 relative overflow-hidden">
                    {/* Decorative blobs */}
                    <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full blur-xl" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center text-white"
                    ><X size={15}/></button>

                    <div className="flex items-center gap-3 relative">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0">
                            <Star size={22} className="text-amber-300" fill="currentColor"/>
                        </div>
                        <div className="min-w-0">
                            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Rate &amp; Review</p>
                            <h3 className="text-white font-black text-lg leading-tight truncate">
                                {product.productId?.productName || 'Product'}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-5 -mt-4 bg-white rounded-t-[28px] relative z-10">
                    <AnimatePresence mode="wait">
                        {done ? (
                            <motion.div
                                key="done"
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-10 text-center space-y-3"
                            >
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-200">
                                    <CheckCircle size={38} className="text-emerald-500"/>
                                </div>
                                <h4 className="text-xl font-black text-gray-900">Thank you! 🎉</h4>
                                <p className="text-sm text-gray-400 font-medium">Your review helps thousands of shoppers.</p>
                            </motion.div>
                        ) : (
                            <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                                {/* Stars */}
                                <div className="text-center space-y-1 pt-1">
                                    <Stars value={rating} onChange={setRating} size={42}/>
                                    <p className="text-sm font-black text-violet-600 min-h-[20px] text-center">{RATING_LABELS[rating]}</p>
                                </div>

                                {/* Quick tags */}
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Quick tags <span className="text-gray-300 normal-case tracking-normal font-medium">(optional)</span></p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {QUICK_TAGS.map(t => (
                                            <button
                                                key={t} type="button" onClick={() => toggleTag(t)}
                                                className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all duration-150 ${
                                                    tags.includes(t)
                                                        ? 'bg-violet-600 text-white border-violet-600 scale-95 shadow-md shadow-violet-200'
                                                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-violet-300 hover:text-violet-600'
                                                }`}
                                            >{t}</button>
                                        ))}
                                    </div>
                                </div>

                                {/* Textarea */}
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                                        Your experience <span className="text-violet-400">*</span>
                                    </label>
                                    <textarea
                                        value={comment} onChange={e => setComment(e.target.value)}
                                        placeholder="What did you think? Was it as described? Would you recommend it?"
                                        rows={3}
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-3.5 text-sm font-medium text-gray-800 placeholder-gray-300 focus:border-violet-300 focus:bg-white focus:outline-none transition-all resize-none"
                                    />
                                </div>

                                {err && (
                                    <p className="text-sm font-bold text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                                        ⚠️ {err}
                                    </p>
                                )}

                                <div className="flex gap-3 pb-1">
                                    <button
                                        type="button" onClick={onClose}
                                        className="flex-1 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider text-gray-400 hover:bg-gray-100 border border-gray-200 transition-all"
                                    >Cancel</button>
                                    <button
                                        type="submit" disabled={submitting}
                                        className="flex-1 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider text-white bg-primary-gradient shadow-xl shadow-violet-200 hover:shadow-violet-300 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2"
                                    >
                                        {submitting
                                            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                                            : <><Send size={13}/> Submit Review</>
                                        }
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

// ─── Tracking Step ────────────────────────────────────────────────────────────
const TrackStep = ({ track, isLatest, isLast }) => {
    const Icon = cfg(track.status).icon;
    return (
        <div className="flex gap-3 relative">
            {!isLast && (
                <div className={`absolute left-[18px] top-9 bottom-0 w-0.5 ${isLatest ? 'bg-gradient-to-b from-violet-400 to-violet-100' : 'bg-gray-100'}`}/>
            )}
            <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center z-10 ring-2 transition-all ${
                isLatest
                    ? 'bg-primary-gradient ring-violet-200 shadow-lg shadow-violet-200'
                    : 'bg-white ring-gray-100'
            }`}>
                <Icon size={15} className={isLatest ? 'text-white' : 'text-gray-300'}/>
            </div>
            <div className={`flex-1 pb-5 ${isLast ? '' : ''}`}>
                <div className="bg-white rounded-2xl border border-gray-100 px-4 py-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className={`text-sm font-black ${isLatest ? 'text-violet-700' : 'text-gray-600'}`}>{track.status}</p>
                        {isLatest && (
                            <span className="text-[9px] font-black bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full uppercase tracking-widest">Latest</span>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{track.message}</p>
                    <p className="text-[10px] text-gray-300 font-bold mt-1">
                        {new Date(track.updatedAt).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}
                    </p>
                </div>
            </div>
        </div>
    );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const Orders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);
    const [modal, setModal] = useState(null); // { product, orderId }

    const fetchOrders = useCallback(async () => {
        if (!user?.token) return;
        try {
            const { data } = await axios.get(`${API_BASE_URL}/orders`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setOrders(data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const handleReviewSuccess = (productId) => {
        setModal(null);
        setOrders(prev => prev.map(o =>
            o._id !== modal?.orderId ? o : {
                ...o,
                reviewedProducts: [...(o.reviewedProducts || []), productId]
            }
        ));
    };

    const isReviewed = (order, productId) =>
        order.reviewedProducts?.some(pid => pid?._id?.toString?.() === productId?.toString() || pid?.toString?.() === productId?.toString());

    // ── Loading ──
    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
            <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-4 border-violet-100"/>
                <div className="absolute inset-0 rounded-full border-4 border-t-violet-600 animate-spin"/>
            </div>
            <p className="text-gray-400 font-bold text-sm tracking-wide">Loading your orders…</p>
        </div>
    );

    if (!user) return (
        <div className="p-10 text-center text-gray-400 font-medium">
            Please log in to view your orders.
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/40 to-fuchsia-50/20 py-10 px-4">
            <div className="max-w-4xl mx-auto">

                {/* ── Page Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex items-center gap-4"
                >
                    <div className="w-14 h-14 bg-primary-gradient rounded-[18px] flex items-center justify-center shadow-xl shadow-violet-200">
                        <ShoppingBag size={26} className="text-white"/>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Orders</h1>
                        <p className="text-gray-400 text-sm font-bold">
                            {orders.length} order{orders.length !== 1 ? 's' : ''} &nbsp;·&nbsp;
                            <span className="text-violet-500">{orders.filter(o=>o.orderStatus==='Delivered').length} delivered</span>
                        </p>
                    </div>
                </motion.div>

                {/* ── Empty ── */}
                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[28px] p-16 text-center shadow-xl border border-gray-100"
                    >
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
                            <Package size={36} className="text-gray-200"/>
                        </div>
                        <h2 className="text-2xl font-black text-gray-700 mb-2">No orders yet</h2>
                        <p className="text-gray-400 font-medium">Start shopping to see your purchases here.</p>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order, orderIdx) => {
                            const isExp = expanded === order._id;
                            const isDelivered = order.orderStatus === 'Delivered';
                            const Icon = cfg(order.orderStatus).icon;
                            const reversedTracking = [...(order.tracking || [])].reverse();
                            const reviewedCount = order.reviewedProducts?.length ?? 0;
                            const reviewProgress = order.products.length > 0
                                ? (reviewedCount / order.products.length) * 100 : 0;

                            return (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: orderIdx * 0.05 }}
                                    className="bg-white rounded-[24px] shadow-md border border-gray-100/80 overflow-hidden hover:shadow-lg transition-shadow duration-200"
                                >
                                    {/* ── Delivered Banner ── */}
                                    {isDelivered && (
                                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 flex items-center gap-2">
                                            <BadgeCheck size={15} className="text-white shrink-0"/>
                                            <span className="text-white text-xs font-black uppercase tracking-wider">
                                                Delivered &nbsp;
                                                {order.tracking?.length > 0 && (
                                                    <span className="font-bold normal-case tracking-normal opacity-80">
                                                        on {new Date(order.tracking[order.tracking.length-1]?.updatedAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}
                                                    </span>
                                                )}
                                            </span>
                                            <div className="ml-auto flex items-center gap-1.5">
                                                <Flame size={12} className="text-amber-200"/>
                                                <span className="text-emerald-100 text-[10px] font-black uppercase tracking-widest">Leave a review!</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* ── Order Header ── */}
                                    <div
                                        className="px-5 py-4 cursor-pointer hover:bg-gray-50/60 transition-colors select-none"
                                        onClick={() => setExpanded(isExp ? null : order._id)}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                                            {/* Left info */}
                                            <div className="flex-1 min-w-0 space-y-1.5">
                                                <div className="flex items-center gap-2 text-[11px] text-gray-400 font-bold">
                                                    <Calendar size={11}/>
                                                    <span>{new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                                                    <span className="text-gray-200">|</span>
                                                    <span>ID <span className="text-gray-700 font-black">…{order._id.slice(-7)}</span></span>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {order.products.slice(0,2).map((item,i) => (
                                                        <span key={i} className="bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full border border-gray-200">
                                                            {item.productId?.productName ?? 'Item'} ×{item.quantity}
                                                        </span>
                                                    ))}
                                                    {order.products.length > 2 && (
                                                        <span className="bg-violet-50 text-violet-600 text-xs font-bold px-2.5 py-1 rounded-full border border-violet-100">
                                                            +{order.products.length - 2} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right side */}
                                            <div className="flex items-center gap-3 shrink-0">
                                                <div className="text-right">
                                                    <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest">Total</p>
                                                    <p className="text-lg font-black text-gray-900">₹{order.totalPrice.toLocaleString()}</p>
                                                </div>
                                                <span className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full ring-1 shrink-0 ${cfg(order.orderStatus).pill}`}>
                                                    <Icon size={13}/> {order.orderStatus}
                                                </span>
                                                <div className="text-gray-300 shrink-0">
                                                    {isExp ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Expanded Section ── */}
                                    <AnimatePresence>
                                        {isExp && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.22, ease: 'easeInOut' }}
                                                className="overflow-hidden"
                                            >
                                                <div className="border-t border-gray-100 bg-gradient-to-b from-slate-50/60 to-white px-5 py-5 grid grid-cols-1 md:grid-cols-2 gap-5">

                                                    {/* ── LEFT: Items + Reviews ── */}
                                                    <div className="space-y-3">
                                                        <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Order Items</h3>

                                                        {order.products.map((item, idx) => {
                                                            const pid = item.productId?._id;
                                                            const reviewed = isReviewed(order, pid);
                                                            return (
                                                                <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                                                    <div className="p-3.5 flex items-start gap-3">
                                                                        {/* Product dot color */}
                                                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                                                                            <Package size={14} className="text-violet-400"/>
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="font-black text-gray-900 text-sm leading-tight truncate">
                                                                                {item.productId?.productName ?? 'Product'}
                                                                            </p>
                                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                                <span className="text-xs text-gray-400 font-bold">Qty: {item.quantity}</span>
                                                                                {item.extraDetails?.length > 0 && (
                                                                                    <div className="flex gap-1">
                                                                                        {item.extraDetails.map(d => (
                                                                                            <span key={d} className="bg-fuchsia-50 text-fuchsia-700 text-[9px] font-black px-1.5 py-0.5 rounded-md border border-fuchsia-100 uppercase">
                                                                                                {item.productId?.category?.toLowerCase() === 'hotels' ? 'Rm' : 'Seat'} {d}
                                                                                            </span>
                                                                                        ))}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <p className="font-black text-violet-600 text-sm shrink-0">
                                                                            ₹{((item.productId?.price ?? 0) * item.quantity).toLocaleString()}
                                                                        </p>
                                                                    </div>

                                                                    {/* Review bar */}
                                                                    {isDelivered ? (
                                                                        reviewed ? (
                                                                            <div className="border-t border-gray-50 bg-emerald-50 px-3.5 py-2.5 flex items-center gap-2">
                                                                                <Award size={13} className="text-emerald-500 shrink-0"/>
                                                                                <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Reviewed</span>
                                                                                <div className="ml-auto flex gap-0.5">
                                                                                    {[1,2,3,4,5].map(s=>(
                                                                                        <span key={s} className="text-amber-400 text-xs">★</span>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        ) : pid ? (
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setModal({ product: item, orderId: order._id });
                                                                                }}
                                                                                className="w-full border-t border-gray-50 bg-gradient-to-r from-violet-50 to-indigo-50 px-3.5 py-2.5 flex items-center gap-2 hover:from-violet-100 hover:to-indigo-100 transition-colors group"
                                                                            >
                                                                                <Star size={13} className="text-amber-400 group-hover:scale-110 transition-transform" fill="currentColor"/>
                                                                                <span className="text-[11px] font-black text-violet-700 uppercase tracking-widest">Rate &amp; Review this item</span>
                                                                                <ChevronDown size={12} className="ml-auto text-violet-400 -rotate-90"/>
                                                                            </button>
                                                                        ) : (
                                                                            <div className="border-t border-gray-50 px-3.5 py-2 text-[10px] text-gray-300 font-bold text-center">Product details unavailable</div>
                                                                        )
                                                                    ) : (
                                                                        <div className="border-t border-gray-50 px-3.5 py-2 text-[10px] text-gray-300 font-black uppercase tracking-widest text-center">
                                                                            Review unlocks after delivery
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}

                                                        {/* Payment card */}
                                                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3.5 space-y-2.5">
                                                            <div className="flex items-center gap-2">
                                                                {order.paymentMethod === 'Cash on Delivery'
                                                                    ? <Banknote size={14} className="text-emerald-500"/>
                                                                    : <CreditCard size={14} className="text-blue-500"/>
                                                                }
                                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Payment</p>
                                                            </div>
                                                            <p className="text-sm font-black text-gray-800">{order.paymentMethod}</p>
                                                            {order.paymentDetails?.transactionId && order.paymentMethod === 'PhonePe/UPI' && (
                                                                <div>
                                                                    <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-0.5">Transaction ID</p>
                                                                    <p className="text-sm font-bold text-violet-700 font-mono">{order.paymentDetails.transactionId}</p>
                                                                </div>
                                                            )}
                                                            {order.paymentDetails?.cardNumber && (
                                                                <div>
                                                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-0.5">Card</p>
                                                                    <p className="text-sm font-bold text-blue-700">•••• {order.paymentDetails.cardNumber.slice(-4)}</p>
                                                                </div>
                                                            )}
                                                            {order.shippingAddress && (
                                                                <div className="border-t border-gray-50 pt-2.5">
                                                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Ship to</p>
                                                                    <p className="text-xs font-bold text-gray-700 leading-relaxed">
                                                                        {order.shippingAddress.address}, {order.shippingAddress.city}<br/>
                                                                        {order.shippingAddress.state} – {order.shippingAddress.pincode}<br/>
                                                                        <span className="text-gray-400">📞 {order.shippingAddress.phone}</span>
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* ── RIGHT: Tracking + Feedback nudge ── */}
                                                    <div className="space-y-3">
                                                        <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
                                                            <Truck size={12}/> Live Tracking
                                                        </h3>

                                                        {reversedTracking.length > 0 ? (
                                                            <div className="space-y-0">
                                                                {reversedTracking.map((track, i) => (
                                                                    <TrackStep
                                                                        key={i}
                                                                        track={track}
                                                                        isLatest={i === 0}
                                                                        isLast={i === reversedTracking.length - 1}
                                                                    />
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3 text-amber-700">
                                                                <Clock size={16} className="shrink-0"/>
                                                                <p className="text-sm font-bold">Tracking will appear here soon.</p>
                                                            </div>
                                                        )}

                                                        {/* Feedback nudge for delivered */}
                                                        {isDelivered && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-4 space-y-3"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Sparkles size={14} className="text-violet-500"/>
                                                                    <p className="text-xs font-black text-violet-800 uppercase tracking-widest">Your Feedback Matters</p>
                                                                </div>
                                                                <p className="text-xs text-violet-500 font-medium leading-relaxed">
                                                                    Help others shop smarter — rate your items and share your experience.
                                                                </p>

                                                                {/* Progress bar */}
                                                                <div className="space-y-1.5">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">
                                                                            {reviewedCount}/{order.products.length} reviewed
                                                                        </span>
                                                                        {reviewedCount === order.products.length && (
                                                                            <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1">
                                                                                <CheckCircle size={10}/> All done!
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="h-2 bg-violet-100 rounded-full overflow-hidden">
                                                                        <motion.div
                                                                            initial={{ width: 0 }}
                                                                            animate={{ width: `${reviewProgress}%` }}
                                                                            transition={{ duration: 0.6, ease: 'easeOut' }}
                                                                            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-1.5">
                                                                    <ThumbsUp size={11} className="text-violet-400"/>
                                                                    <p className="text-[10px] text-violet-400 font-bold">
                                                                        Reviews go live on product pages instantly
                                                                    </p>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </div>

                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Review Modal ── */}
            <AnimatePresence>
                {modal && (
                    <ReviewModal
                        product={modal.product}
                        orderId={modal.orderId}
                        user={user}
                        onClose={() => setModal(null)}
                        onSuccess={handleReviewSuccess}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Orders;
