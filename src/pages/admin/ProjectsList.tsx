import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { projectService } from '../../services/project.service';
import { PORTFOLIO_OWNER_PROFILE_ID } from '../../constants';
import type { ProjectListItem } from '../../types/project.types';
import '../admin/AdminDashboard.css';

const ProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectService.getProjectsByProfile(PORTFOLIO_OWNER_PROFILE_ID);
      setProjects(data.results);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    setDeleting(id);
    try {
      await projectService.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Failed to delete project');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <p style={{ textAlign: 'center', color: '#718096' }}>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Projects</h1>
        <div className="admin-actions">
          <Link to="/admin/projects/new" className="btn-admin btn-admin-primary">
            <FaPlus /> Add Project
          </Link>
        </div>
      </div>

      <div className="admin-card">
        {projects.length === 0 ? (
          <div className="empty-state">
            <FaEye />
            <h3>No Projects Yet</h3>
            <p>Start by adding your first project</p>
            <Link to="/admin/projects/new" className="btn-admin btn-admin-primary">
              <FaPlus /> Add Project
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Technologies</th>
                  <th>Featured</th>
                  <th>Start Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <strong>{project.title}</strong>
                      <br />
                      <small style={{ color: '#718096' }}>
                        {project.description.substring(0, 60)}...
                      </small>
                    </td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: project.current ? '#feebc8' : '#c6f6d5',
                        color: project.current ? '#7c2d12' : '#22543d',
                      }}>
                        {project.current ? 'In Progress' : 'Completed'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span key={tech} style={{
                            padding: '0.25rem 0.5rem',
                            background: '#edf2f7',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            color: '#4a5568'
                          }}>
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span style={{ fontSize: '0.75rem', color: '#718096' }}>
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {project.featured ? '⭐' : '-'}
                    </td>
                    <td>{new Date(project.start_date).toLocaleDateString()}</td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/admin/projects/${project.id}/edit`}
                          className="btn-icon"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="btn-icon danger"
                          title="Delete"
                          disabled={deleting === project.id}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsList;
