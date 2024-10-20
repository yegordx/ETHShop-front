import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthProvider';
import './Header.css'; 
import NavElement, { DropDownItem } from './NavElement';

export default function Header() {
    const { isAuthenticated, logout, switchAccount, role, userId } = useContext(AuthContext);
    const navigate = useNavigate(); // Використовуємо useNavigate для маршрутизації
    const handleViewDetails = () => {
        if(role=="User"){
            navigate(`/UserProfile/${userId}`);
        }else if(role == "Seller"){
            navigate(`/SellerProfile/${userId}`);
        }
    };
    
    return (
        <header className="header">
            <div className="logo">
                <h1>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Avet</Link>
                </h1>
            </div>
            <div>
                <input 
                    type="search" 
                    className="form-control form-control text-bg" 
                    placeholder="Search..." 
                    aria-label="Search" 
                />
            </div>
            <nav className="nav">
                <ul className="nav-list">
                    {role === "User" ? (
                        <>
                            <NavElement to="/cart" text="Cart" />
                            <NavElement to="/WishLists" text="Wishlists" />
                        </>
                    ) : null}

                    {isAuthenticated ? (
                        <NavElement text="Profile">
                            <DropDownItem
                                text="Profile"
                                onClick = {handleViewDetails} // Використовуємо userId для формування URL
                            />
                            <DropDownItem text="Switch account" onClick={switchAccount} />
                            <DropDownItem text="Logout" onClick={logout} />
                        </NavElement>
                    ) : (
                        <NavElement text="Log In" to="/loginUser" />
                    )}
                </ul>
            </nav>
        </header>
    );
}