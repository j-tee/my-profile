import React, { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import './AuthPages.css';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError('');
    setError('');
  };

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.requestPasswordReset(email);
      setSubmitted(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(
        error?.response?.data?.detail || 
        'Failed to send reset email. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="verification-status success">
              <FaCheckCircle className="status-icon" />
              <h1>Check Your Email</h1>
              <p>
                If an account exists with <strong>{email}</strong>, you will receive 
                a password reset link shortly.
              </p>
              <p className="security-note">
                For security reasons, we don't confirm whether this email is registered.
              </p>
              
              <div className="auth-footer">
                <p>
                  Didn't receive the email?{' '}
                  <button 
                    onClick={() => setSubmitted(false)} 
                    className="auth-link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Try again
                  </button>
                </p>
                <p>
                  <Link to="/login" className="auth-link">
                    Back to Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-icon">
            <FaEnvelope />
          </div>
          <h1 className="auth-title">Forgot Password?</h1>
          <p className="auth-subtitle">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                className={emailError ? 'input-error' : ''}
                placeholder="you@example.com"
                disabled={loading}
                autoFocus
                required
              />
              {emailError && (
                <span className="field-error">{emailError}</span>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block" 
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Remember your password?{' '}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
