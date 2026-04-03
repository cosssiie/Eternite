import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import TitleHeader from '../components/TitleHeader.jsx';
import PublicationList from '../components/PublicationList.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import Pagination from '../components/Pagination.jsx';
import { useGalleryFilters } from '../hooks/useGalleryFilters';

function GalleryPage() {
    const socket = useSocket();
    const [filterOpen, setFilterOpen] = useState(false);

    const {
        pubs,
        template,
        isLoading,
        currentPage,
        totalPages,
        searchQuery,
        activeAttrs,
        setSearch,
        setPage,
        setAttr,
        clearAttrs,
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

    const hasActiveFilters = Object.keys(activeAttrs).length > 0;

    console.log('template:', template);

    return (
        <div className="gallery-page-container">
            <TitleHeader title="Gallery" />
            <div className="gallery-container">
                <div className="filter-search-container">
                    <div className="search-bar-content">

                        {template.length > 0 && (
                            <div className="filter-wrapper">
                                <button
                                    type="button"
                                    className={`filter-button ${hasActiveFilters ? 'filter-button--active' : ''}`}
                                    onClick={() => setFilterOpen(true)}
                                >
                                    <img
                                        src="./src/assets/icons/filter.svg"
                                        alt="Filter"
                                        className="filter-icon-img"
                                    />
                                    {hasActiveFilters && (
                                        <span className="filter-badge">
                                            {Object.keys(activeAttrs).length}
                                        </span>
                                    )}
                                </button>
                            </div>
                        )}

                        <div className="search-input-wrapper">
                            <input
                                id="button"
                                type="text"
                                placeholder="SEARCH"
                                className="search-input"
                                value={inputValue}
                                onChange={handleSearchChange}
                            />
                            <button type="button" className="search-submit">
                                <img
                                    src="./src/assets/icons/search.svg"
                                    alt="Search"
                                    className="search-icon-img"
                                />
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

            <FilterPanel
                isOpen={filterOpen}
                onClose={() => setFilterOpen(false)}
                template={template}
                activeAttrs={activeAttrs}
                setAttr={setAttr}
                clearAttrs={clearAttrs}
            />
        </div>
    );
}

export default GalleryPage;