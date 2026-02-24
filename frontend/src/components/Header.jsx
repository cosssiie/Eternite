import { Link, useLocation } from "react-router-dom";

function Header() {
    const location = useLocation();

    const hideAuthButtons =
        location.pathname === "/signin" ||
        location.pathname === "/signup";

    return (
        <header className="header">
            <div id="logo">Éternité</div>

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