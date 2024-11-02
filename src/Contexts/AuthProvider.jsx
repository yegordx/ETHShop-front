import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { useActiveAccount } from "thirdweb/react";
import { SiAzurefunctions } from 'react-icons/si';
import { Link, useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [role, setRole] = useState(null); // Додаємо змінну для ролі
    const [userId, setuserId] = useState(null);
    const activeAccount = useActiveAccount();
    const address = activeAccount?.address;

    useEffect(() => {
        const token = Cookies.get('jwt');
        if (token) {
            setIsAuthenticated(true);
            parseTokenAndSetRole(token);
        }
    }, []);

    const parseTokenAndSetRole = (token) => {
        try {
            const decoded = jwtDecode(token);
            // Використовуємо правильне поле для отримання ролі
            if (decoded && decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) {
                setRole(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
                console.log(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
                setuserId(decoded.userId); 
            } else {
                setRole(null);  // Якщо роль відсутня
            }
        } catch (error) {
            console.error('Failed to decode token:', error);
            setRole(null);
        }
    };
    
    const setTokenAndRole = (token) => {
        Cookies.set('jwt', token, { 
            expires: 1,
            secure: true,
            sameSite: 'Strict',
        });
        setIsAuthenticated(true);
        parseTokenAndSetRole(token);
        
    };

    const apiRequest = async (method, route, data, headers = {}) => {
        const baseURL = 'https://avet-shop-748665ae765c.herokuapp.com/';
      
        try {
          const response = await axios({
            method: method,
            url: `${baseURL}${route}`, 
            data: data,
            headers: headers,
          });
          return response.data;
        } catch (error) {
          console.error('Error in API request:', error);
          throw error.response?.data || 'Unknown error';
        }
    };

    const switchAccount = async () => {
        const token = Cookies.get('jwt');
        let decodedToken;
        
        // Перевіряємо, чи токен існує, і декодуємо його
        if (token) {
            try {
                decodedToken = jwtDecode(token);
            } catch (error) {
                console.error('Failed to decode token:', error);
                return; // Виходимо з функції, якщо декодування не вдалося
            }
        } else {
            console.error('Token not found');
            return; // Виходимо з функції, якщо токен не знайдено
        }
    
        let response;
        
        // Використовуємо роль з декодованого токена замість змінної role
        const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    
        if (userRole === "User") {  // Перевіряємо роль з токена
            console.log(decodedToken.userId);
            console.log(userRole);
        
            try {
                response = await apiRequest('POST', `api/sellers/login/${decodedToken.userId}`);
                if (response && response.token) {
                    const currentToken = response.token;
                    setTokenAndRole(currentToken);  // Оновлюємо токен і роль
                    navigate("/");  // Перенаправляємо на головну сторінку
                } else {
                    navigate("/register-seller");
                    console.error('No token in response');
                }
            } catch (error) {
                    navigate("/register-seller");  // Перенаправляємо на реєстрацію продавця, якщо статус 400
            }
            
        } else {
            // Якщо роль не "User", виконуємо logout і перенаправляємо на логін
            logout();
            navigate("/loginUser");
            return; // Виходимо з функції, щоб уникнути виконання нижнього коду
        }
    
        
    };

    const logout = () => {
        Cookies.remove('jwt');
        setIsAuthenticated(false);
        setRole(null); 
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, setTokenAndRole, apiRequest, errorMessage, logout, switchAccount, userId }}>
            {children}
        </AuthContext.Provider>
    );
};


export default AuthProvider;