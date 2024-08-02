import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('user_token');
        if (token) {
            fetchUserData(token);
        }
    }, []);

    const fetchUserData = async (token) => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user data', error);
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
            setUser(null);
            localStorage.removeItem('user_token');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <UserContext.Provider value={{ user, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
