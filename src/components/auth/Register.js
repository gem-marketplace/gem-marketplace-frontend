import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './ModernAuth.css';

function Register() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'seller',
    phone: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreed) {
      setError('Please agree to Terms of Service and Privacy Policy');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(formData);
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
            <button
              className="tab-button"
              onClick={() => navigate('/login')}
            >
              Log In
            </button>
            <button className="tab-button active">
              Sign Up
            </button>
          </div>

          {error && <div className="error-alert">{error}</div>}

          <div className="form-container">
            {/* Name Field */}
            <div className="form-field">
              <label className="field-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="field-input"
                required
              />
            </div>

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

            {/* Phone Field */}
            <div className="form-field">
              <label className="field-label">Phone Number (Optional)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="field-input"
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

            {/* Role Selection */}
            <div className="form-field">
              <label className="field-label">Choose Your Role</label>
              <div className="role-options">
                <label className={`role-card ${formData.role === 'seller' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="seller"
                    checked={formData.role === 'seller'}
                    onChange={handleChange}
                  />
                  <div className="role-content">
                    <div className="role-title">Collector/Seller</div>
                    <div className="role-description">For listing and bidding on gems.</div>
                  </div>
                  <div className="role-check"></div>
                </label>

                <label className={`role-card ${formData.role === 'buyer' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="buyer"
                    checked={formData.role === 'buyer'}
                    onChange={handleChange}
                  />
                  <div className="role-content">
                    <div className="role-title">Buyer</div>
                    <div className="role-description">For browsing and purchasing gems.</div>
                  </div>
                  <div className="role-check"></div>
                </label>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="terms-checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>
                  By creating an account, you agree to our{' '}
                  <a href="#terms">Terms of Service</a> and{' '}
                  <a href="#privacy">Privacy Policy</a>.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="submit-button"
              disabled={loading}
            >
              🔒 {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;