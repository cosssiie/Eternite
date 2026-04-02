import { useState, useEffect, } from 'react';
import { useSocket } from '../context/SocketContext';
import TitleHeader from '../components/TitleHeader.jsx';
import PublicationList from '../components/PublicationList.jsx';
import Pagination from '../components/Pagination.jsx';
import { useGalleryFilters } from '../hooks/useGalleryFilters';

function GalleryPage() {
    const socket = useSocket();

    const {
        pubs,
        categories,
        isLoading,
        currentPage,
        totalPages,
        categoryId,
        searchQuery,
        setSearch,
        setPage,
        reload,
    } = useGalleryFilters(12);

    const [inputValue, setInputValue] = useState(searchQuery);

    useEffect(() => {
        if (!socket) return;
        socket.on('publication:approved', reload);
        return () => socket.off('publication:approved', reload);
    }, [socket, reload]);


    useEffect(() => {
        setInputValue(searchQuery);
    }, [searchQuery]);


    const handleSearchChange = (e) => {
        setInputValue(e.target.value);
        setSearch(e.target.value);
    };


    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="gallery-page-container">
            <TitleHeader title="Gallery" />
            <div className="gallery-container">
                <div className="filter-search-container">
                    <div className="search-bar-content">
                        <button className="filter-button">
                            <img src="./src/assets/icons/filter.svg" alt="Filter icon" className="filter-icon-img" />
                        </button>
                        <div className="search-input-wrapper">
                            <input
                                id="button"
                                type="text"
                                placeholder="SEARCH"
                                className="search-input"
                                value={inputValue}
                                onChange={handleSearchChange}
                            />
                            <button className="search-submit">
                                <img src="./src/assets/icons/search.svg" alt="Search" className="search-icon-img" />
                            </button>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="main-loader" id="button">Loading collection...</div>
                ) : (
                    <>
                        <PublicationList publications={pubs} />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default GalleryPage;