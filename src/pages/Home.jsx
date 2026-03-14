import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Zap, Globe, Ticket, Hotel, Bus } from 'lucide-react';


const Home = () => {
    return (
        <div className="min-h-screen">

            {/* Hero Section */}
            <div className="relative h-[90vh] flex items-center overflow-hidden bg-dark-gradient">
                <div className="absolute inset-0 z-0">
                    <img src="/assets/hero.png" alt="Hero" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <span className="inline-block bg-purple-500/20 text-purple-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 backdrop-blur-md border border-purple-500/30">
                            The All-in-One E-Commerce Platform
                        </span>
                        <h1 className="text-5xl md:text-8xl font-black text-white leading-[1.1] mb-8">
                            One App. <br />
                            <span className="text-gradient">Unlimited</span> <br />
                            Possibilities.
                        </h1>
                        <p className="text-xl text-gray-400 font-medium mb-12 max-w-xl leading-relaxed">
                            Buy luxury products, book movie tickets, reserve hotels, and plan your metro commute—all in one smart, AI-powered sleek interface.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Link to="/products" className="bg-primary-gradient px-12 py-5 rounded-3xl text-white font-black hover:scale-105 transition-all shadow-2xl shadow-purple-500/30 flex items-center justify-center gap-3">
                                <ShoppingBag /> Start Shopping
                            </Link>
                            <Link to="/products" className="bg-white/10 backdrop-blur-md border border-white/20 px-12 py-5 rounded-3xl text-white font-black hover:bg-white/20 transition-all flex items-center justify-center gap-3">
                                Explore Categories
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Categories Header */}

            {/* Smart Categories */}
            <div className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 mb-2 underline decoration-purple-500 decoration-8 underline-offset-8">Shop by Category</h2>
                            <p className="text-gray-500 font-bold uppercase tracking-wider text-xs">Everything you need, in one place.</p>
                        </div>
                        <Link to="/products" className="text-purple-600 font-black flex items-center gap-1 hover:gap-2 transition-all">View All <Star size={18} /></Link>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        <CategoryLink to="/products" category="Movies">
                            <CategoryCard title="Movies" img="/assets/movies.png" icon={<Ticket />} color="bg-pink-500" count="Latest Box Office" />
                        </CategoryLink>
                        <CategoryLink to="/products" category="Hotels">
                            <CategoryCard title="Hotels" img="/assets/hotels.png" icon={<Hotel />} color="bg-blue-500" count="Luxury Stays" />
                        </CategoryLink>
                        <CategoryLink to="/products" category="Transport">
                            <CategoryCard title="Transport" img="/assets/transport.png" icon={<Bus />} color="bg-orange-500" count="Bus & Metro" />
                        </CategoryLink>
                        <CategoryLink to="/products" category="Electronics">
                            <CategoryCard title="Shopping" img="/assets/hero.png" icon={<ShoppingBag />} color="bg-purple-500" count="Premium Brands" />
                        </CategoryLink>
                    </div>
                </div>
            </div>

            {/* Why Us Section */}
            <div className="py-24 bg-gray-50 overflow-hidden relative">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">Built for the <br />Modern Consumer.</h2>
                        <div className="space-y-8">
                            <InfoRow 
                                icon={<Star className="text-yellow-500" />} 
                                title="Seamless Integration" 
                                text="From checkout for products to instant digital tickets for your commute—everything is handled automatically." 
                            />
                            <InfoRow 
                                icon={<Globe className="text-blue-500" />} 
                                title="Available Everywhere" 
                                text="Manage your bookings and cart across devices with our synced smart dashboard." 
                            />
                            <InfoRow 
                                icon={<Zap className="text-purple-500" />} 
                                title="Speed & Security" 
                                text="Built on advanced tech stacks to ensure lightning-fast performance and total transaction safety." 
                            />
                        </div>
                    </div>
                    <div className="relative">
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            className="bg-white p-4 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border"
                        >
                            <img src="/assets/hero.png" alt="App Preview" className="rounded-[32px] w-full" />
                        </motion.div>
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>
                    </div>
                </div>
            </div>

            {/* Footer / CTA */}
            <div className="py-24 bg-dark-gradient text-white text-center pb-32">
                <h2 className="text-5xl font-black mb-8">Ready to upgrade your shopping?</h2>
                <Link to="/register" className="bg-primary-gradient px-12 py-5 rounded-full text-xl font-black shadow-2xl hover:scale-105 transition-all inline-block">
                    Create Your Account Instantly
                </Link>
            </div>
        </div>
    );
};

const CategoryLink = ({ to, category, children }) => (
    <Link to={to} state={{ category: category === 'Transport' ? 'Bus' : category }} className="block">
        {children}
    </Link>
);

const CategoryCard = ({ title, img, icon, color, count }) => (
    <motion.div 
        whileHover={{ y: -15 }}
        className="group relative h-80 rounded-[40px] overflow-hidden shadow-2xl cursor-pointer"
    >
        <img src={img} alt={title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute top-6 right-6">
            <div className={`${color} p-3 rounded-2xl text-white shadow-xl`}>
                {icon}
            </div>
        </div>
        <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-2xl font-black mb-1">{title}</h3>
            <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">{count}</p>
        </div>
    </motion.div>
);

const InfoRow = ({ icon, title, text }) => (
    <div className="flex gap-6">
        <div className="bg-white p-4 rounded-3xl shadow-xl border w-max h-max shrink-0">
            {icon}
        </div>
        <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed">{text}</p>
        </div>
    </div>
);

export default Home;
