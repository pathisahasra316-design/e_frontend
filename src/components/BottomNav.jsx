import React, { useContext } from 'react';
import { motion } from 'framer-motion';

import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Home, LayoutGrid, ShoppingBag, ShoppingCart, User, HelpCircle, Printer } from 'lucide-react';


const BottomNav = () => {
    const { user } = useContext(AuthContext);
    const { getCartCount } = useContext(CartContext);
    const location = useLocation();

    // Do not show bottom nav if user is not logged in or if they are in the admin panel
    if (!user || location.pathname.startsWith('/admin')) {
        return null;
    }

    const navItems = [
        { path: '/',        icon: <Home size={22} />,        label: 'Home'    },
        { path: '/products', icon: <LayoutGrid size={22} />,  label: 'Shop'    },
        { path: '/print',    icon: <Printer size={22} />,     label: 'Print'   },
        { path: '/cart',     icon: <ShoppingCart size={22} />, label: 'Cart',  badge: getCartCount() > 0 ? getCartCount() : undefined },
        { path: '/orders',   icon: <ShoppingBag size={22} />, label: 'Orders'  },
        { path: '/profile',  icon: <User size={22} />,        label: 'Profile' },
        { path: '/help',     icon: <HelpCircle size={22} />,  label: 'Help'    },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-40 px-1 pb-safe backdrop-blur-lg bg-white/90">
            <div className="flex justify-between items-center h-16 w-full max-w-screen-xl mx-auto px-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link 
                            key={item.label} 
                            to={item.path} 
                            className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all duration-300 ${isActive ? 'text-purple-600 scale-110' : 'text-gray-400 hover:text-gray-600 hover:scale-105'}`}
                        >
                            <div className="relative flex items-center justify-center">
                                <span className={isActive ? 'drop-shadow-[0_0_8px_rgba(147,51,234,0.3)]' : ''}>
                                    {React.cloneElement(item.icon, { size: 20 })}
                                </span>
                                {item.badge !== undefined && (
                                    <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-sm border border-white">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[9px] mt-1 font-black uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
                            {isActive && (
                                <motion.div 
                                    layoutId="bottomNavIndicator"
                                    className="absolute -top-[1px] left-1/4 right-1/4 h-1 bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-b-full shadow-[0_1px_10px_rgba(147,51,234,0.5)]" 
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>

    );
};

export default BottomNav;
