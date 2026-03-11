import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Header() {
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isMainPage = location.pathname === "/";
    const isSpecialState = isMainPage && !isScrolled;

    const hideAuthButtons =
        location.pathname === "/signin" ||
        location.pathname === "/signup";

    return (
        <header className={`header ${isSpecialState ? "special-transparent" : "ordinary"}`}>
            <Link to="/" id="logo" style={{ textDecoration: 'none', color: 'inherit', transition: 'opacity 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.6'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
                Éternité
            </Link>

            {!hideAuthButtons && (
                <div className="account-buttons">
                    <Link to="/signin">
                        <button className="sign-in-button" id="button">SIGN IN</button>
                    </Link>

                    <Link to="/signup">
                        <button className="sign-up-button" id="button">SIGN UP</button>
                    </Link>
                </div>
            )}
        </header>
    );
}

export default Header;