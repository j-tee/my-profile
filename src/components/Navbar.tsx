import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Portfolio
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/projects" className="navbar-link">Projects</Link>
          <Link to="/skills" className="navbar-link">Skills</Link>
          <Link to="/experience" className="navbar-link">Experience</Link>
          <Link to="/education" className="navbar-link">Education</Link>
          <Link to="/certifications" className="navbar-link">Certifications</Link>
          
          {isAuthenticated ? (
            <>
              {(user?.role === 'super_admin' || user?.role === 'editor') && (
                <Link to="/admin" className="navbar-link navbar-admin">
                  <FaUserShield style={{ marginRight: '0.5rem' }} />
                  Admin
                </Link>
              )}
              <Link to="/profile" className="navbar-link">
                <FaUser style={{ marginRight: '0.5rem' }} />
                {user?.first_name}
              </Link>
              <button onClick={handleLogout} className="navbar-btn navbar-btn-outline">
                <FaSignOutAlt style={{ marginRight: '0.5rem' }} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-btn navbar-btn-outline">
                <FaSignInAlt style={{ marginRight: '0.5rem' }} />
                Login
              </Link>
              <Link to="/register" className="navbar-btn navbar-btn-primary">
                <FaUserPlus style={{ marginRight: '0.5rem' }} />
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
