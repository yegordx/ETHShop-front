import { Link, useNavigate } from 'react-router-dom';
import  '../Login/Login.css';
import { useActiveAccount } from "thirdweb/react";
// import WalletButton from "./WalletComponent";
import React, { useState, useContext } from 'react';
import { AuthContext } from '../Contexts/AuthProvider'; // Правильний контекст
import Web3 from 'web3';
import {Button} from "react-bootstrap"

export default function Registration() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [walletAddress, setWalletAddress] = useState(null);

  const { setTokenAndRole, apiRequest, errorMessage, setErrorMessage } = useContext(AuthContext);

  const navigate = useNavigate();
  
  const connectWallet = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      
      // Правильний спосіб запиту облікових записів через MetaMask
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Отримання першого облікового запису (адреси гаманця)
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error("Не вдалося підключитися до MetaMask:", error);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!walletAddress) {
      setErrorMessage('Please connect your wallet.');
      return;
    }

    try {
      const response = await apiRequest('POST', 'api/users', {
        UserName: email.split('@')[0], 
        Email: email,
        Password: password,
        WalletAddress: walletAddress,
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
        <div>
          <Button onClick={connectWallet} style={{ backgroundColor: "#ccf2f2", color: "black", border: "0" }}>
          {walletAddress ? walletAddress : "Підключити гаманець"}
            </Button>
          <p></p>
        </div>
        
        {walletAddress != null ? (
          <Button onClick={() => setWalletAddress(null)}>Disconnect</Button>
        ) : null}        
        <p></p>
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
