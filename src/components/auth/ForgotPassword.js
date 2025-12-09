import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './ModernAuth.css';

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Reset Code
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Step 1: Request reset code
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccess(response.data.message);
      
      // For development - show the token
      if (response.data.resetToken) {
        setSuccess(`Reset code sent! Your code is: ${response.data.resetToken}`);
      }
      
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset code');
    }
    setLoading(false);
  };

  // Step 2: Verify code and reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!resetToken) {
      setError('Please enter the reset code');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email,
        resetToken,
        newPassword
      });
      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    }
    setLoading(false);
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
          <h1 className="auth-title">Reset Your Password</h1>
          <p className="auth-subtitle">
            {step === 1 
              ? 'Enter your email to receive a reset code'
              : 'Enter the code and your new password'}
          </p>

          {/* Progress Indicator */}
          <div className="progress-steps">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Email</div>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Reset</div>
            </div>
          </div>

          {error && <div className="error-alert">{error}</div>}
          {success && <div className="success-alert">{success}</div>}

          <div className="form-container">
            {/* Step 1: Email Input */}
            {step === 1 && (
              <div>
                <div className="form-field">
                  <label className="field-label">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="field-input"
                    required
                  />
                </div>

                <button
                  onClick={handleRequestReset}
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Code'}
                </button>
              </div>
            )}

            {/* Step 2: Reset Code & New Password */}
            {step === 2 && (
              <div>
                <div className="form-field">
                  <label className="field-label">Reset Code</label>
                  <input
                    type="text"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="field-input"
                    maxLength="6"
                    required
                  />
                  <small style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px', display: 'block' }}>
                    Check your email for the reset code
                  </small>
                </div>

                <div className="form-field">
                  <label className="field-label">New Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
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

                <div className="form-field">
                  <label className="field-label">Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="field-input"
                    required
                  />
                </div>

                <button
                  onClick={handleResetPassword}
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>

                <button
                  onClick={() => setStep(1)}
                  className="back-button"
                  type="button"
                >
                  ← Back to Email
                </button>
              </div>
            )}
            <div className="forgot-password" style={{ marginTop: '24px' }}>
  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
                    Remember your password? Login
                </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;