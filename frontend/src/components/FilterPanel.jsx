import { useEffect } from 'react';
import ReactDOM from 'react-dom';

function FilterPanel({ isOpen, onClose, template, activeAttrs, setAttr, clearAttrs }) {
    const hasActiveFilters = Object.keys(activeAttrs).length > 0;

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return ReactDOM.createPortal(
        <>
            <div
                className={`menu-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            />
            <section className={`menu-container ${isOpen ? 'open' : ''}`}>
                <div className="menu-header">
                    <span id="button">FILTER</span>
                    <button type="button" className="close-button" onClick={onClose}>
                        <img src="/src/assets/icons/close-icon.svg" alt="close" />
                    </button>
                </div>

                <div className="menu-links">
                    {template.length === 0 && (
                        <p className="filter-empty" id="button">
                            Select a subcategory to see filters
                        </p>
                    )}

                    {template.map(field => (
                        <div key={field.key} className="filter-panel-row">
                            <span className="filter-panel-label" id="button">
                                {field.label.toUpperCase()}
                            </span>

                            {field.key === 'year' ? (
                                <div className="filter-year-row">
                                    <input
                                        type="number"
                                        placeholder="FROM"
                                        className="attr-filter-input"
                                        id="button"
                                        defaultValue={activeAttrs.yearFrom || ''}
                                        onBlur={e => setAttr('yearFrom', e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') setAttr('yearFrom', e.target.value); }}
                                    />
                                    <span style={{ color: 'var(--grey-color)' }}>—</span>
                                    <input
                                        type="number"
                                        placeholder="TO"
                                        className="attr-filter-input"
                                        id="button"
                                        defaultValue={activeAttrs.yearTo || ''}
                                        onBlur={e => setAttr('yearTo', e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') setAttr('yearTo', e.target.value); }}
                                    />
                                </div>
                            ) : (
                                <select
                                    className="attr-filter-select"
                                    id="button"
                                    defaultValue={activeAttrs[field.key] || ''}
                                    onChange={e => setAttr(field.key, e.target.value)}
                                >
                                    <option value="">ALL</option>
                                    {field.options?.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    ))}

                    {hasActiveFilters && (
                        <div className="filter-panel-row">
                            <button
                                type="button"
                                className="attr-filter-clear"
                                id="nav"
                                onClick={() => { clearAttrs(); onClose(); }}
                            >
                                CLEAR ALL FILTERS
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </>,
        document.body
    );
}

export default FilterPanel;