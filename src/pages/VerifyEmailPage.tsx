import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import './AuthPages.css';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const verifyEmail = useCallback(async (token: string) => {
    try {
      const response = await authService.verifyEmail(token);
      setStatus('success');
      setMessage(response.message);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Email verified successfully! You can now log in.' } 
        });
      }, 3000);
    } catch (error: unknown) {
      setStatus('error');
      const err = error as { response?: { data?: { detail?: string; message?: string } } };
      setMessage(
        err?.response?.data?.detail || 
        err?.response?.data?.message ||
        'Failed to verify email. The link may be invalid or expired.'
      );
    }
  }, [navigate]);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided. Please check your email link.');
      return;
    }

    verifyEmail(token);
  }, [searchParams, verifyEmail]);

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resendEmail.trim()) {
      setResendMessage('Please enter your email address');
      return;
    }

    setResending(true);
    setResendMessage('');

    try {
      const response = await authService.resendVerification(resendEmail);
      setResendMessage(response.message);
      setResendEmail('');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      setResendMessage(
        err?.response?.data?.detail || 
        'Failed to resend verification email. Please try again.'
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          {status === 'loading' && (
            <div className="verification-status">
              <FaSpinner className="status-icon spinning" />
              <h1>Verifying Your Email</h1>
              <p>Please wait while we verify your email address...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="verification-status success">
              <FaCheckCircle className="status-icon" />
              <h1>Email Verified!</h1>
              <p>{message}</p>
              <p className="redirect-message">Redirecting you to login...</p>
              <Link to="/login" className="btn btn-primary">
                Go to Login
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="verification-status error">
              <FaTimesCircle className="status-icon" />
              <h1>Verification Failed</h1>
              <p>{message}</p>

              <div className="resend-section">
                <h3>Need a new verification link?</h3>
                <form onSubmit={handleResendVerification} className="resend-form">
                  <div className="form-group">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      disabled={resending}
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-secondary"
                    disabled={resending}
                  >
                    {resending ? 'Sending...' : 'Resend Verification Email'}
                  </button>
                </form>
                {resendMessage && (
                  <div className={`alert ${resendMessage.includes('sent') ? 'alert-success' : 'alert-info'}`}>
                    {resendMessage}
                  </div>
                )}
              </div>

              <div className="auth-footer">
                <Link to="/login" className="auth-link">
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
