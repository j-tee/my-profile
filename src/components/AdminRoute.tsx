import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isEditor, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.5rem',
        color: '#667eea'
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isEditor) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', color: '#e53e3e' }}>403</h1>
        <p style={{ fontSize: '1.5rem', color: '#2d3748' }}>Access Denied</p>
        <p style={{ color: '#718096' }}>You don't have permission to access this area.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
