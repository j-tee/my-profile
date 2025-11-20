import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSearch, FaUserShield, FaUserEdit, FaUserCheck } from 'react-icons/fa';
import { userService } from '../../services/user.service';
import { useAuth } from '../../contexts/useAuth';
import type { UserListItem } from '../../types/user.types';
import '../admin/AdminDashboard.css';

const UsersList: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const isSuperAdmin = currentUser?.role === 'super_admin';

  const loadUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      const params: { page?: number; search?: string; role?: string; is_active?: boolean } = { page };
      
      if (searchTerm) params.search = searchTerm;
      if (roleFilter !== 'all') params.role = roleFilter;
      if (statusFilter === 'active') params.is_active = true;
      if (statusFilter === 'inactive') params.is_active = false;

      const response = await userService.list(params);
      setUsers(response.results);
      setTotalCount(response.count);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, roleFilter, statusFilter, page]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await userService.delete(id);
      loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    }
  };

  const toggleUserStatus = async (id: string, isActive: boolean) => {
    try {
      if (isActive) {
        await userService.deactivate(id);
      } else {
        await userService.activate(id);
      }
      loadUsers();
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'super_admin': return 'badge-super-admin';
      case 'editor': return 'badge-editor';
      case 'viewer': return 'badge-viewer';
      default: return 'badge-default';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <FaUserShield />;
      case 'editor': return <FaUserEdit />;
      case 'viewer': return <FaUserCheck />;
      default: return null;
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <p style={{ textAlign: 'center', color: '#718096' }}>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>User Management</h1>
        {isSuperAdmin && (
          <Link to="/admin/users/new" className="btn-admin btn-admin-primary">
            <FaPlus /> Add User
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="admin-card">
        <div className="filters-container">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Role:</label>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Verified</th>
                <th>Last Login</th>
                <th>Created</th>
                {isSuperAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 8 : 7} style={{ textAlign: 'center', color: '#718096' }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-small">
                          {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                        </div>
                        <strong>{user.full_name}</strong>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                        {getRoleIcon(user.role)}
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {user.is_active ? (
                        <span className="badge badge-success">
                          <FaCheck /> Active
                        </span>
                      ) : (
                        <span className="badge badge-danger">
                          <FaTimes /> Inactive
                        </span>
                      )}
                    </td>
                    <td>
                      {user.is_verified ? (
                        <span className="badge badge-success">
                          <FaCheck />
                        </span>
                      ) : (
                        <span className="badge badge-warning">
                          <FaTimes />
                        </span>
                      )}
                    </td>
                    <td>{user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    {isSuperAdmin && (
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/admin/users/${user.id}/edit`}
                            className="btn-icon btn-icon-edit"
                            title="Edit user"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => toggleUserStatus(user.id, user.is_active)}
                            className={`btn-icon ${user.is_active ? 'btn-icon-danger' : 'btn-icon-success'}`}
                            title={user.is_active ? 'Deactivate user' : 'Activate user'}
                          >
                            {user.is_active ? <FaTimes /> : <FaCheck />}
                          </button>
                          {user.id !== currentUser?.id && (
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="btn-icon btn-icon-danger"
                              title="Delete user"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalCount > 10 && (
          <div className="pagination">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="btn-admin btn-admin-secondary"
            >
              Previous
            </button>
            <span>
              Page {page} of {Math.ceil(totalCount / 10)}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(totalCount / 10)}
              className="btn-admin btn-admin-secondary"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="admin-card">
        <p style={{ color: '#718096', fontSize: '0.875rem' }}>
          Showing {users.length} of {totalCount} users
        </p>
      </div>
    </div>
  );
};

export default UsersList;
