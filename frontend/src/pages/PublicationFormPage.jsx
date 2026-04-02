import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoriesService } from '../api/categories.js';
import { publications } from '../api/publication.js';
import TitleHeader from '../components/TitleHeader.jsx';

function PublicationFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [template, setTemplate] = useState([]);
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(isEditing);
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
                            ...child, groupName: root.name
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
        if (!isEditing) return;
        const loadPublication = async () => {
            try {
                const data = await publications.getById(id);
                setFormData({
                    title: data.title || '',
                    description: data.description || '',
                    content: data.content || '',
                });
                setExistingImages(data.images || []);

                const catId = data.category?._id || data.category?.id || data.category;
                setSelectedCategory(String(catId || ''));

                const attrsObj = {};
                (data.attributes || []).forEach(a => {
                    attrsObj[a.key] = a.value;
                });
                setAttributes(attrsObj);
            } catch (err) {
                console.error("Failed to load publication:", err);
            } finally {
                setLoading(false);
            }
        };
        loadPublication();
    }, [id, isEditing]);

    useEffect(() => {
        if (!selectedCategory) { setTemplate([]); return; }
        const loadTemplate = async () => {
            try {
                const data = await categoriesService.getTemplate(selectedCategory);
                setTemplate(data?.fields || []);
            } catch {
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
        setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };

    const removeNewImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        let clean = path.replace(/\\/g, '/');
        if (!clean.startsWith('/')) clean = '/' + clean;
        return `http://localhost:5000${clean}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCategory) return setMessage({ type: 'error', text: 'Select category' });
        if (existingImages.length === 0 && images.length === 0) {
            return setMessage({ type: 'error', text: 'Add at least one image' });
        }

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

            data.append('existingImages', JSON.stringify(existingImages));

            images.forEach(img => data.append('images', img));

            if (isEditing) {
                await publications.update(id, data);
                navigate(`/publication/${id}`);
            } else {
                await publications.create(data);
                navigate('/account?tab=My archive');
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="full-screen-container">
                <div className="custom-loader"></div>
                <p className="loading-text" id="button">Loading...</p>
            </div>
        );
    }

    return (
        <div className="create-page-container">
            <TitleHeader title={isEditing ? "Edit Publication" : "Create"} />
            <div className="create-container">

                <div className="create-left">
                    <div className="image-upload-area">
                        <label className="image-upload-placeholder">
                            <input type="file" multiple accept="image/*" onChange={handleImages} hidden />
                            <span id="nav">+ ADD IMAGES</span>
                        </label>

                        {existingImages.length > 0 && (
                            <div className="image-previews">
                                {existingImages.map((src, i) => (
                                    <div key={`existing-${i}`} className="preview-item">
                                        <img src={getImageUrl(src)} alt="" />
                                        <button type="button" className="remove-image-btn"
                                            onClick={() => removeExistingImage(i)}>×</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {previews.length > 0 && (
                            <div className="image-previews">
                                {previews.map((src, i) => (
                                    <div key={`new-${i}`} className="preview-item">
                                        <img src={src} alt="" />
                                        <button type="button" className="remove-image-btn"
                                            onClick={() => removeNewImage(i)}>×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <form className="create-form" onSubmit={handleSubmit}>
                    <div className="form-group-settings">
                        <input type="text" name="title" placeholder="TITLE"
                            value={formData.title} onChange={handleChange} required />
                    </div>

                    <div className="form-group-settings">
                        <input type="text" name="description" placeholder="SHORT DESCRIPTION"
                            value={formData.description} onChange={handleChange} required />
                    </div>

                    <div className="form-group-settings">
                        <select value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                            className="create-select" required>
                            <option value="">SELECT CATEGORY</option>
                            {categories.map(cat => (
                                <option key={cat._id || cat.id} value={cat._id || cat.id}>
                                    {cat.groupName
                                        ? `${cat.groupName.toUpperCase()} — ${cat.name.toUpperCase()}`
                                        : cat.name.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    {template.length > 0 && (
                        <div className="template-fields-container">
                            {template.map(field => (
                                <div key={field.key} className="form-group-settings">
                                    {field.type === 'select' ? (
                                        <select value={attributes[field.key] || ''}
                                            onChange={e => handleAttributeChange(field.key, e.target.value)}
                                            className="create-select" required={field.required}>
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
                        <textarea name="content" placeholder="STORY / DESCRIPTION"
                            value={formData.content} onChange={handleChange}
                            className="create-textarea" rows={4} />
                    </div>

                    {message.text && (
                        <p className={`settings-message ${message.type}`} id="text">
                            {message.text}
                        </p>
                    )}

                    <div className="settings-form-actions">
                        <button type="button" className="cancel-button" id="nav"
                            onClick={() => navigate(-1)}>CANCEL</button>
                        <button type="submit" className="submit-button" id="nav" disabled={submitting}>
                            {submitting ? 'SAVING...' : isEditing ? 'SAVE CHANGES' : 'PUBLISH'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PublicationFormPage;