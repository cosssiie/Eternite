import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { publications } from '../api/Publication';
import { categoriesService } from '../api/categories';

export function useGalleryFilters(pageSize = 12) {
    const [searchParams, setSearchParams] = useSearchParams();
    const debounceRef = useRef(null);

    const categoryId = searchParams.get('category') || 'all';
    const searchQuery = searchParams.get('search') || '';
    const currentPage = parseInt(searchParams.get('page') || '1');
    const attrsParam = searchParams.get('attrs') || '{}';
    const activeAttrs = (() => { try { return JSON.parse(attrsParam); } catch { return {}; } })();

    const [pubs, setPubs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [template, setTemplate] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!categoryId || categoryId === 'all') {
            setTemplate([]);
            return;
        }
        const loadTemplate = async () => {
            try {
                const data = await categoriesService.getTemplate(categoryId);
                const filterable = (data?.fields || []).filter(f =>
                    f.type === 'select' || f.key === 'year'
                );
                setTemplate(filterable);
            } catch {
                setTemplate([]);
            }
        };
        loadTemplate();
    }, [categoryId]);

    const setCategory = (id) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set('category', id);
            next.set('page', '1');
            next.delete('attrs');
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
        }, 500);
    };

    const setAttr = (key, value) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            const current = (() => { try { return JSON.parse(prev.get('attrs') || '{}'); } catch { return {}; } })();
            if (value) {
                current[key] = value;
            } else {
                delete current[key];
            }
            next.set('attrs', JSON.stringify(current));
            next.set('page', '1');
            return next;
        });
    };

    const clearAttrs = () => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.delete('attrs');
            next.set('page', '1');
            return next;
        });
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
            if (Object.keys(activeAttrs).length > 0) params.attrs = attrsParam;

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
    }, [categoryId, searchQuery, currentPage, pageSize, attrsParam]);

    useEffect(() => { load(); }, [load]);

    return {
        pubs, categories, template, isLoading,
        currentPage, totalPages, categoryId, searchQuery, activeAttrs,
        setCategory, setSearch, setAttr, clearAttrs, setPage, reload: load,
    };
}