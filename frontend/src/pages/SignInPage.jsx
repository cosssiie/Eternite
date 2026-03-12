import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TitleHeader from '../components/TitleHeader.jsx';
import AuthModal from '../components/AuthModal.jsx';
import api from '../api/axios';

function SignInPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [modal, setModal] = useState({ message: '', type: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => setModal({ message: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/users/login', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message;
      setModal({
        message: msg === 'Confirm your email before Sign in'
          ? 'Please confirm your email before signing in'
          : 'Invalid email or password',
        type: 'error'
      });
    }
  };

  return (
    <div className="auth-page-container">
      <TitleHeader title="Sign In" />

      <AuthModal
        message={modal.message}
        type={modal.type}
        onClose={handleClose}
      />

      <div className="auth-container">
        <div className="grid-col-1" />
        <form className="auth-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="action-buttons">
            <button type="submit" className="cancel-button" id="button" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="submit-button" id="button">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignInPage;