import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { publications } from '../api/Publication';
import { categoriesService } from '../api/categories';

export function useGalleryFilters(pageSize = 12) {
    const [searchParams, setSearchParams] = useSearchParams();

    const categoryId = searchParams.get('category') || 'all';
    const searchQuery = searchParams.get('search') || '';
    const currentPage = parseInt(searchParams.get('page') || '1');

    const [pubs, setPubs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const debounceRef = useRef(null);


    const setCategory = (id) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set('category', id);
            next.set('page', '1');
            return next;
        });
    };

    const setSearch = (query) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setSearchParams(prev => {
                const next = new URLSearchParams(prev);
                next.set('search', query);
                next.set('page', '1');
                return next;
            });
        }, 1000)
    };

    const setPage = (page) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set('page', String(page));
            return next;
        });
    };

    const load = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = { page: currentPage, limit: pageSize };
            if (categoryId && categoryId !== 'all') params.categoryId = categoryId;
            if (searchQuery) params.search = searchQuery;

            const [pubData, catData] = await Promise.all([
                publications.getAll(params),
                categoriesService.getTree(),
            ]);

            if (Array.isArray(pubData)) {
                setPubs(pubData);
                setTotalPages(1);
            } else {
                setPubs(pubData.items || []);
                setTotalPages(Math.ceil((pubData.total || 0) / pageSize));
            }

            setCategories(catData);
        } catch (err) {
            console.error('Error loading gallery:', err);
        } finally {
            setIsLoading(false);
        }
    }, [categoryId, searchQuery, currentPage, pageSize]);

    useEffect(() => {
        load();
    }, [load]);

    return {
        pubs,
        categories,
        isLoading,
        currentPage,
        totalPages,
        categoryId,
        searchQuery,
        setCategory,
        setSearch,
        setPage,
        reload: load,
    };
}