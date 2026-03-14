import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            // We assume the login function successfully updates the context and local storage.
            // Wait, we need the stored user data to check if profile is somehow missing. 
            // In a real app we'd fetch the user's latest DB properties.
            // For now, since they just registered, we can check if they have a 'profile' object inside `userInfo`.
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo && !userInfo.profile) {
                navigate('/create-profile');
            } else {
                navigate('/');
            }
        } catch (error) {
            alert('Invalid Credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full glass bg-white rounded-3xl p-10 shadow-2xl border border-gray-100"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-gray-500 tracking-wide text-sm">Sign in to your AI-powered dashboard</p>
                </div>
                <form className="space-y-6" onSubmit={submitHandler}>
                    <div>
                        <input
                            type="email"
                            required
                            placeholder="Email address"
                            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-gray-50 text-gray-800 text-sm font-medium"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-gray-50 text-gray-800 text-sm font-medium"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-primary-gradient text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-500/30 transition-shadow"
                    >
                        Sign In
                    </motion.button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-purple-600 hover:text-purple-800 font-bold">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
