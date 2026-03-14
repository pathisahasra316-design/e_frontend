import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminUsers = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);

    const fetchUsers = useCallback(async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/users', config);
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, [user?.token]);

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchUsers();
        }
    }, [user, fetchUsers]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`http://localhost:5000/api/users/${id}`, config);
                fetchUsers();
            } catch (error) {
                alert('Error deleting user');
            }
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Manage Users</h1>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="p-4 font-bold text-gray-700 uppercase string text-xs tracking-wider">ID</th>
                            <th className="p-4 font-bold text-gray-700 uppercase string text-xs tracking-wider">Name</th>
                            <th className="p-4 font-bold text-gray-700 uppercase string text-xs tracking-wider">Email</th>
                            <th className="p-4 font-bold text-gray-700 uppercase string text-xs tracking-wider">Role</th>
                            <th className="p-4 font-bold text-gray-700 uppercase string text-xs tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <motion.tr 
                                key={u._id} 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="border-b border-gray-100 hover:bg-gray-50 transition"
                            >
                                <td className="p-4 text-sm text-gray-500">{u._id}</td>
                                <td className="p-4 font-medium text-gray-900">{u.name}</td>
                                <td className="p-4 text-gray-600">{u.email}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                        {u.role.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => deleteHandler(u._id)}
                                        className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
