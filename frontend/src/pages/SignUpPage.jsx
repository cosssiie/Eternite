import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TitleHeader from '../components/TitleHeader.jsx';
import AuthModal from '../components/AuthModal.jsx';
import api from '../api/axios';


function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '', name: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modal, setModal] = useState({ message: '', type: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setModal({ message: '', type: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setModal({ message: 'Passwords do not match', type: 'error' });
    }
    if (formData.password.length < 6) {
      return setModal({ message: 'Password must be at least 6 characters', type: 'error' });
    }

    try {
      await api.post('/users/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setModal({
        message: 'A confirmation email has been sent to your inbox',
        type: 'success'
      });
    } catch (err) {
      const msg = err.response?.data?.message;
      setModal({
        message: msg === 'Email is arleady in use' ? 'This email is already in use' : 'Registration error. Please try again.',
        type: 'error'
      });
    }
  };

  return (
    <div className="auth-page-container">
      <TitleHeader title="Sign Up" />

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
              type="text"
              name="name"
              placeholder="name"
              required
              value={formData.name}
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

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="confirm password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className="action-buttons">
            <button type="submit" className="cancel-button" id="button" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="submit-button" id="button">
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;