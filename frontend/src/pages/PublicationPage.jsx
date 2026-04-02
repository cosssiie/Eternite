import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useFavourites } from '../context/FavouritesContext';
import { publications } from '../api/publication';

function PublicationPage() {
    const { id } = useParams();
    const { user, isAuth } = useAuth();
    const navigate = useNavigate();
    const { favouriteIds, toggleFavourite: toggleFavInContext } = useFavourites();

    const [publication, setPublication] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const isFavourite = favouriteIds.includes(String(id));

    useEffect(() => {
        const fetchPublication = async () => {
            if (!id || id === 'undefined') return;
            try {
                setLoading(true);
                const data = await publications.getById(id);
                setPublication(data);
            } catch (err) {
                console.error("Error loading publication", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPublication();
    }, [id]);


    const handleToggleFavourite = async (e) => {
        if (!isAuth) {
            setToastMessage('Please sign in to add to favourites');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2500);
            return;
        }

        try {
            const adding = !isFavourite;
            await toggleFavInContext(id);

            setToastMessage(adding ? 'Added to favourites' : 'Removed from favourites');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2500);
        } catch (err) {
            console.error("Error updating favourites:", err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this publication?")) return;

        try {
            await publications.remove(id);

            setToastMessage('Publication deleted successfully');
            setShowToast(true);
            setTimeout(() => {
                navigate(-1);
            }, 500);
        } catch (err) {
            console.error("Error deleting publication:", err);
            setToastMessage('Failed to delete publication');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 1500);
        }
    };

    const getImageUrl = (path) => {
        if (!path) return '/src/assets/placeholder.jpg';
        if (path.startsWith('http')) return path;
        let cleanPath = path.replace(/\\/g, '/');
        if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
        return `http://localhost:5000${cleanPath}`;
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

    const { title, images = [], author, description, category, content, createdAt, attributes } = publication;
    const authorName = author?.name || (typeof author === 'string' ? author : 'Unknown');
    const categoryName = category?.name || (typeof category === 'string' ? category : null);

    const authorId = author?.id || author?._id?.toString() || String(author || '');
    const userId = user?.id || user?._id?.toString() || '';
    const isOwner = isAuth && !!userId && userId === authorId;

    const nextImage = () => setCurrentImageIndex((p) => (p + 1) % images.length);
    const prevImage = () => setCurrentImageIndex((p) => (p - 1 + images.length) % images.length);

    return (
        <div className="publication-page-container">
            <div className="publication-image-section">
                <div className="image-slider">
                    {images.length > 1 && (
                        <button type="button" className="slider-arrow prev" onClick={prevImage}>
                            <img src="/src/assets/icons/imple-arrow-left.svg" alt="prev" />
                        </button>
                    )}

                    <img
                        src={getImageUrl(images[currentImageIndex])}
                        alt={title}
                        className="main-detail-image"
                    />

                    {images.length > 1 && (
                        <button type="button" className="slider-arrow next" onClick={nextImage}>
                            <img src="/src/assets/icons/imple-arrow-right.svg" alt="next" />
                        </button>
                    )}
                </div>

                {images.length > 1 && (
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
                        <div className="detail-info">
                            {categoryName && <span className="category-tag">{categoryName}</span>}
                            <span className="date-tag">
                                {createdAt && !isNaN(Number(createdAt))
                                    ? new Date(Number(createdAt)).toLocaleDateString('en-GB', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })
                                    : createdAt ? new Date(createdAt).toLocaleDateString('en-GB', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : 'Date unknown'
                                }
                            </span>
                        </div>

                        <div className="edit-publication-section">
                            <button
                                type="button"
                                className={`favourite-btn-inline ${isFavourite ? 'favourite-btn--active' : ''}`}
                                onClick={handleToggleFavourite}
                            >
                                <img
                                    src={isFavourite
                                        ? '/src/assets/icons/favorites.svg'
                                        : '/src/assets/icons/favorites-none.svg'}
                                    alt="favourite"
                                />
                            </button>
                            {isOwner && (
                                <>
                                    <button type="button" className="edit-btn-inline"
                                        onClick={() => navigate(`/publication/edit/${id}`)}>
                                        <img src="/src/assets/icons/edit.svg" alt="edit" />
                                    </button>
                                    <button type="button" className="delete-btn-inline" onClick={handleDelete}>
                                        <img src="/src/assets/icons/delete.svg" alt="delete" />
                                    </button>
                                </>
                            )}
                        </div>
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

                    {content && (
                        <div className="detail-description">
                            <p id="text">{content}</p>
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