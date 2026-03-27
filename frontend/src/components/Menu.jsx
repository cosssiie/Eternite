import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";

function Menu({ isOpen, onClose }) {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    return ReactDOM.createPortal(
        <>
            <div className={`menu-overlay ${isOpen ? "active" : ""}`} onClick={onClose} />
            <section className={`menu-container ${isOpen ? "open" : ""}`}>
                <div className="menu-header">
                    <button className="close-button" onClick={onClose}>
                        <img src="./src/assets/icons/close-icon.svg" alt="close" />
                    </button>
                </div>

                <nav className="menu-links">
                    <Link to="/#video" className="nav-link" id="nav" onClick={onClose}>
                        Home
                        <img src="./src/assets/icons/arrow_right.svg" alt="arrow" />
                    </Link>
                    <Link to="/gallery" className="nav-link" id="nav" onClick={onClose}>
                        Gallery
                        <img src="./src/assets/icons/arrow_right.svg" alt="arrow" />
                    </Link>
                    <Link to="/#about" className="nav-link" id="nav" onClick={onClose}>
                        About
                        <img src="./src/assets/icons/arrow_right.svg" alt="arrow" />
                    </Link>
                    <Link to="/#faqs" className="nav-link" id="nav" onClick={onClose}>
                        FAQs
                        <img src="./src/assets/icons/arrow_right.svg" alt="arrow" />
                    </Link>
                    <Link to="/account" className="nav-link" id="nav" onClick={onClose}>
                        Account
                        <img src="./src/assets/icons/arrow_right.svg" alt="arrow" />
                    </Link>
                </nav>
            </section>
        </>,
        document.body
    );
}

export default Menu;