import React, { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const storedWishlist = localStorage.getItem('wishlist');
        if (storedWishlist) {
            setWishlist(JSON.parse(storedWishlist));
        }
    }, []);

    const toggleWishlist = (product) => {
        let updatedWishlist = [...wishlist];
        const index = updatedWishlist.findIndex((p) => p._id === product._id);
        
        if (index >= 0) {
            // Remove from wishlist
            updatedWishlist.splice(index, 1);
        } else {
            // Add to wishlist
            updatedWishlist.push(product);
        }
        
        setWishlist(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    };

    const isInWishlist = (productId) => {
        return wishlist.some((p) => p._id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
