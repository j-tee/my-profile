import React, { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import type { LoginRequest } from '../types/auth.types';
import './AuthPages.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useAuth();

  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });

  const [showMFA, setShowMFA] = useState(false);
  const [mfaToken, setMfaToken] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check for success message from navigation state
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear field-specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    clearError();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    // Client-side validation
    const errors: Record<string, string> = {};
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const loginData: LoginRequest = {
        ...formData,
        ...(showMFA && mfaToken ? { mfa_token: mfaToken } : {}),
      };

      await login(loginData);
      
      // Redirect to home - no profile completion needed
      navigate('/');
    } catch (err: unknown) {
      // Check if MFA is required
      if (err && typeof err === 'object' && 'mfa_required' in err) {
        setShowMFA(true);
      } else if (err && typeof err === 'object' && err !== null) {
        // Handle field-specific errors
        const fieldErrors: Record<string, string> = {};
        Object.entries(err).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            fieldErrors[key] = value[0];
          } else if (typeof value === 'string' && key !== 'detail') {
            fieldErrors[key] = value;
          }
        });
        setFormErrors(fieldErrors);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account</p>

          {successMessage && (
            <div className="alert alert-success">
              {successMessage}
            </div>
          )}

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
                value={formData.email}
                onChange={handleChange}
                className={formErrors.email ? 'input-error' : ''}
                disabled={loading}
                required
              />
              {formErrors.email && (
                <span className="field-error">{formErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={formErrors.password ? 'input-error' : ''}
                disabled={loading}
                required
              />
              {formErrors.password && (
                <span className="field-error">{formErrors.password}</span>
              )}
              <div className="forgot-password-link">
                <Link to="/forgot-password" className="auth-link">
                  Forgot password?
                </Link>
              </div>
            </div>

            {showMFA && (
              <div className="form-group">
                <label htmlFor="mfaToken">MFA Token</label>
                <input
                  type="text"
                  id="mfaToken"
                  name="mfaToken"
                  value={mfaToken}
                  onChange={(e) => setMfaToken(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  disabled={loading}
                  required
                />
                <span className="field-hint">
                  Enter the 6-digit code from your authenticator app
                </span>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
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

export default LoginPage;
