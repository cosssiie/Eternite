import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TitleHeader from '../components/TitleHeader.jsx';
import PublicationList from '../components/PublicationList.jsx';
import { publicationApi } from '../api/PublicationApi';
import { categoryApi } from '../api/categoryApi';

function GalleryPage() {
    const [publications, setPublications] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get('category');

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setIsLoading(true);
                const params = {};
                if (categoryId && categoryId !== 'all') {
                    params.category = categoryId;
                }
                const [pubRes, catRes] = await Promise.all([
                    publicationApi.getAll(params),
                    categoryApi.getTree()
                ]);

                setPublications(pubRes.data.publications || pubRes.data);
                setCategories(catRes.data.tree || catRes.data);

            } catch (err) {
                console.error("Error loading gallery:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, [categoryId]);


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
                    <PublicationList publications={publications} />
                )}
            </div>
        </div>
    );
}

export default GalleryPage;