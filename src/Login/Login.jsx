import React, { useState, useContext } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthProvider';

export default function Login() {
    const navigate = useNavigate();
    const { setTokenAndRole, apiRequest, errorMessage } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            return;
        }

        try {
            const response = await apiRequest('POST', 'api/users/login', {
                Email: email,
                Password: password,
            });

            if (response) {
                const token = response.token; // Припускаємо, що ваш API повертає токен
                setTokenAndRole(token); // Встановлюємо токен і роль
                navigate("/");  // Redirect on successful login
            } else {
                setErrorMessage('Authentication failed.');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred during login.');
        }
    };

    return (
        <div className="box">
            <div className="lrheader">
                <header>Login</header>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="input-box">
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Email"
                        autoComplete="off"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Update email state
                    />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        className="input-field"
                        placeholder="Password"
                        autoComplete="off"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update password state
                    />
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}
                <div className="input-submit">
                    <button type="submit" className="submit-btn" id="submit">Sign In</button>
                </div>
                <div className="sign-up-link">
                    <p>Don't have an account? <Link to="/registration">Sign Up</Link></p>
                </div>
            </form>
        </div>
    );
}

