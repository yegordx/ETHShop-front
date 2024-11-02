import "./Nav.css"
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function NavElement(props) {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
        // Виклик функції, якщо вона передана через props
        if (props.onClick) {
            props.onClick();
        }
    };

    return (
        <div className="profile-dropdown">
            <div className="drop-btn">
                <Link to={props.to} onClick={handleClick}>{props.text}</Link>
            </div>
            
            {/* Відображення елементів випадаючого меню, якщо стан open = true */}
            {open && (
                <div className="dropdown">
                    {props.children}
                </div>
            )}
        </div>
    );
};

export function DropDownItem(props) {
    return (
        <div className='menu-item' onClick={props.onClick}>
            <Link to={props.to}>
                {props.text}
            </Link>
        </div>
    );
}