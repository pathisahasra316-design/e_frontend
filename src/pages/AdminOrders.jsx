import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ShoppingBag, Truck, CheckCircle, Package, Search, ChevronRight, AlertCircle } from 'lucide-react';
import axios from 'axios';

const AdminOrders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const [updateForm, setUpdateForm] = useState({ status: '', message: '' });

    const fetchAllOrders = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            // Note: We need a route to get ALL orders for admin. 
            // I'll check if getOrders in orderController handles admin.
            // If not, I'll need a new route. Using /api/admin/orders for now.
            const res = await axios.get('http://localhost:5000/api/admin/orders', config);
            setOrders(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            console.error("Error fetching admin orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const handleUpdateStatus = async (orderId) => {
        if (!updateForm.status) return;
        
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            
            await axios.put(`http://localhost:5000/api/orders/${orderId}`, {
                status: updateForm.status,
                message: updateForm.message
            }, config);
            
            // Refresh orders
            await fetchAllOrders();
            setUpdatingId(null);
            setUpdateForm({ status: '', message: '' });
        } catch (error) {
            console.error("Error updating order:", error);
            alert("Failed to update order status");
        }
    };

    const filteredOrders = orders.filter(order => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-gray-500">Loading orders...</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Order Management</h1>
                    <p className="text-gray-500">Manage customer orders and update tracking status</p>
                </div>
                
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by ID, User, Email..." 
                        className="pl-10 pr-4 py-2 border rounded-xl w-full md:w-80 outline-none focus:border-purple-500 transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Order Details</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900 lowercase truncate max-w-[120px]">#{order._id.slice(-8)}</span>
                                            <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900">{order.userId?.name}</span>
                                            <span className="text-xs text-gray-500">{order.userId?.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                            order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                            order.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                            'bg-purple-50 text-purple-700 border-purple-200'
                                        }`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">₹{order.totalPrice.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => setUpdatingId(order._id)}
                                            className="text-purple-600 hover:text-purple-800 text-sm font-bold flex items-center gap-1 ml-auto"
                                        >
                                            Update <ChevronRight size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {filteredOrders.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="font-bold">No orders found</p>
                    </div>
                )}
            </div>

            {/* Update Modal */}
            {updatingId && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-black text-gray-900">Update Order Status</h2>
                            <button onClick={() => setUpdatingId(null)} className="text-gray-400 hover:text-gray-600">×</button>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="space-y-1">
                                <label className="font-bold text-gray-600">Status</label>
                                <select 
                                    className="w-full border rounded-xl p-3 outline-none focus:border-purple-500"
                                    value={updateForm.status}
                                    onChange={(e) => setUpdateForm({...updateForm, status: e.target.value})}
                                >
                                    <option value="">Select Status</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Out for Delivery">Out for Delivery</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="font-bold text-gray-600">Daily Update Message</label>
                                <textarea 
                                    className="w-full border rounded-xl p-3 outline-none focus:border-purple-500 h-32 resize-none"
                                    placeholder="Add a detailed update for the customer (e.g., 'Item has left the Mumbai warehouse and is on its way to your city.')"
                                    value={updateForm.message}
                                    onChange={(e) => setUpdateForm({...updateForm, message: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <button 
                                onClick={() => setUpdatingId(null)}
                                className="px-6 py-3 border rounded-xl font-bold text-gray-600 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => handleUpdateStatus(updatingId)}
                                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-200"
                                disabled={!updateForm.status}
                            >
                                Update Status
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
