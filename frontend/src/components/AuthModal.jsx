function AuthModal({ message, type, onClose }) {
    if (!message) return null;

    const isSuccess = type === 'success';

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal-container" onClick={e => e.stopPropagation()}>
                <div className={`auth-modal-icon ${isSuccess ? 'success' : 'error'}`}>
                    {isSuccess ? '✓' : '✕'}
                </div>
                <p className="auth-modal-message" id="text">{message}</p>
                <button className="auth-modal-button" id="button" onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
}

export default AuthModal;