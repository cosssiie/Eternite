import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { publicationApi } from "../api/publicationApi";
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';

function PublicationPage() {
    const { id } = useParams();
    const { isAuth } = useAuth();
    const navigate = useNavigate();

    const [publication, setPublication] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const [isFavourite, setIsFavourite] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        const fetchPublication = async () => {
            try {
                const { data } = await publicationApi.getById(id);
                setPublication(data.publication || data);
            } catch (err) {
                console.error("Ошибка при загрузке публикации", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPublication();
    }, [id]);

    useEffect(() => {
        const fetchFavourites = async () => {
            if (!isAuth) return;
            try {
                const { data } = await userApi.getFavourites();
                const favourites = data.favourites || [];
                const found = favourites.some(fav => String(fav._id || fav) === String(id));
                setIsFavourite(found);
            } catch (err) {
                console.error("Ошибка при получении избранного", err);
            }
        };
        fetchFavourites();
    }, [id, isAuth]);

    const toggleFavourite = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuth) {
            setToastMessage('Please sign in to add to favourites');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2500);
            return;
        }

        const adding = !isFavourite;

        try {
            setIsFavourite(adding);
            await userApi.toggleFavourite(id);

            setToastMessage(adding ? 'Added to favourites' : 'Removed from favourites');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2500);
        } catch (err) {
            setIsFavourite(!adding); // откат если ошибка
            console.error("Error updating favourites:", err);
        }
    };

    if (loading) {
        return (
            <div className="full-screen-container">
                <div className="custom-loader"></div>
                <p className="loading-text" id="button">Loading Éternité...</p>
            </div>
        );
    }

    if (!publication) {
        return (
            <div className="full-screen-container">
                <h3 className="error-message">Publication not found</h3>
                <p>It might have been removed or the link is incorrect.</p>
                <button className="action-main-button" onClick={() => navigate('/gallery')}>
                    Back to Gallery
                </button>
            </div>
        );
    }

    const { title, images, author, description, category, createdAt, attributes } = publication;
    const authorName = author?.name || (typeof author === 'string' ? author : 'Unknown');
    const categoryName = category?.name || (typeof category === 'string' ? category : null);

    const nextImage = () => setCurrentImageIndex((p) => (p + 1) % images.length);
    const prevImage = () => setCurrentImageIndex((p) => (p - 1 + images.length) % images.length);

    return (
        <div className="publication-page-container">
            <div className="publication-image-section">
                <div className="image-slider">
                    {images?.length > 1 && (
                        <button type="button" className="slider-arrow prev" onClick={prevImage}>
                            <img src="/src/assets/icons/imple-arrow-left.svg" alt="prev" />
                        </button>
                    )}

                    <img
                        src={images?.[currentImageIndex]?.startsWith('http')
                            ? images[currentImageIndex]
                            : `http://localhost:5000${images?.[currentImageIndex]}`}
                        alt={title}
                        className="main-detail-image"
                    />

                    {images?.length > 1 && (
                        <button type="button" className="slider-arrow next" onClick={nextImage}>
                            <img src="/src/assets/icons/imple-arrow-right.svg" alt="next" />
                        </button>
                    )}
                </div>

                {images?.length > 1 && (
                    <div className="slider-dots">
                        {images.map((_, idx) => (
                            <span
                                key={idx}
                                className={`dot ${idx === currentImageIndex ? 'active' : ''}`}
                                onClick={() => setCurrentImageIndex(idx)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="publication-info-sidebar">
                <div className="sticky-info">
                    <h2 className="detail-title">{title}</h2>
                    <p className="detail-author" id="button">@{authorName}</p>

                    <div className="detail-meta">
                        {categoryName && <span className="category-tag">{categoryName}</span>}

                        <span className="date-tag">
                            {createdAt
                                ? new Date(createdAt).toLocaleDateString('en-GB', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                                : 'Date unknown'}
                        </span>

                        <button
                            type="button"
                            className={`favourite-btn-inline ${isFavourite ? 'favourite-btn--active' : ''}`}
                            onClick={toggleFavourite}
                        >
                            <img
                                src={isFavourite
                                    ? '/src/assets/icons/favorites.svg'
                                    : '/src/assets/icons/favorites-none.svg'}
                                alt="favourite"
                            />
                        </button>
                    </div>

                    {description && (
                        <div className="detail-description">
                            <p id="text">{description}</p>
                        </div>
                    )}

                    {attributes?.length > 0 && (
                        <div className="detail-attributes">
                            {attributes.map((attr, index) => (
                                <div key={attr.key || index} className="attribute-row">
                                    <span className="attribute-label">{attr.label}</span>
                                    <span className="attribute-value">{attr.value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div
                className={`favourite-toast ${showToast ? 'toast-visible' : ''} ${!isFavourite && showToast ? 'toast-remove' : ''}`}
                id="button"
            >
                {toastMessage}
            </div>
        </div>
    );
}

export default PublicationPage;