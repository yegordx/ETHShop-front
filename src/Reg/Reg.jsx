import { Link, useNavigate } from 'react-router-dom';
import  '../Login/Login.css';
import { useActiveAccount } from "thirdweb/react";
import WalletButton from "./WalletComponent";
import React, { useState, useContext } from 'react';
import { AuthContext } from '../Contexts/AuthProvider'; // Правильний контекст

export default function Registration() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { reg, errorMessage } = useContext(AuthContext);

  const navigate = useNavigate();
  
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Перевірка на порожні поля
    if (!email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    // Перевірка на збіг паролів
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // Перевірка чи є підключена адреса гаманця
    if (!address) {
      setErrorMessage('Please connect your wallet.');
      return;
    }

    const success = await reg(email, password, address);

    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="box">
      <div className="lrheader">
        <header>Register</header>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Виводимо повідомлення про помилку */}
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <input
            type="text"
            className="input-field"
            placeholder="Email"
            autoComplete="off"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Зберігаємо введене значення
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
            onChange={(e) => setPassword(e.target.value)} // Зберігаємо введене значення
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            className="input-field"
            placeholder="Confirm Password"
            autoComplete="off"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // Зберігаємо введене значення
          />
        </div>
        <div className="input-box">
            <WalletButton/>
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
}
