import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthProvider';
import './Header.css'; 
import NavElement, {DropDownItem} from './NavElement';


export default function Header(){
    const { isAuthenticated, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();  // Викликаємо метод logout з AuthContext
    };

    return(
    <header className="header">
        <div className="logo">
            <h1>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Avet</Link>
                </h1>
        </div>
    <div>
    <input type="search" 
    className="form-control form-control text-bg" 
    placeholder="Search..." 
    aria-label="Search"></input>
    </div>
    <nav className="nav">
                <ul className="nav-list">
                    <NavElement to = "/cart"text = "Cart"/>
                    <NavElement to = "/wishlist"text = "Wishlists"/>
                    {isAuthenticated ? (
                        <NavElement text = "Profile">
                            <DropDownItem text="Profile" to="/profile" />
                            <DropDownItem text="Switch account" to="/settings" />
                            <DropDownItem text="Logout" onClick = {logout}/>
                        </NavElement>
                        
                    ):(
                        <NavElement text = "Log In" to = "/login"/>
                    )}
                    
                </ul>
            </nav>
</header>
    )
}