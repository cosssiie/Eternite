import { createContext, useContext, useState, useEffect } from 'react';
import { userApi } from '../api/userApi';
import { useAuth } from './AuthContext';

const FavouritesContext = createContext();

export function FavouritesProvider({ children }) {
    const { isAuth } = useAuth();
    const [favouriteIds, setFavouriteIds] = useState([]);

    const fetchFavourites = async () => {
        if (!isAuth) { setFavouriteIds([]); return; }
        try {
            const { data } = await userApi.getFavourites();
            const ids = (data.favourites || []).map(f => String(f._id || f));
            setFavouriteIds(ids);
        } catch (err) {
            console.error('Error fetching favourites:', err);
        }
    };

    useEffect(() => { fetchFavourites(); }, [isAuth]);

    const toggleFavourite = async (pubId) => {
        const id = String(pubId);
        const isAdding = !favouriteIds.includes(id);

        // оптимистичное обновление — сразу меняем UI
        setFavouriteIds(prev =>
            isAdding ? [...prev, id] : prev.filter(f => f !== id)
        );

        try {
            await userApi.toggleFavourite(pubId);
        } catch (err) {
            setFavouriteIds(prev =>
                isAdding ? prev.filter(f => f !== id) : [...prev, id]
            );
        }
    };

    return (
        <FavouritesContext.Provider value={{ favouriteIds, toggleFavourite, fetchFavourites }}>
            {children}
        </FavouritesContext.Provider>
    );
}

export const useFavourites = () => useContext(FavouritesContext);