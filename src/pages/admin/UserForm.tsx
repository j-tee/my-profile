import React, { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes, FaKey, FaEnvelope } from 'react-icons/fa';
import { userService } from '../../services/user.service';
import { useAuth } from '../../contexts/useAuth';
import type { UserDetail, UpdateUserRequest, CreateUserRequest } from '../../types/user.types';
import type { UserRole } from '../../types/auth.types';
import '../admin/AdminDashboard.css';

const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<UserDetail | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'viewer' as UserRole,
    is_active: true,
    is_verified: false,
    password: '',
    send_welcome_email: true,
  });

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isNewUser = !id;
  const isEditingSelf = id === currentUser?.id;

  const loadUser = React.useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const userData = await userService.get(id);
      setUser(userData);
      setFormData({
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone || '',
        role: userData.role,
        is_active: userData.is_active,
        is_verified: userData.is_verified,
        password: '',
        send_welcome_email: false,
      });
    } catch (err) {
      setError('Failed to load user');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id, loadUser]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isSuperAdmin) {
      setError('You do not have permission to perform this action');
      return;
    }

    try {
      setLoading(true);

      if (isNewUser) {
        // Create new user
        if (!formData.password) {
          setError('Password is required for new users');
          return;
        }

        const createData: CreateUserRequest = {
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone || undefined,
          role: formData.role,
          is_active: formData.is_active,
          send_welcome_email: formData.send_welcome_email,
        };

        await userService.create(createData);
      } else {
        // Update existing user
        const updateData: UpdateUserRequest = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone || undefined,
          role: formData.role,
          is_active: formData.is_active,
          is_verified: formData.is_verified,
        };

        await userService.update(id!, updateData);
      }

      navigate('/admin/users');
    } catch (err: unknown) {
      const error = err as { message?: string; detail?: string };
      setError(error.detail || error.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!id || !isSuperAdmin) return;

    const newPassword = prompt('Enter new password for this user:');
    if (!newPassword) return;

    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    try {
      await userService.resetPassword(id, newPassword);
      alert('Password reset successfully');
    } catch (err) {
      alert('Failed to reset password');
      console.error(err);
    }
  };

  const handleVerifyEmail = async () => {
    if (!id || !isSuperAdmin) return;

    try {
      await userService.verifyEmail(id);
      loadUser();
      alert('Email verified successfully');
    } catch (err) {
      alert('Failed to verify email');
      console.error(err);
    }
  };

  if (loading && !formData.email) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <p style={{ textAlign: 'center', color: '#718096' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>{isNewUser ? 'Add New User' : 'Edit User'}</h1>
        <button onClick={() => navigate('/admin/users')} className="btn-admin btn-admin-secondary">
          <FaTimes /> Cancel
        </button>
      </div>

      {error && (
        <div className="admin-card" style={{ background: '#fff5f5', borderLeft: '4px solid #fc8181' }}>
          <p style={{ color: '#c53030', margin: 0 }}>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="admin-card">
          <h2 style={{ marginBottom: '1.5rem', color: '#1a202c' }}>Basic Information</h2>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isNewUser || loading}
                required
              />
              <small style={{ color: '#718096' }}>
                {isNewUser ? 'Email cannot be changed after creation' : 'Email cannot be modified'}
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                placeholder="+1234567890"
              />
            </div>

            <div className="form-group">
              <label htmlFor="first_name">First Name *</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name *</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            {isNewUser && (
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  required={isNewUser}
                  minLength={8}
                />
                <small style={{ color: '#718096' }}>Minimum 8 characters</small>
              </div>
            )}
          </div>
        </div>

        <div className="admin-card">
          <h2 style={{ marginBottom: '1.5rem', color: '#1a202c' }}>Permissions & Status</h2>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="role">Role *</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={loading || isEditingSelf}
                required
              >
                <option value="viewer">Viewer - View only access</option>
                <option value="editor">Editor - Can manage content</option>
                <option value="super_admin">Super Admin - Full access</option>
              </select>
              {isEditingSelf && (
                <small style={{ color: '#e53e3e' }}>You cannot change your own role</small>
              )}
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  disabled={loading || isEditingSelf}
                />
                <span>Active Account</span>
              </label>
              {isEditingSelf && (
                <small style={{ color: '#e53e3e' }}>You cannot deactivate your own account</small>
              )}
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_verified"
                  checked={formData.is_verified}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>Email Verified</span>
              </label>
            </div>

            {isNewUser && (
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="send_welcome_email"
                    checked={formData.send_welcome_email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span>Send Welcome Email</span>
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="admin-card">
          <div className="button-group">
            <button type="submit" className="btn-admin btn-admin-primary" disabled={loading}>
              <FaSave /> {loading ? 'Saving...' : isNewUser ? 'Create User' : 'Save Changes'}
            </button>

            {!isNewUser && isSuperAdmin && !isEditingSelf && (
              <>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="btn-admin btn-admin-warning"
                  disabled={loading}
                >
                  <FaKey /> Reset Password
                </button>

                {!formData.is_verified && (
                  <button
                    type="button"
                    onClick={handleVerifyEmail}
                    className="btn-admin btn-admin-success"
                    disabled={loading}
                  >
                    <FaEnvelope /> Verify Email
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {user && (
          <div className="admin-card" style={{ background: '#f7fafc' }}>
            <h3 style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>User Details</h3>
            <p style={{ fontSize: '0.75rem', color: '#a0aec0', margin: 0 }}>
              Created: {new Date(user.created_at).toLocaleString()}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#a0aec0', margin: 0 }}>
              Last Updated: {new Date(user.updated_at).toLocaleString()}
            </p>
            {user.last_login && (
              <p style={{ fontSize: '0.75rem', color: '#a0aec0', margin: 0 }}>
                Last Login: {new Date(user.last_login).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default UserForm;
