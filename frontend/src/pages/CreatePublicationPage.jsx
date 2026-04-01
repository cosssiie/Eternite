import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriesService } from '../api/categories'; // Используем наш прокси-сервис
import { publications } from '../api/Publication'; // Используем прокси публикаций
import TitleHeader from '../components/TitleHeader.jsx';

function CreatePublicationPage() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [template, setTemplate] = useState([]);
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
    });
    const [attributes, setAttributes] = useState({});

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const tree = await categoriesService.getTree();
                const flattenedSubs = [];

                tree.forEach(root => {
                    if (root.children?.length > 0) {
                        root.children.forEach(child => flattenedSubs.push({
                            ...child,
                            groupName: root.name
                        }));
                    } else {
                        flattenedSubs.push(root);
                    }
                });
                setCategories(flattenedSubs);
            } catch (err) {
                console.error("Failed to load categories:", err);
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        if (!selectedCategory) {
            setTemplate([]);
            setAttributes({});
            return;
        }

        const loadTemplate = async () => {
            try {
                const data = await categoriesService.getTemplate(selectedCategory);
                const fields = data?.fields || [];
                setTemplate(fields);
                const initialAttrs = {};
                fields.forEach(f => { initialAttrs[f.key] = ''; });
                setAttributes(initialAttrs);
            } catch (err) {
                console.error("Template load error:", err);
                setTemplate([]);
            }
        };
        loadTemplate();
    }, [selectedCategory]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAttributeChange = (key, value) => {
        setAttributes(prev => ({ ...prev, [key]: value }));
    };

    const handleImages = (e) => {
        const files = Array.from(e.target.files);

        setImages(prev => [...prev, ...files]);

        const newPreviews = files.map(f => URL.createObjectURL(f));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCategory) return setMessage({ type: 'error', text: 'Select category' });
        if (images.length === 0) return setMessage({ type: 'error', text: 'Add images' });

        setSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('content', formData.content);
            data.append('category', selectedCategory);

            const attrs = template.map(field => ({
                key: field.key,
                label: field.label,
                value: String(attributes[field.key] || '')
            }));
            data.append('attributes', JSON.stringify(attrs));

            images.forEach(img => data.append('images', img));

            await publications.create(data);
            navigate('/account?tab=My archive');
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="create-page-container">
            <TitleHeader title="Create" />
            <div className="create-container">
                <div className="create-left">
                    <div className="image-upload-area">
                        {/* ОДНА БОЛЬШАЯ КНОПКА ВСЕГДА СВЕРХУ */}
                        <label className="image-upload-placeholder">
                            <input type="file" multiple accept="image/*" onChange={handleImages} hidden />
                            <span id="nav">+ ADD IMAGES</span>
                        </label>

                        {previews.length > 0 && (
                            <div className="image-previews">
                                {previews.map((src, i) => (
                                    <div key={i} className="preview-item">
                                        <img src={src} alt="" />
                                        <button
                                            type="button"
                                            className="remove-image-btn"
                                            onClick={() => removeImage(i)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <form className="create-form" onSubmit={handleSubmit}>
                    <div className="form-group-settings">
                        <input type="text" name="title" placeholder="TITLE" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="form-group-settings">
                        <input
                            type="text"
                            name="description"
                            placeholder="SHORT DESCRIPTION"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group-settings">
                        <select
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                            className="create-select"
                            required
                        >
                            <option value="">SELECT CATEGORY</option>
                            {categories.map(cat => (
                                <option key={cat._id || cat.id} value={cat._id || cat.id}>
                                    {cat.groupName ? `${cat.groupName.toUpperCase()} — ${cat.name.toUpperCase()}` : cat.name.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    {template.length > 0 && (
                        <div className="template-fields-container">
                            {template.map(field => (
                                <div key={field.key} className="form-group-settings">
                                    {field.type === 'select' ? (
                                        <select
                                            value={attributes[field.key] || ''}
                                            onChange={e => handleAttributeChange(field.key, e.target.value)}
                                            className="create-select"
                                            required={field.required}
                                        >
                                            <option value="">{field.label.toUpperCase()}</option>
                                            {field.options?.map(opt => (
                                                <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={field.type === 'number' ? 'number' : 'text'}
                                            placeholder={field.label.toUpperCase()}
                                            value={attributes[field.key] || ''}
                                            onChange={e => handleAttributeChange(field.key, e.target.value)}
                                            required={field.required}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="form-group-settings">
                        <textarea name="content" placeholder="STORY / DESCRIPTION" value={formData.content} onChange={handleChange} className="create-textarea" rows={4} />
                    </div>

                    {message.text && <p className={`settings-message ${message.type}`} id="text">{message.text}</p>}

                    <div className="settings-form-actions">
                        <button type="button" className="cancel-button" id="nav" onClick={() => navigate(-1)}>CANCEL</button>
                        <button type="submit" className="submit-button" id="nav" disabled={submitting}>
                            {submitting ? 'PUBLISHING...' : 'PUBLISH'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePublicationPage;