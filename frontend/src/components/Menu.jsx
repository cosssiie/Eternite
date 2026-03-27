import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { categoryApi } from "../api/categoryApi";

function Menu({ isOpen, onClose }) {
    const navigate = useNavigate();
    const [view, setView] = useState("main"); // "main", "categories", "subcategories"
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);


    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const fetchCats = async () => {
                try {
                    const res = await categoryApi.getTree();
                    setCategories(res.data.tree || res.data);
                } catch (err) {
                    console.error("Ошибка загрузки категорий в меню", err);
                }
            };
            fetchCats();
        } else {
            document.body.style.overflow = 'unset';
            setTimeout(() => setView("main"), 300);
        }
    }, [isOpen]);

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
                            <img src="./src/assets/icons/arrow_left.svg" alt="back" />
                        </button>
                    )}
                    <button className="close-button" onClick={onClose}>
                        <img src="./src/assets/icons/close-icon.svg" alt="close" />
                    </button>
                </div>

                <nav className="menu-links">
                    {view === "main" && (
                        <>
                            <Link to="/#video" className="nav-link" id="nav" onClick={onClose}>
                                Home
                                <img src="./src/assets/icons/arrow_right.svg" alt="arrow" />
                            </Link>
                            <div className="nav-link" id="nav" onClick={() => setView("categories")}>
                                Gallery
                                <img src="./src/assets/icons/arrow_right.svg" alt="arrow" />
                            </div>
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
                            </Link></>
                    )}

                    {view === "categories" && (
                        <>
                            <div className="nav-link category-all" onClick={() => handleCategoryClick('all')}>
                                <strong id="nav">All Gallery</strong>
                            </div>
                            {categories.map(cat => (
                                <div key={cat._id} className="nav-link" id="nav" onClick={() => {
                                    setSelectedCategory(cat);
                                    if (cat.children && cat.children.length > 0) {
                                        setView("subcategories");
                                    } else {
                                        handleCategoryClick(cat._id);
                                    }
                                }}>
                                    {cat.name}
                                    {cat.children?.length > 0 && <img src="./src/assets/icons/arrow_right.svg" alt="arrow" />}
                                </div>
                            ))}
                        </>
                    )}

                    {view === "subcategories" && selectedCategory && (
                        <>
                            <div className="nav-link category-parent-all" onClick={() => handleCategoryClick(selectedCategory._id)}>
                                <strong id="nav">All {selectedCategory.name}</strong>
                            </div>
                            {selectedCategory.children.map(sub => (
                                <div key={sub._id} className="nav-link" id="nav" onClick={() => handleCategoryClick(sub._id)}>
                                    {sub.name}
                                    {<img src="./src/assets/icons/arrow_right.svg" alt="arrow" />}

                                </div>
                            ))}
                        </>
                    )}

                </nav>
            </section >
        </>,
        document.body
    );
}

export default Menu;