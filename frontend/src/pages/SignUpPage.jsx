import React from 'react';
import TitleHeader from '../components/TitleHeader.jsx';

function SignUpPage() {
  return (
    <div className="auth-page-container">
      <TitleHeader title="Sign Up" />

      <div className="auth-container">
        <div className="grid-col-1" />
        <form className="auth-form">

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="email"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="name"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="password"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="confirm password"
              required
            />
          </div>
          <div className="action-buttons">
            <button type="submit" className="cancel-button" id="button">
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