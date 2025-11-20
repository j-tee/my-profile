import React, { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { RegisterRequest } from '../types/auth.types';
import './AuthPages.css';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();

  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    phone: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear field-specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    clearError();
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!formData.password_confirm) {
      errors.password_confirm = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirm) {
      errors.password_confirm = 'Passwords do not match';
    }

    if (!formData.first_name) {
      errors.first_name = 'First name is required';
    }

    if (!formData.last_name) {
      errors.last_name = 'Last name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await register(formData);
      navigate('/');
    } catch (err: unknown) {
      // Handle field-specific errors from backend
      if (err && typeof err === 'object' && err !== null) {
        const fieldErrors: Record<string, string> = {};
        Object.entries(err as Record<string, unknown>).forEach(([key, value]) => {
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
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Sign up to get started</p>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={formErrors.first_name ? 'input-error' : ''}
                  disabled={loading}
                  required
                />
                {formErrors.first_name && (
                  <span className="field-error">{formErrors.first_name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={formErrors.last_name ? 'input-error' : ''}
                  disabled={loading}
                  required
                />
                {formErrors.last_name && (
                  <span className="field-error">{formErrors.last_name}</span>
                )}
              </div>
            </div>

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
              <label htmlFor="phone">Phone Number (Optional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1234567890"
                disabled={loading}
              />
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
              <span className="field-hint">Minimum 8 characters</span>
            </div>

            <div className="form-group">
              <label htmlFor="password_confirm">Confirm Password</label>
              <input
                type="password"
                id="password_confirm"
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                className={formErrors.password_confirm ? 'input-error' : ''}
                disabled={loading}
                required
              />
              {formErrors.password_confirm && (
                <span className="field-error">{formErrors.password_confirm}</span>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
