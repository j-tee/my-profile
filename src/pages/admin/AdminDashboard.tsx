import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaHome, 
  FaBriefcase, 
  FaGraduationCap, 
  FaCode, 
  FaCertificate, 
  FaProjectDiagram,
  FaEnvelope,
  FaChartBar,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/admin', icon: <FaChartBar />, label: 'Dashboard', exact: true },
    { path: '/admin/projects', icon: <FaProjectDiagram />, label: 'Projects' },
    { path: '/admin/experiences', icon: <FaBriefcase />, label: 'Experience' },
    { path: '/admin/education', icon: <FaGraduationCap />, label: 'Education' },
    { path: '/admin/skills', icon: <FaCode />, label: 'Skills' },
    { path: '/admin/certifications', icon: <FaCertificate />, label: 'Certifications' },
    { path: '/admin/messages', icon: <FaEnvelope />, label: 'Messages' },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button 
            className="sidebar-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.first_name.charAt(0)}{user?.last_name.charAt(0)}
          </div>
          {sidebarOpen && (
            <div className="user-info">
              <p className="user-name">{user?.full_name}</p>
              <p className="user-role">{user?.role.replace('_', ' ')}</p>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="nav-item">
            <span className="nav-icon"><FaHome /></span>
            {sidebarOpen && <span className="nav-label">Back to Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
