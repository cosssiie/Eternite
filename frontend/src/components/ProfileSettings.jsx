import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { users } from '../api/user';
import { useNavigate } from 'react-router-dom';

function ProfileSettings() {
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        try {
            const updatedUser = await users.updateProfile(formData);

            login(updatedUser, localStorage.getItem('token'));

            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
            setMessage({ type: 'success', text: 'Profile updated successfully' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleDeleteAccount = async () => {
        try {
            await users.deleteMe();
            logout();
            navigate('/');
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Delete failed' });
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className="settings-page-container">
            <section className="settings-section">
                <div className="settings-section-label">
                    <span id="button">Profile</span>
                </div>
                <form className="auth-form-settings" onSubmit={handleSubmit}>
                    <div className="form-group-settings">
                        <input
                            type="text"
                            name="name"
                            placeholder="NAME"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group-settings">
                        <input
                            type="email"
                            name="email"
                            placeholder="EMAIL"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group-settings">
                        <input
                            type="password"
                            name="currentPassword"
                            placeholder="CURRENT PASSWORD"
                            value={formData.currentPassword}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group-settings">
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="NEW PASSWORD"
                            value={formData.newPassword}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group-settings">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="CONFIRM NEW PASSWORD"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    {message.text && (
                        <p className={`settings-message ${message.type}`} id="text">
                            {message.text}
                        </p>
                    )}

                    <div className="settings-form-actions">
                        <button type="button" className="cancel-button" id="button"
                            onClick={() => window.location.reload()}>
                            CANCEL
                        </button>
                        <button type="submit" className="submit-button" id="button">
                            SAVE CHANGES
                        </button>
                    </div>
                </form>
            </section>

            <div className="settings-divider" />

            <section className="settings-section settings-section--row">
                <div className="settings-section-label">
                    <span id="button">Session</span>
                </div>
                <div className="settings-section-action">
                    <p className="settings-hint" id="text">
                        You will be signed out of your account on this device.
                    </p>
                    <button className="settings-ghost-button" id="button" onClick={handleLogout}>
                        SIGN OUT
                    </button>
                </div>
            </section>

            <div className="settings-divider" />

            <section className="settings-section settings-section--row">
                <div className="settings-section-label">
                    <span id="button" className="settings-danger-label">Delete account</span>
                </div>
                <div className="settings-section-action">
                    <p className="settings-hint" id="text">
                        This action is permanent and cannot be undone. All your data will be erased.
                    </p>
                    {!showDeleteConfirm ? (
                        <button
                            className="settings-danger-button"
                            id="button"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            DELETE ACCOUNT
                        </button>
                    ) : (
                        <div className="settings-confirm-row">
                            <span className="settings-confirm-text" id="text">Are you sure?</span>
                            <button className="cancel-button" id="button"
                                onClick={() => setShowDeleteConfirm(false)}>
                                CANCEL
                            </button>
                            <button className="settings-danger-button settings-danger-button--confirm" id="button"
                                onClick={handleDeleteAccount}>
                                YES, DELETE
                            </button>
                        </div>
                    )}
                </div>
            </section>

        </div>
    );
}

export default ProfileSettings;