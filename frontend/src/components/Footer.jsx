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
                    <p className="footer-col-title">Navigate</p>
                    <Link to="/" className="footer-link" id="button">
                        Home
                    </Link>
                    <Link to="/gallery" className="footer-link" id="button">
                        Gallery
                    </Link>
                    <Link to="/account" className="footer-link" id="button">
                        Account
                    </Link>
                </div>
                <div className="footer-col">
                    <p className="footer-col-title">Company</p>
                    <Link to="/about" className="footer-link" id="button">
                        About
                    </Link>
                    <Link to="/faqs" className="footer-link" id="button">
                        FAQs
                    </Link>
                </div>
                <div className="footer-col">
                    <p className="footer-col-title">Contacts</p>
                    <div className="footer-contact-items">
                        <a href="mailto:hello@eternite.com" className="footer-link" id="button">
                            hello@eternite.com
                        </a>
                        <a href="tel:+380000000000" className="footer-link" id="button">
                            +38 (000) 000-00-00
                        </a>
                    </div>
                </div>

                <div className="footer-socialmedia">
                    <button>
                        <img src="./src/assets/icons/youtube-icon.svg" alt="youtube" />
                    </button>
                    <button>
                        <img src="./src/assets/icons/pinterest-icon.svg" alt="pinterest" />
                    </button>
                    <button>
                        <img src="./src/assets/icons/instagram-icon.svg" alt="instagram" />
                    </button>
                </div>
            </div>

            <div className="footer-bottom">
                <span className="footer-copyright" id="text-smallest">© Éternité 2026. All rights reserved.</span>
            </div>
        </footer>

    );
}

export default Footer;