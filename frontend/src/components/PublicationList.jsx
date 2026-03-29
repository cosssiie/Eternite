import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';
import Publication from './Publication';

function PublicationList({ publications }) {
    const { isAuth } = useAuth();
    const [favouriteIds, setFavouriteIds] = useState([]);

    useEffect(() => {
        const fetchFavourites = async () => {
            if (!isAuth) return;
            try {
                const { data } = await userApi.getFavourites();
                const ids = (data.favourites || []).map(f => String(f._id || f));
                setFavouriteIds(ids);
            } catch (err) {
                console.error('Error fetching favourites:', err);
            }
        };
        fetchFavourites();
    }, [isAuth]);

    const handleFavouriteChange = (pubId, isAdding) => {
        setFavouriteIds(prev =>
            isAdding
                ? [...prev, String(pubId)]
                : prev.filter(id => id !== String(pubId))
        );
    };

    if (publications.length === 0) {
        return (
            <div className="no-found-container">
                <p className="no-found-text" id="button">No publications found</p>
            </div>
        );
    }

    const createColumns = (items, columnsCount) => {
        const columns = Array.from({ length: columnsCount }, () => []);
        items.forEach((item, index) => columns[index % columnsCount].push(item));
        return columns;
    };

    const columns = createColumns(publications, 3);

    return (
        <div className="feed-wrapper">
            <div className="masonry-grid">
                {columns.map((col, colIndex) => (
                    <div className="masonry-column" key={colIndex}>
                        {col.map((pub) => (
                            <Publication
                                key={pub._id}
                                _id={pub._id}
                                title={pub.title}
                                images={pub.images}
                                author={pub.author}
                                isFavourite={favouriteIds.includes(String(pub._id))}
                                onFavouriteChange={handleFavouriteChange}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PublicationList;