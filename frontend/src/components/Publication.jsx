import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';

function Publication({ _id, title, images = [], author, isFavourite: initialFavourite = false, onFavouriteChange }) {
    const navigate = useNavigate();
    const { isAuth } = useAuth();

    const [isFavourite, setIsFavourite] = useState(initialFavourite);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // синхронизируем с пропом когда приходят данные с сервера
    useEffect(() => {
        setIsFavourite(initialFavourite);
    }, [initialFavourite]);

    const handleCardClick = () => navigate(`/publication/${_id}`);

    const toggleFavourite = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuth) {
            setToastMessage('Please sign in first');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2500);
            return;
        }

        const adding = !isFavourite;

        try {
            setIsFavourite(adding); // мгновенно
            onFavouriteChange?.(_id, adding); // обновляем список в родителе
            await userApi.toggleFavourite(_id);

            setToastMessage(adding ? 'Added to favourites' : 'Removed from favourites');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2500);
        } catch (err) {
            setIsFavourite(!adding); // откат
            onFavouriteChange?.(_id, !adding);
            console.error("Error toggling favourite:", err);
        }
    };

    return (
        <>
            <div className="publication-card" onClick={handleCardClick}>
                <div className="publication-image-wrapper">
                    <img
                        src={images[0]?.startsWith('http') ? images[0] : `http://localhost:5000${images[0]}`}
                        alt={title}
                        className="publication-image"
                    />
                    <div className="publication-overlay">
                        <button
                            type="button"
                            className={`favourite-btn ${isFavourite ? 'favourite-btn--active' : ''}`}
                            onClick={toggleFavourite}
                        >
                            <img
                                src={isFavourite
                                    ? '/src/assets/icons/favorites.svg'
                                    : '/src/assets/icons/favorites-none.svg'
                                }
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