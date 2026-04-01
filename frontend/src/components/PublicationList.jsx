import Publication from './Publication';
import { useFavourites } from '../context/FavouritesContext';

function PublicationList({ publications }) {
    const { favouriteIds, toggleFavourite } = useFavourites();

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
                                onFavouriteChange={(id) => toggleFavourite(id)}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PublicationList;