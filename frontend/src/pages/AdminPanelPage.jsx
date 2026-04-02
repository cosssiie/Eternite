import React, { useState, useEffect } from "react";
import TitleHeader from "../components/TitleHeader";
import { publications } from "../api/Publication";
import { categoriesService } from "../api/categories";

function AdminPanelPage() {
    const [activeTab, setActiveTab] = useState("publications");
    const tabs = ["publications", "categories"];

    return (
        <div className="admin-page-container">
            <TitleHeader title="Admin" />
            <div className="admin-container">
                <div className="admin-info">
                    <nav className="account-nav">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                className="acc-nav-link"
                                id={activeTab === tab ? "nav-selected" : "nav"}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="admin-content">
                    {activeTab === "publications" && <AdminPublications />}
                    {activeTab === "categories" && <AdminCategories />}
                </div>
            </div>
        </div>
    );
}

// ── Publications ─────────────────────────────────────

function AdminPublications() {
    const [pubs, setPubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const data = await publications.getAll({ status: 'pending' });
            setPubs(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleApprove = async (id) => {
        try {
            await publications.approve(id);
            setPubs(prev => prev.filter(p => (p._id || p.id) !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const openReject = (pub) => {
        setRejectModal({ id: pub._id || pub.id, title: pub.title });
        setRejectReason('');
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) return;
        setSubmitting(true);
        try {
            await publications.reject(rejectModal.id, rejectReason);
            setPubs(prev => prev.filter(p => (p._id || p.id) !== rejectModal.id));
            setRejectModal(null);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        let clean = path.replace(/\\/g, '/');
        if (!clean.startsWith('/')) clean = '/' + clean;
        return `http://localhost:5000${clean}`;
    };

    if (loading) return <p className="main-loader" id="button">Loading...</p>;

    return (
        <div className="admin-publications">
            {pubs.length === 0 ? (
                <div className="no-found-container">
                    <p className="no-found-text" id="button">No publications found</p>
                </div>
            ) : (
                pubs.map(pub => (
                    <div key={pub._id || pub.id} className="admin-pub-item">
                        <div className="admin-pub-image">
                            <img src={getImageUrl(pub.images?.[0])} alt={pub.title} />
                        </div>
                        <div className="admin-pub-info">
                            <p className="admin-pub-title">{pub.title}</p>
                            <p className="admin-pub-author" id="button">
                                @{pub.author?.name || 'Unknown'}
                            </p>
                            {pub.description && (
                                <p className="admin-pub-desc" id="text">{pub.description}</p>
                            )}
                        </div>
                        <div className="admin-pub-actions">
                            <button
                                className="submit-button" id="button"
                                onClick={() => handleApprove(pub._id || pub.id)}
                            >
                                APPROVE
                            </button>
                            <button
                                className="settings-danger-button" id="button"
                                onClick={() => openReject(pub)}
                            >
                                REJECT
                            </button>
                        </div>
                    </div>
                ))
            )}

            {rejectModal && (
                <div className="admin-modal-overlay" onClick={() => setRejectModal(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <p className="admin-modal-title">
                            Reject: <em>{rejectModal.title}</em>
                        </p>
                        <div className="form-group-settings">
                            <textarea
                                placeholder="REASON FOR REJECTION"
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                                className="create-textarea"
                                rows={4}
                            />
                        </div>
                        <p className="admin-modal-hint" id="text">
                            This message will be sent to the author's email.
                        </p>
                        <div className="settings-form-actions">
                            <button className="cancel-button" id="button"
                                onClick={() => setRejectModal(null)}>
                                CANCEL
                            </button>
                            <button
                                className="settings-danger-button" id="button"
                                onClick={handleReject}
                                disabled={submitting || !rejectReason.trim()}
                            >
                                {submitting ? 'SENDING...' : 'REJECT & NOTIFY'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Categories ───────────────────────────────────────

function AdminCategories() {
    const [tree, setTree] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [formData, setFormData] = useState({ name: '', parentId: '' });
    const [submitting, setSubmitting] = useState(false);
    const [flatList, setFlatList] = useState([]);

    const load = async () => {
        setLoading(true);
        try {
            const data = await categoriesService.getTree();
            setTree(data);
            setFlatList(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const openCreate = () => {
        setFormData({ name: '', parentId: '' });
        setModal({ mode: 'create' });
    };

    const openEdit = (cat) => {
        const parentId = cat.parent?._id || cat.parent?.id || cat.parent || '';
        setFormData({ name: cat.name, parentId: String(parentId) });
        setModal({ mode: 'edit', category: cat });
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) return;
        setSubmitting(true);
        try {
            if (modal.mode === 'create') {
                await categoriesService.create({
                    name: formData.name,
                    parentId: formData.parentId || null
                });
            } else {
                const id = modal.category._id || modal.category.id;
                await categoriesService.update(id, {
                    name: formData.name,
                    parentId: formData.parentId || null
                });
            }
            setModal(null);
            load();
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            await categoriesService.remove(id);
            load();
        } catch (err) {
            const message = err.response?.data?.message || err.message || 'Failed to delete';
            alert(message);
        }
    };

    if (loading) return <p className="main-loader" id="button">Loading...</p>;

    return (
        <div className="admin-categories">
            <button className="submit-button" id="button"
                style={{ marginBottom: '2rem' }}
                onClick={openCreate}>
                + NEW CATEGORY
            </button>

            {tree.map(root => (
                <div key={root._id || root.id} className="admin-cat-group">
                    <div className="admin-cat-item admin-cat-item--root">
                        <span className="admin-cat-name" id="nav"
                            style={{ opacity: root.isActive ? 1 : 0.4 }}>
                            {root.name}
                        </span>
                        <div className="admin-cat-actions">
                            <button className="settings-ghost-button" id="button"
                                onClick={() => openEdit(root)}>EDIT
                            </button>
                            <button className="settings-danger-button" id="button"
                                onClick={() => handleDelete(root._id || root.id)}>
                                DELETE
                            </button>
                        </div>
                    </div>

                    {root.children?.map(child => (
                        <div key={child._id || child.id} className="admin-cat-item admin-cat-item--child">
                            <span className="admin-cat-name" id="button"
                                style={{ opacity: child.isActive ? 1 : 0.4 }}>
                                — {child.name}
                            </span>
                            <div className="admin-cat-actions">
                                <button className="settings-ghost-button" id="button"
                                    onClick={() => openEdit(child)}>EDIT</button>
                                {/* <button className="settings-ghost-button" id="button"
                                    onClick={() => handleToggle(child._id || child.id)}>
                                    {child.isActive ? 'DEACTIVATE' : 'ACTIVATE'}
                                </button> */}
                                <button className="settings-danger-button" id="button"
                                    onClick={() => handleDelete(child._id || child.id)}>
                                    DELETE
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            {modal && (
                <div className="admin-modal-overlay" onClick={() => setModal(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="admin-modal-title">
                            {modal.mode === 'create' ? 'New Category' : 'Edit Category'}
                        </h3>
                        <div className="form-group-settings">
                            <input
                                type="text"
                                placeholder="CATEGORY NAME"
                                value={formData.name}
                                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                            />
                        </div>
                        <div className="form-group-settings">
                            <select
                                value={formData.parentId}
                                onChange={e => setFormData(p => ({ ...p, parentId: e.target.value }))}
                                className="create-select"
                            >
                                <option value="">ROOT CATEGORY (no parent)</option>
                                {flatList
                                    .filter(c => (c._id || c.id) !== (modal.category?._id || modal.category?.id))
                                    .map(c => (
                                        <option key={c._id || c.id} value={c._id || c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="settings-form-actions">
                            <button className="cancel-button" id="button"
                                onClick={() => setModal(null)}>CANCEL</button>
                            <button className="submit-button" id="button"
                                onClick={handleSubmit} disabled={submitting}>
                                {submitting ? 'SAVING...' : 'SAVE'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPanelPage;