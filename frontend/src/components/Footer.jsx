import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Footer() {
    return (
        <footer className="footer-container">
            <div className="footer-logo-section">
                <img src="./src/assets/icons/logo.svg" alt="Logo" />
            </div>

            <div className="footer-nav-row">
                <div className="footer-col">
                    <p className="footer-col-title" id="nav">Navigate</p>
                    <Link to="/">
                        <a className="footer-link" id="button">Home</a>
                    </Link>
                    <Link to="/gallery">
                        <a className="footer-link" id="button">Gallery</a>
                    </Link>
                    <Link to="/account">
                        <a className="footer-link" id="button">Account</a>
                    </Link>
                </div>

                <div className="footer-col">
                    <p className="footer-col-title" id="nav">Company</p>
                    <Link to="/about">
                        <a className="footer-link" id="button">About</a>
                    </Link>
                    <Link to="/faqs">
                        <a className="footer-link" id="button">FAQs</a>
                    </Link>
                </div>

                <div className="footer-col">
                    <p className="footer-col-title" id="nav">Contacts</p>

                </div>

                <div className="footer-socialmedia">
                    <img src="./src/assets/icons/youtube-icon.svg" alt="youtube" />
                    <img src="./src/assets/icons/pinterest-icon.svg" alt="pinterest" />
                    <img src="./src/assets/icons/instagram-icon.svg" alt="instagram" />

                </div>
            </div>

            <div className="footer-bottom">
                <span className="footer-copyright" id="text-smallest">© Éternité 2026. All rights reserved.</span>
            </div>
        </footer>

    );
}

export default Footer;