import { Link, useNavigate } from 'react-router-dom';
import  '../Login/Login.css';
import React, { useState, useContext } from 'react';
import { AuthContext } from '../Contexts/AuthProvider'; 

export default function RegSeller () {
    const [storeName, setStoreName] = useState('');
    const [storeDescription, setStoreDescription] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const navigate = useNavigate(); // Для перенаправлення після успішної реєстрації

    const { setTokenAndRole, apiRequest, errorMessage, setErrorMessage, userId } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiRequest('POST', 'api/sellers/register', {
                userId, storeName, storeDescription, contactEmail, contactPhone
            });
            
            if (response) {
                navigate('/'); // Змінити на відповідний маршрут після успішної реєстрації
            }
        } catch (error) {
            setErrorMessage('Failed to register store. Please try again.');
        }
    };

    return (
        <div className="box">
            <div className="lrheader">
                <header>Register Store</header>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Виводимо повідомлення про помилку */}
            <form onSubmit={handleSubmit}>
                
                <div className="input-box">
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Store Name"
                        autoComplete="off"
                        required
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)} // Зберігаємо введене значення
                    />
                </div>
                <div className="input-box">
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Store Description"
                        autoComplete="off"
                        required
                        value={storeDescription}
                        onChange={(e) => setStoreDescription(e.target.value)} // Зберігаємо введене значення
                    />
                </div>
                <div className="input-box">
                    <input
                        type="email"
                        className="input-field"
                        placeholder="Contact Email"
                        autoComplete="off"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)} // Зберігаємо введене значення
                    />
                </div>
                <div className="input-box">
                    <input
                        type="tel"
                        className="input-field"
                        placeholder="Contact Phone"
                        autoComplete="off"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)} // Зберігаємо введене значення
                    />
                </div>
                <div className="input-submit">
                    <button className="submit-btn" id="submit" type="submit">Sign Up</button>
                </div>
            </form>

            <div className="sign-in-link">
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};