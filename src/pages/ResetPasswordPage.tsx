import React, { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { FaLock, FaCheckCircle } from 'react-icons/fa';
import './AuthPages.css';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const resetToken = searchParams.get('token');
    
    if (!resetToken) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }
    
    setToken(resetToken);
  }, [searchParams]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear field-specific error
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setError('');
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.newPassword) {
      errors.newPassword = 'Password is required';
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      errors.newPassword = 'Password must contain uppercase, lowercase, and numbers';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('Invalid reset token. Please request a new password reset.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.resetPassword(
        token,
        formData.newPassword,
        formData.confirmPassword
      );
      
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Password reset successfully! You can now log in with your new password.' } 
        });
      }, 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string; message?: string; [key: string]: unknown } } };
      const errorMessage = error?.response?.data?.detail || 
                          error?.response?.data?.message ||
                          'Failed to reset password. The link may be invalid or expired.';
      
      // Check for field-specific errors
      if (error?.response?.data && typeof error.response.data === 'object') {
        const fieldErrors: Record<string, string> = {};
        Object.entries(error.response.data).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            fieldErrors[key] = value[0] as string;
          } else if (typeof value === 'string' && key !== 'detail' && key !== 'message') {
            fieldErrors[key] = value;
          }
        });
        
        if (Object.keys(fieldErrors).length > 0) {
          setFormErrors(fieldErrors);
        } else {
          setError(errorMessage);
        }
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token && !error) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="verification-status">
              <h1>Loading...</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="verification-status success">
              <FaCheckCircle className="status-icon" />
              <h1>Password Reset Successful!</h1>
              <p>Your password has been updated successfully.</p>
              <p className="redirect-message">Redirecting you to login...</p>
              <Link to="/login" className="btn btn-primary">
                Go to Login
              </Link>
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
            <FaLock />
          </div>
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">Enter your new password below</p>

          {error && (
            <div className="alert alert-error">
              {error}
              {error.includes('invalid') || error.includes('expired') ? (
                <div style={{ marginTop: '1rem' }}>
                  <Link to="/forgot-password" className="auth-link">
                    Request a new reset link
                  </Link>
                </div>
              ) : null}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={formErrors.newPassword ? 'input-error' : ''}
                disabled={loading}
                autoFocus
                required
              />
              {formErrors.newPassword && (
                <span className="field-error">{formErrors.newPassword}</span>
              )}
              <span className="field-hint">
                Minimum 8 characters with uppercase, lowercase, and numbers
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={formErrors.confirmPassword ? 'input-error' : ''}
                disabled={loading}
                required
              />
              {formErrors.confirmPassword && (
                <span className="field-error">{formErrors.confirmPassword}</span>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block" 
              disabled={loading}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Remember your password?{' '}
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

export default ResetPasswordPage;
