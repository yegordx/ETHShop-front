import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { useActiveAccount } from "thirdweb/react";
import { SiAzurefunctions } from 'react-icons/si';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [role, setRole] = useState(null); // Додаємо змінну для ролі
    
    const activeAccount = useActiveAccount();
    const address = activeAccount?.address;

    useEffect(() => {
        const token = Cookies.get('jwt');
        if (token) {
            setIsAuthenticated(true);
            parseTokenAndSetRole(token);  // Парсимо токен при завантаженні сторінки
        }
    }, []);

    const parseTokenAndSetRole = (token) => {
        try {
            const decoded = jwtDecode(token);
            if (decoded && decoded.role) {
                setRole(decoded.role);  // Зберігаємо роль
            } else {
                setRole(null);  // Якщо роль відсутня
            }
        } catch (error) {
            console.error('Failed to decode token:', error);
            setRole(null);
        }
    };
    const switchAccount = async () =>{
        const token = Cookies.get('jwt');
        const decodedToken = jwtDecode(token);
        const currentId = decodedToken.userId;
        if (role == "User"){
            const response = await axios.post('http://localhost:5257/api/sellers/login',{
                UserID: currentId
            })
        }
    }
    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:5257/api/users/login', {
                Email: email,
                Password: password,
            });

            if (response.status === 200) {
                const token = response.data.token;
                Cookies.set('jwt', token, { 
                    expires: 1,
                    secure: true,
                    sameSite: 'Strict',
                });
                setIsAuthenticated(true);
                parseTokenAndSetRole(token);  // Парсимо токен після логіну
                return true;  // Login successful
            } else {
                setErrorMessage('Authentication failed.');
                return false;  // Login failed
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred.');
            return false;  // Login failed due to error
        }
    };

    const reg = async (email, password, walletAddress) => {
        try {
            const response = await axios.post('http://localhost:5257/api/users/register', {
                UserName: email.split('@')[0],  // Приклад створення username
                Email: email,
                Password: password,
                WalletAddress: walletAddress,
            });
    
            if (response.status === 200) {
                const token = response.data.token;
                Cookies.set('jwt', token, { 
                    expires: 1,
                    secure: true,
                    sameSite: 'Strict',
                });
                setIsAuthenticated(true);
                parseTokenAndSetRole(token);  // Парсимо токен після реєстрації
                return true;
            }
        } catch (error) {
            setErrorMessage('Registration failed.');
            return false;
        }
    };

    
    const logout = () => {
        Cookies.remove('jwt');
        setIsAuthenticated(false);
        setRole(null); 
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, reg, logout, errorMessage }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;