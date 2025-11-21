import React, { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import './CompleteProfilePage.css';

const CompleteProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, loading: profileLoading, updateProfile, fetchProfile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch profile if not loaded
    if (!profile && !profileLoading) {
      fetchProfile();
    }
  }, [profile, profileLoading, fetchProfile]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const phoneValue = formData.get('phone') as string;
      await updateProfile({
        headline: formData.get('headline') as string,
        summary: formData.get('summary') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        country: formData.get('country') as string,
        phone: phoneValue || undefined,
      });

      // Success - redirect to home or dashboard
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      console.error('Failed to update profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  if (profileLoading || !profile) {
    return (
      <div className="complete-profile-container">
        <div className="loading-spinner">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="complete-profile-container">
      <div className="complete-profile-card">
        <div className="complete-profile-header">
          <h1>Complete Your Profile</h1>
          <p>Please fill in your portfolio information to get started.</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="complete-profile-form">
          <div className="form-group">
            <label htmlFor="headline">
              Professional Headline <span className="required">*</span>
            </label>
            <input
              id="headline"
              name="headline"
              type="text"
              defaultValue={profile.headline}
              placeholder="e.g., Full Stack Developer & Software Engineer"
              required
              disabled={loading}
            />
            <small className="form-hint">
              A brief description of your professional role
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="summary">
              Professional Summary <span className="required">*</span>
            </label>
            <textarea
              id="summary"
              name="summary"
              defaultValue={profile.summary}
              placeholder="Tell us about yourself, your experience, and what you do..."
              rows={5}
              required
              disabled={loading}
            />
            <small className="form-hint">
              Describe your professional background and expertise
            </small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">
                City <span className="required">*</span>
              </label>
              <input
                id="city"
                name="city"
                type="text"
                defaultValue={profile.city}
                placeholder="e.g., Accra"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">
                State/Region <span className="required">*</span>
              </label>
              <input
                id="state"
                name="state"
                type="text"
                defaultValue={profile.state}
                placeholder="e.g., Greater Accra"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="country">
              Country <span className="required">*</span>
            </label>
            <input
              id="country"
              name="country"
              type="text"
              defaultValue={profile.country}
              placeholder="e.g., Ghana"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone (optional)</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={profile.phone || ''}
              placeholder="+233 XX XXX XXXX"
              disabled={loading}
            />
            <small className="form-hint">
              Your contact number (optional)
            </small>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleSkip}
              disabled={loading}
            >
              Skip for Now
            </button>
          </div>
        </form>

        <div className="form-footer">
          <p>
            <span className="required">*</span> Required fields
          </p>
          <p className="info-text">
            You can update your profile information anytime from your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
