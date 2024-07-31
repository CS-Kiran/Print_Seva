// src/contexts/ShopkeeperContext.js

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ShopkeeperContext = createContext();

export const ShopkeeperProvider = ({ children }) => {
    const [shopkeeper, setShopkeeper] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('shopkeeper_token');
        if (token) {
            fetchShopkeeperData(token);
        }
    }, []);

    const fetchShopkeeperData = async (token) => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/shopkeeper', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShopkeeper(response.data);
        } catch (error) {
            console.error('Failed to fetch shopkeeper data', error);
        }
    };

    const logout = async () => {
        const token = localStorage.getItem('user_token');
    
        try {
            // Make API call to log out
            await axios.post('http://127.0.0.1:5000/api/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Clear user data and token from local storage
            setShopkeeper(null);
            localStorage.removeItem('shopkeeper_token');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };
    

    return (
        <ShopkeeperContext.Provider value={{ shopkeeper, logout }}>
            {children}
        </ShopkeeperContext.Provider>
    );
};

export const useShopkeeper = () => useContext(ShopkeeperContext);
