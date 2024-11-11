import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthProvider';
import NavElement, { DropDownItem } from './NavElement';
import CartModal from '../ShoppingCart/CartModal'
import SearchElement from './SearchElement';

export default function Header() {
    const { isAuthenticated, logout, switchAccount, role, userId, apiRequest } = useContext(AuthContext);
    const navigate = useNavigate();
    const [shoppingCart, setShoppingCart] = useState([]);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);

    const handleViewDetails = () => {
        if (role === "User") {
            navigate(`/User/${userId}`);
        } else if (role === "Seller") {
            navigate(`/Seller/${userId}`);
        }
    };

    const handleCartClick = () => {
        fetchShoppingCartData();
        setIsCartModalOpen(true);
    };

    const closeCartModal = () => {
        setIsCartModalOpen(false);
    };

    async function fetchShoppingCartData() {
        if (!userId) {
            console.error("userId is not available");
            return;
        }

        try {
            console.log(userId);
            const response = await apiRequest('GET', `api/shoppingcarts/${userId}/items`);
            setShoppingCart(response);
            console.log(response);
        } catch (error) {
            console.error('Error fetching shopping cart:', error);
        }
    };

    return (
        <header className="header d-flex justify-content-between align-items-center">
            <div className="logo">
                <h1>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Avet</Link>
                </h1>
            </div>
            <SearchElement />
            <nav className="nav">
                <ul className="nav-list d-flex">
                    {role === "User" ? (
                        <>
                            <NavElement onClick={handleCartClick} text="Cart" />
                            <NavElement to="/WishLists" text="Wishlists" />
                        </>
                    ) : null}

                    {isAuthenticated ? (
                        <NavElement text="Profile">
                            <DropDownItem text="Profile" onClick={handleViewDetails} />
                            <DropDownItem text="Switch account" onClick={switchAccount} />
                            <DropDownItem text="Logout" onClick={logout} />
                        </NavElement>
                    ) : (
                        <NavElement text="Log In" to="/loginUser" />
                    )}
                </ul>
            </nav>

            <CartModal items={shoppingCart} show={isCartModalOpen} onClose={closeCartModal} />
        </header>
    );
}
