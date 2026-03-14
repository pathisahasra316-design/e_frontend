import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    const register = async (name, email, password) => {
        const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
    };

    const getProfile = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo && userInfo.token) {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get('http://localhost:5000/api/users/profile', config);
                // Keep the token from localStorage but update everything else
                const updatedUser = { ...data, token: userInfo.token };
                setUser(updatedUser);
                localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                return updatedUser;
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            // If token is invalid, logout
            if (error.response && error.response.status === 401) {
                logout();
            }
        }
    };

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
            getProfile();
        }
    }, []);

    const setAuthData = (data) => {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, setAuthData, getProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
