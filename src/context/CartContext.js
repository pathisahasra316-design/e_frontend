import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    const addToCart = (product, extraDetails = null) => {
        let updatedCart = [...cart];
        
        // Find if item already exists with SAME extraDetails
        const index = updatedCart.findIndex((p) => {
            if (extraDetails) {
                return p._id === product._id && JSON.stringify(p.extraDetails) === JSON.stringify(extraDetails);
            }
            return p._id === product._id && !p.extraDetails;
        });
        
        if (index >= 0) {
            // Already in cart, increase quantity
            updatedCart[index].quantity += 1;
        } else {
            // Add new item to cart
            // For tickets, quantity might be tied to number of items in extraDetails
            const qty = (extraDetails && Array.isArray(extraDetails)) ? extraDetails.length : 1;
            updatedCart.push({ ...product, quantity: qty, extraDetails });
        }
        
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const removeFromCart = (productId) => {
        const updatedCart = cart.filter((p) => p._id !== productId);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };
    
    const updateQuantity = (productId, amount) => {
        let updatedCart = [...cart];
        const index = updatedCart.findIndex((p) => p._id === productId);
        
        if (index >= 0) {
            updatedCart[index].quantity += amount;
            if (updatedCart[index].quantity <= 0) {
                updatedCart.splice(index, 1);
            }
        }
        
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };
    
    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount }}>
            {children}
        </CartContext.Provider>
    );
};
