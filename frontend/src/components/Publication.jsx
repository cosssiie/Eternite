import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavourites } from '../context/FavouritesContext';

function Publication({ _id, title, images = [], author }) {
    const navigate = useNavigate();
    const { isAuth } = useAuth();
    const { favouriteIds, toggleFavourite } = useFavourites();

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const isFavourite = favouriteIds.includes(String(_id));

    const handleCardClick = () => navigate(`/publication/${_id}`);

    const handleToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuth) {
            setToastMessage('Please sign in first');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2500);
            return;
        }

        const adding = !isFavourite;
        await toggleFavourite(_id);

        setToastMessage(adding ? 'Added to favourites' : 'Removed from favourites');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
    };

    const getImageUrl = (path) => {
        if (!path) return '/src/assets/placeholder.jpg';
        if (path.startsWith('http')) return path;
        let cleanPath = path.replace(/\\/g, '/');
        if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
        return `http://localhost:5000${cleanPath}`;
    };

    return (
        <>
            <div className="publication-card" onClick={handleCardClick}>
                <div className="publication-image-wrapper">
                    <img src={getImageUrl(images[0])} alt={title} className="publication-image" />
                    <div className="publication-overlay">
                        <button
                            type="button"
                            className={`favourite-btn ${isFavourite ? 'favourite-btn--active' : ''}`}
                            onClick={handleToggle}
                        >
                            <img
                                src={isFavourite
                                    ? '/src/assets/icons/favorites.svg'
                                    : '/src/assets/icons/favorites-none.svg'}
                                alt="favourite"
                            />
                        </button>
                        {author && (
                            <span className="publication-author" id="button">
                                @{author?.name || author}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className={`favourite-toast ${showToast ? 'toast-visible' : ''}`} id="button">
                {toastMessage}
            </div>
        </>
    );
}

export default Publication;