import { useState } from 'react';

function Publication({ title, images = [], author }) {
    const [isFavourite, setIsFavourite] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    
    const toggleFavourite = (e) => {
        e.stopPropagation();
        const adding = !isFavourite;
        setIsFavourite(adding);
        setToastMessage(adding ? 'Added to favourites' : 'Removed from favourites');
        setShowToast(false);
        setTimeout(() => setShowToast(true), 10);
        setTimeout(() => setShowToast(false), 2500);
    };

    return (
        <>
            <div className="publication-card">
                <div className="publication-image-wrapper">
                    <img
                        src={images[0]}
                        alt={title}
                        className="publication-image"
                    />

                    <div className="publication-overlay">
                        <button
                            className={`favourite-btn ${isFavourite ? 'favourite-btn--active' : ''}`}
                            onClick={toggleFavourite}
                        >
                            <img
                                src={isFavourite
                                    ? './src/assets/icons/favorites.svg'
                                    : './src/assets/icons/favorites-none.svg'
                                }
                                alt="favourite"
                            />
                        </button>

                        {author && (
                            <span className="publication-author" id="button">
                                @{typeof author === 'object' ? author.name : author}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className={`favourite-toast ${showToast ? 'toast-visible' : ''} ${!isFavourite && showToast ? 'toast-remove' : ''}`} id="button">
                {toastMessage}
            </div>
        </>
    );
}

export default Publication;