import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TitleHeader from '../components/TitleHeader.jsx';
import PublicationList from '../components/PublicationList.jsx';
import Pagination from '../components/Pagination.jsx';
import { publicationApi } from '../api/publicationApi';
import { categoryApi } from '../api/categoryApi';


function GalleryPage() {
    const [publications, setPublications] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get('category');
    const pageSize = 12;

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setIsLoading(true);
                const params = {
                    page: currentPage,
                    limit: pageSize
                };
                if (categoryId && categoryId !== 'all') {
                    params.category = categoryId;
                }
                const [pubRes, catRes] = await Promise.all([
                    publicationApi.getAll(params),
                    categoryApi.getTree()
                ]);

                const allFetched = pubRes.data.publications || [];
                const serverTotal = pubRes.data.total || 0;
                setPublications(allFetched);

                setTotalPages(Math.ceil(serverTotal / pageSize));
                setCategories(catRes.data.tree || catRes.data);

            } catch (err) {
                console.error("Error loading gallery:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, [categoryId, currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="gallery-page-container">
            <TitleHeader title="Gallery" />
            <div className="gallery-container">
                <div className="filter-search-container">
                    <div className="search-bar-content">
                        <button className="filter-button">
                            <img
                                src="./src/assets/icons/filter.svg"
                                alt="Filter icon"
                                className="filter-icon-img"
                            />
                        </button>

                        <div className="search-input-wrapper">
                            <input id="button" type="text" placeholder="SEARCH" className="search-input" />
                            <button className="search-submit">
                                <img
                                    src="./src/assets/icons/search.svg"
                                    alt="Search icon"
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
                        <PublicationList publications={publications} />
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