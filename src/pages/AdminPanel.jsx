import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, Package, ShoppingBag, LayoutDashboard, Settings, MessageSquare } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminPanel = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    const menuItems = [
        { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
        { title: 'Users', icon: <Users size={20} />, path: '/admin/users' },
        { title: 'Products', icon: <Package size={20} />, path: '/admin/products' },
        { title: 'Orders', icon: <ShoppingBag size={20} />, path: '/admin/orders' },
        { title: 'Reviews', icon: <MessageSquare size={20} />, path: '/admin/reviews' },
        { title: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
    ];


    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg flex flex-col pt-10 px-4">
                <div className="mb-8 px-4">
                    <h2 className="text-2xl font-black text-gray-900">Admin Panel</h2>
                    <p className="text-sm text-gray-500 mt-1">Welcome, {user.name}</p>
                </div>
                <div className="flex flex-col gap-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        return (
                            <Link 
                                key={item.title} 
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-bold ${
                                    isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {item.icon}
                                <span>{item.title}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-8 overflow-y-auto h-screen">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminPanel;
