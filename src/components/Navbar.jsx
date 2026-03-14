import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, LogOut, Heart, Package, ShoppingCart, Search, HelpCircle, Coins } from 'lucide-react';
import VoiceAssistant from './VoiceAssistant';
import ImageScanner from './ImageScanner';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e, queryOverride) => {
        if (e) e.preventDefault();
        const finalQuery = queryOverride || searchQuery;
        if (finalQuery.trim()) {
            navigate('/products', { state: { search: finalQuery } });
            setSearchQuery('');
        }
    };

    return (
        <nav className="glass sticky top-0 z-[100] border-b border-white/20">
            <div className="container mx-auto px-6 py-4 flex flex-wrap lg:flex-nowrap justify-between items-center gap-4">
                <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2 shrink-0">
                    <div className="bg-primary-gradient p-1.5 rounded-lg text-white">
                        <ShoppingCart size={24} />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 hidden sm:inline">SMARTSTORE</span>
                </Link>

                <div className="flex-grow max-w-xl mx-4 order-3 lg:order-none w-full lg:w-auto flex items-center gap-2">
                    <form onSubmit={(e) => handleSearch(e)} className="relative group flex-grow">
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Find products, tickets..."
                            className="w-full bg-gray-100 border-none rounded-2xl py-2.5 px-10 text-sm font-bold focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                        />
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    </form>
                    <VoiceAssistant setSearchQuery={setSearchQuery} onTranscript={(text) => handleSearch(null, text)} />
                    <ImageScanner />
                </div>

                <div className="flex items-center space-x-6 order-2 shrink-0">
                    {user ? (
                        <div className="flex items-center space-x-6">
                            <Link to="/orders" className="text-gray-600 hover:text-purple-600 transition flex items-center gap-2 font-bold text-sm">
                                <Package size={20} /> <span className="hidden md:inline">Orders</span>
                            </Link>
                            <Link to="/wishlist" className="text-gray-600 hover:text-red-500 transition relative">
                                <Heart size={20} />
                            </Link>

                            <div className="flex items-center gap-1.5 bg-yellow-50 px-2 pb-1 pt-1 rounded-xl border border-yellow-200">
                                <Coins size={16} className="text-yellow-600" />
                                <span className="text-xs font-black text-yellow-700">{user.tokens || 0}</span>
                            </div>

                            <Link to="/help" className="text-gray-600 hover:text-blue-600 transition">
                                <HelpCircle size={20} />
                            </Link>
                            
                            <div className="h-4 w-px bg-gray-200"></div>

                            <div className="flex items-center gap-3">
                                <div className="bg-gray-100 p-2 rounded-full text-gray-600">
                                    <User size={18} />
                                </div>
                                <div className="hidden lg:block text-left">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Welcome back</p>
                                    <p className="text-sm font-black text-gray-800 leading-none">{user.name}</p>
                                </div>
                            </div>

                            {user.role === 'admin' && (
                                <Link to="/admin" className="bg-dark-gradient text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg">ADMIN</Link>
                            )}

                            <button onClick={logout} className="text-gray-400 hover:text-red-600 transition">
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/login" className="text-gray-900 font-black hover:text-purple-600 transition">Login</Link>
                            <Link to="/register" className="bg-primary-gradient text-white px-6 py-2 rounded-full font-black shadow-lg hover:scale-105 transition-all text-sm">Join Now</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
