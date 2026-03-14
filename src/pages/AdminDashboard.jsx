import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalSales: 0,
        totalUsers: 0,
        totalOrders: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/admin/stats', config);
                setStats(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching admin stats", error);
                setLoading(false);
            }
        };
        fetchStats();
    }, [user.token]);

    if (loading) return <div className="p-8 font-bold text-gray-500">Loading Dashboard Data...</div>;

    return (
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-500/30">
                    <h3 className="text-lg font-medium opacity-80 uppercase tracking-widest text-xs mb-2">Total Sales</h3>
                    <div className="text-4xl font-black">₹ {stats.totalSales.toLocaleString('en-IN')}</div>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/30">
                    <h3 className="text-lg font-medium opacity-80 uppercase tracking-widest text-xs mb-2">Total Users</h3>
                    <div className="text-4xl font-black">{stats.totalUsers}</div>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-500/30">
                    <h3 className="text-lg font-medium opacity-80 uppercase tracking-widest text-xs mb-2">Total Orders</h3>
                    <div className="text-4xl font-black">{stats.totalOrders}</div>
                </motion.div>
            </div>
            
            <div className="mt-10">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                {stats.recentOrders && stats.recentOrders.length > 0 ? (
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-100 text-gray-600 text-sm">
                                <tr>
                                    <th className="p-4 rounded-tl-2xl">Order ID</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 rounded-tr-2xl">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map(order => (
                                    <tr key={order._id} className="border-t border-gray-200 hover:bg-white transition text-sm">
                                        <td className="p-4 text-gray-500 font-mono text-xs">{order._id.substring(18)}</td>
                                        <td className="p-4 font-medium">{order.userId ? order.userId.name : 'Unknown User'}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                                order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-gray-900">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 h-64 flex items-center justify-center text-gray-400">
                        No recent activity found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
