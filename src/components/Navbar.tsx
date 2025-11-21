import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUserShield, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          Portfolio
        </Link>

        <button
          type="button"
          className="navbar-toggle"
          aria-label="Toggle navigation menu"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'is-active' : ''}`}>
          <Link to="/" className="navbar-link" onClick={closeMobileMenu}>Home</Link>
          <Link to="/projects" className="navbar-link" onClick={closeMobileMenu}>Projects</Link>
          <Link to="/skills" className="navbar-link" onClick={closeMobileMenu}>Skills</Link>
          <Link to="/experience" className="navbar-link" onClick={closeMobileMenu}>Experience</Link>
          <Link to="/education" className="navbar-link" onClick={closeMobileMenu}>Education</Link>
          <Link to="/certifications" className="navbar-link" onClick={closeMobileMenu}>Certifications</Link>
          
          {isAuthenticated ? (
            <>
              {(user?.role === 'super_admin' || user?.role === 'editor') && (
                <Link to="/admin" className="navbar-link navbar-admin" onClick={closeMobileMenu}>
                  <FaUserShield style={{ marginRight: '0.5rem' }} />
                  Admin
                </Link>
              )}
              <Link to="/profile" className="navbar-link" onClick={closeMobileMenu}>
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
              <Link to="/login" className="navbar-btn navbar-btn-outline" onClick={closeMobileMenu}>
                <FaSignInAlt style={{ marginRight: '0.5rem' }} />
                Login
              </Link>
              <Link to="/register" className="navbar-btn navbar-btn-primary" onClick={closeMobileMenu}>
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
