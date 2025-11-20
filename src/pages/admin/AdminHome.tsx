import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaProjectDiagram, 
  FaBriefcase, 
  FaGraduationCap, 
  FaCode,
  FaEnvelope
} from 'react-icons/fa';
import { projectsService, experiencesService, educationService, skillsService } from '../../services/portfolio.service';
import '../admin/AdminDashboard.css';

const AdminHome: React.FC = () => {
  const [stats, setStats] = useState({
    projects: 0,
    experiences: 0,
    education: 0,
    skills: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [projects, experiences, education, skills] = await Promise.all([
        projectsService.list(),
        experiencesService.list(),
        educationService.list(),
        skillsService.list(),
      ]);

      setStats({
        projects: projects.count,
        experiences: experiences.count,
        education: education.count,
        skills: skills.count,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: 'Add Project', icon: <FaProjectDiagram />, path: '/admin/projects/new', color: 'blue' },
    { label: 'Add Experience', icon: <FaBriefcase />, path: '/admin/experiences/new', color: 'green' },
    { label: 'Add Education', icon: <FaGraduationCap />, path: '/admin/education/new', color: 'orange' },
    { label: 'Add Skill', icon: <FaCode />, path: '/admin/skills/new', color: 'purple' },
  ];

  if (loading) {
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
        <h1>Dashboard Overview</h1>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FaProjectDiagram />
          </div>
          <div className="stat-content">
            <h3>{stats.projects}</h3>
            <p>Projects</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <FaBriefcase />
          </div>
          <div className="stat-content">
            <h3>{stats.experiences}</h3>
            <p>Work Experiences</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <FaGraduationCap />
          </div>
          <div className="stat-content">
            <h3>{stats.education}</h3>
            <p>Education Records</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <FaCode />
          </div>
          <div className="stat-content">
            <h3>{stats.skills}</h3>
            <p>Skills</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-card">
        <h2 style={{ marginBottom: '1.5rem', color: '#1a202c' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="btn-admin btn-admin-primary"
              style={{ justifyContent: 'center', textAlign: 'center' }}
            >
              {action.icon}
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="admin-card">
        <h2 style={{ marginBottom: '1.5rem', color: '#1a202c' }}>Management</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <Link to="/admin/projects" className="btn-admin btn-admin-secondary">
            <FaProjectDiagram /> Manage Projects
          </Link>
          <Link to="/admin/experiences" className="btn-admin btn-admin-secondary">
            <FaBriefcase /> Manage Experiences
          </Link>
          <Link to="/admin/education" className="btn-admin btn-admin-secondary">
            <FaGraduationCap /> Manage Education
          </Link>
          <Link to="/admin/skills" className="btn-admin btn-admin-secondary">
            <FaCode /> Manage Skills
          </Link>
          <Link to="/admin/messages" className="btn-admin btn-admin-secondary">
            <FaEnvelope /> View Messages
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
