import TitleHeader from '../components/TitleHeader.jsx';
import Publication from '../components/Publication.jsx';

const mockPublications = [
    { _id: '1', image: 'https://picsum.photos/seed/1/400/500', author: 'john_doe' },
    { _id: '2', image: 'https://picsum.photos/seed/2/400/300', author: 'jane_smith' },
    { _id: '3', image: 'https://picsum.photos/seed/3/400/600', author: 'art_collector' },
    { _id: '4', image: 'https://picsum.photos/seed/4/400/400', author: 'byzantium' },
    { _id: '5', image: 'https://picsum.photos/seed/5/400/550', author: 'antique_hub' },
    { _id: '6', image: 'https://picsum.photos/seed/6/400/350', author: 'numismat' },
    { _id: '7', image: 'https://picsum.photos/seed/7/400/480', author: 'ming_archive' },
    { _id: '8', image: 'https://picsum.photos/seed/8/400/320', author: 'bronze_age' },
];

function GalleryPage() {
    return (
        <div className="gallery-page-container">
            <TitleHeader title="Gallery" />
            <div className="gallery-container">
                <div className="masonry-grid">
                    {mockPublications.map(pub => (
                        <Publication
                            key={pub._id}
                            title={pub.title}
                            category={pub.category}
                            year={pub.year}
                            image={pub.image}
                            author={pub.author}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GalleryPage;