import React, { useState, type FormEvent, type ChangeEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth.service';
import type { UpdateProfileRequest, ChangePasswordRequest, MFASetupResponse } from '../types/auth.types';
import { FaShieldAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './AuthPages.css';

const ProfilePage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'mfa'>('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Profile form
  const [profileData, setProfileData] = useState<UpdateProfileRequest>({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
  });
  
  // Password form
  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
    old_password: '',
    new_password: '',
    new_password_confirm: '',
  });
  
  // MFA state
  const [mfaSetup, setMfaSetup] = useState<MFASetupResponse | null>(null);
  const [mfaToken, setMfaToken] = useState('');
  const [mfaPassword, setMfaPassword] = useState('');

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updatedUser = await authService.updateProfile(profileData);
      updateUser(updatedUser);
      showMessage('success', 'Profile updated successfully!');
    } catch {
      showMessage('error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.new_password_confirm) {
      showMessage('error', 'New passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      await authService.changePassword(passwordData);
      showMessage('success', 'Password changed successfully!');
      setPasswordData({
        old_password: '',
        new_password: '',
        new_password_confirm: '',
      });
    } catch {
      showMessage('error', 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleMFASetup = async () => {
    setLoading(true);
    
    try {
      const setup = await authService.setupMFA();
      setMfaSetup(setup);
      showMessage('success', 'Scan the QR code with your authenticator app');
    } catch {
      showMessage('error', 'Failed to setup MFA');
    } finally {
      setLoading(false);
    }
  };

  const handleMFAVerify = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await authService.verifyMFA({ token: mfaToken });
      
      if (user) {
        updateUser({ ...user, mfa_enabled: true });
      }
      
      showMessage('success', 'MFA enabled successfully!');
      setMfaSetup(null);
      setMfaToken('');
    } catch {
      showMessage('error', 'Invalid MFA token');
    } finally {
      setLoading(false);
    }
  };

  const handleMFADisable = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await authService.disableMFA({ password: mfaPassword });
      
      if (user) {
        updateUser({ ...user, mfa_enabled: false });
      }
      
      showMessage('success', 'MFA disabled successfully');
      setMfaPassword('');
    } catch {
      showMessage('error', 'Failed to disable MFA. Check your password.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-header-content">
            <div className="profile-avatar">
              {user.first_name.charAt(0)}{user.last_name.charAt(0)}
            </div>
            <div className="profile-info">
              <h1>{user.full_name}</h1>
              <p className="profile-email">{user.email}</p>
              <span className="profile-badge">{user.role.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="profile-section">
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0' }}>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                padding: '1rem 1.5rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'profile' ? '3px solid #667eea' : '3px solid transparent',
                color: activeTab === 'profile' ? '#667eea' : '#718096',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Profile Info
            </button>
            <button
              onClick={() => setActiveTab('password')}
              style={{
                padding: '1rem 1.5rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'password' ? '3px solid #667eea' : '3px solid transparent',
                color: activeTab === 'password' ? '#667eea' : '#718096',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Password
            </button>
            <button
              onClick={() => setActiveTab('mfa')}
              style={{
                padding: '1rem 1.5rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'mfa' ? '3px solid #667eea' : '3px solid transparent',
                color: activeTab === 'mfa' ? '#667eea' : '#718096',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <FaShieldAlt style={{ marginRight: '0.5rem' }} />
              Security (MFA)
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <>
              <h2 className="section-title">Profile Information</h2>
              <form onSubmit={handleProfileSubmit} className="auth-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="first_name">First Name</label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={profileData.first_name}
                      onChange={handleProfileChange}
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="last_name">Last Name</label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={profileData.last_name}
                      onChange={handleProfileChange}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    disabled={loading}
                  />
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Email</span>
                    <span className="info-value">{user.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Account Status</span>
                    <span className="info-value">{user.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <>
              <h2 className="section-title">Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="old_password">Current Password</label>
                  <input
                    type="password"
                    id="old_password"
                    name="old_password"
                    value={passwordData.old_password}
                    onChange={handlePasswordChange}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_password">New Password</label>
                  <input
                    type="password"
                    id="new_password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    disabled={loading}
                    required
                  />
                  <span className="field-hint">Minimum 8 characters</span>
                </div>
                <div className="form-group">
                  <label htmlFor="new_password_confirm">Confirm New Password</label>
                  <input
                    type="password"
                    id="new_password_confirm"
                    name="new_password_confirm"
                    value={passwordData.new_password_confirm}
                    onChange={handlePasswordChange}
                    disabled={loading}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </>
          )}

          {/* MFA Tab */}
          {activeTab === 'mfa' && (
            <>
              <h2 className="section-title">Multi-Factor Authentication</h2>
              
              <div className="mfa-status">
                <span className={`status-badge ${user.mfa_enabled ? 'status-enabled' : 'status-disabled'}`}>
                  {user.mfa_enabled ? (
                    <>
                      <FaCheckCircle /> MFA Enabled
                    </>
                  ) : (
                    <>
                      <FaTimesCircle /> MFA Disabled
                    </>
                  )}
                </span>
              </div>

              {!user.mfa_enabled && !mfaSetup && (
                <div style={{ marginTop: '1.5rem' }}>
                  <p style={{ color: '#718096', marginBottom: '1rem' }}>
                    Enhance your account security by enabling two-factor authentication. 
                    You'll need an authenticator app like Google Authenticator or Authy.
                  </p>
                  <button onClick={handleMFASetup} className="btn btn-primary" disabled={loading}>
                    {loading ? 'Setting up...' : 'Setup MFA'}
                  </button>
                </div>
              )}

              {mfaSetup && (
                <div>
                  <div className="qr-code-container">
                    <h3>Scan QR Code</h3>
                    <img src={mfaSetup.qr_code} alt="MFA QR Code" />
                    <p style={{ marginTop: '1rem', color: '#718096' }}>
                      Secret Key: <code>{mfaSetup.secret}</code>
                    </p>
                  </div>

                  <div className="backup-codes">
                    <h4>⚠️ Backup Codes</h4>
                    <p style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
                      Save these codes in a secure place. You can use them to access your account if you lose your device.
                    </p>
                    <div className="backup-codes-list">
                      {mfaSetup.backup_codes.map((code) => (
                        <div key={code}>{code}</div>
                      ))}
                    </div>
                    <p className="backup-codes-warning">
                      These codes will only be shown once!
                    </p>
                  </div>

                  <form onSubmit={handleMFAVerify} className="auth-form">
                    <div className="form-group">
                      <label htmlFor="mfaToken">Enter Verification Code</label>
                      <input
                        type="text"
                        id="mfaToken"
                        value={mfaToken}
                        onChange={(e) => setMfaToken(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        disabled={loading}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Verifying...' : 'Verify and Enable MFA'}
                    </button>
                  </form>
                </div>
              )}

              {user.mfa_enabled && (
                <div style={{ marginTop: '1.5rem' }}>
                  <p style={{ color: '#718096', marginBottom: '1rem' }}>
                    Your account is protected with two-factor authentication. 
                    To disable MFA, enter your password below.
                  </p>
                  <form onSubmit={handleMFADisable} className="auth-form">
                    <div className="form-group">
                      <label htmlFor="mfaPassword">Password</label>
                      <input
                        type="password"
                        id="mfaPassword"
                        value={mfaPassword}
                        onChange={(e) => setMfaPassword(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-secondary" disabled={loading}>
                      {loading ? 'Disabling...' : 'Disable MFA'}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>

        {/* Logout Button */}
        <div className="profile-section">
          <button
            onClick={logout}
            className="btn btn-secondary btn-block"
            style={{ background: '#fed7d7', color: '#742a2a' }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
