import React, { useState, useEffect } from "react";
import { useSocket } from '../context/SocketContext';
import ReactDOM from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { categoriesService } from "../api/categories";
import { useAuth } from "../context/AuthContext";

function Menu({ isOpen, onClose }) {
    const socket = useSocket();

    const navigate = useNavigate();
    const { user } = useAuth();

    const [view, setView] = useState("main");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const fetchCats = async () => {
                try {
                    const data = await categoriesService.getTree();
                    setCategories(data || []);
                } catch (err) {
                    console.error("Error loading categories in menu:", err);
                    if (err.response) console.error("Server Response Error:", err.response.data);
                }
            };
            fetchCats();
        } else {
            document.body.style.overflow = 'unset';
            setTimeout(() => setView("main"), 300);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!socket) return;

        const handleCategoriesUpdated = async () => {
            try {
                const data = await categoriesService.getTree();
                setCategories(data || []);
                console.log('Categories updated via socket');
            } catch (err) {
                console.error('Error reloading categories:', err);
            }
        };

        socket.on('categories:updated', handleCategoriesUpdated);
        console.log('Socket subscribed to categories:updated');

        return () => {
            socket.off('categories:updated', handleCategoriesUpdated);
        };
    }, [socket]);

    const handleCategoryClick = (id) => {
        navigate(`/gallery?category=${id}`);
        onClose();
    };

    return ReactDOM.createPortal(
        <>
            <div className={`menu-overlay ${isOpen ? "active" : ""}`} onClick={onClose} />
            <section className={`menu-container ${isOpen ? "open" : ""}`}>
                <div className="menu-header">
                    {view !== "main" && (
                        <button className="back-button" onClick={() => setView(view === "subcategories" ? "categories" : "main")}>
                            <img src="/src/assets/icons/arrow_left.svg" alt="back" />
                        </button>
                    )}
                    <button className="close-button" onClick={onClose}>
                        <img src="/src/assets/icons/close-icon.svg" alt="close" />
                    </button>
                </div>

                <nav className="menu-links">
                    {view === "main" && (
                        <>
                            <Link to="/#video" className="nav-link" id="nav" onClick={onClose}>
                                Home
                                <img src="/src/assets/icons/arrow_right.svg" alt="arrow" />
                            </Link>
                            <div className="nav-link" id="nav" onClick={() => setView("categories")}>
                                Gallery
                                <img src="/src/assets/icons/arrow_right.svg" alt="arrow" />
                            </div>
                            <Link to="/#about" className="nav-link" id="nav" onClick={onClose}>
                                About
                                <img src="/src/assets/icons/arrow_right.svg" alt="arrow" />
                            </Link>
                            <Link to="/#faqs" className="nav-link" id="nav" onClick={onClose}>
                                FAQs
                                <img src="/src/assets/icons/arrow_right.svg" alt="arrow" />
                            </Link>
                            <Link to="/account" className="nav-link" id="nav" onClick={onClose}>
                                Account
                                <img src="/src/assets/icons/arrow_right.svg" alt="arrow" />
                            </Link>
                            {user?.role === 'admin' && (
                                <Link to="/admin-panel" className="nav-link admin-link" id="nav" onClick={onClose}>
                                    Admin
                                    <img src="/src/assets/icons/arrow_right.svg" alt="arrow" />
                                </Link>
                            )}
                        </>
                    )}

                    {view === "categories" && (
                        <>
                            <div className="nav-link category-all" onClick={() => handleCategoryClick('all')}>
                                <strong id="nav">All Gallery</strong>
                            </div>
                            {categories.map(cat => {
                                const catId = cat.id || cat._id;
                                return (
                                    <div key={catId} className="nav-link" id="nav" onClick={() => {
                                        setSelectedCategory(cat);
                                        if (cat.children && cat.children.length > 0) {
                                            setView("subcategories");
                                        } else {
                                            handleCategoryClick(catId);
                                        }
                                    }}>
                                        {cat.name}
                                        {cat.children?.length > 0 && <img src="/src/assets/icons/arrow_right.svg" alt="arrow" />}
                                    </div>
                                );
                            })}
                        </>
                    )}

                    {view === "subcategories" && selectedCategory && (
                        <>
                            <div className="nav-link category-parent-all"
                                onClick={() => handleCategoryClick(selectedCategory.id || selectedCategory._id)}>
                                <strong id="nav">All {selectedCategory.name}</strong>
                            </div>
                            {selectedCategory.children.map(sub => {
                                const subId = sub.id || sub._id;
                                return (
                                    <div key={subId} className="nav-link" id="nav"
                                        onClick={() => handleCategoryClick(subId)}>
                                        {sub.name}
                                        <img src="/src/assets/icons/arrow_right.svg" alt="arrow" />
                                    </div>
                                );
                            })}
                        </>
                    )}
                </nav>
            </section >
        </>,
        document.body
    );
}

export default Menu;