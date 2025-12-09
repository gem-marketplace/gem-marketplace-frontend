import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './ModernAuth.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    setLoading(true);
    const result = await login(formData);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="modern-auth-container">
      {/* Left Side - Gemstone Visual */}
      <div className="auth-visual">
        <div className="gem-glow"></div>
        <div className="gem-icon">💎</div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-form-side">
        <div className="auth-card">
          <h1 className="auth-title">Welcome to Gemstone Exchange</h1>
          <p className="auth-subtitle">Access your account or create a new one.</p>

          {/* Tab Switcher */}
          <div className="tab-switcher">
            <button className="tab-button active">
              Log In
            </button>
            <button
              className="tab-button"
              onClick={() => navigate('/register')}
            >
              Sign Up
            </button>
          </div>

          {error && <div className="error-alert">{error}</div>}

          <div className="form-container">
            {/* Email Field */}
            <div className="form-field">
              <label className="field-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="field-input"
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-field">
              <label className="field-label">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="field-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="submit-button"
              disabled={loading}
            >
              🔒 {loading ? 'Logging in...' : 'Log In'}
            </button>

            {/* Forgot Password */}
            <div className="forgot-password">
            <button 
            onClick={() => navigate('/forgot-password')}
            className="forgot-link">
            Forgot Password?
        </button>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;