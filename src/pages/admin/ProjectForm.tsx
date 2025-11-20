import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { projectsService } from '../../services/portfolio.service';
import type { ProjectRequest } from '../../types/portfolio.types';
import '../admin/AdminDashboard.css';

const ProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [formData, setFormData] = useState<ProjectRequest>({
    title: '',
    description: '',
    technologies: [],
    status: 'in_progress',
    start_date: '',
    end_date: '',
    github_url: '',
    live_url: '',
    image_url: '',
    is_featured: false,
  });

  const [techInput, setTechInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  const loadProject = async (projectId: string) => {
    try {
      const project = await projectsService.get(projectId);
      setFormData({
        title: project.title,
        description: project.description,
        technologies: project.technologies,
        status: project.current ? 'in_progress' : 'completed',
        start_date: project.startDate,
        end_date: project.endDate || '',
        github_url: project.githubUrl || '',
        live_url: project.projectUrl || '',
        image_url: project.images?.[0]?.url || '',
        is_featured: project.featured,
      });
    } catch (error) {
      console.error('Failed to load project:', error);
      alert('Failed to load project');
      navigate('/admin/projects');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isEdit && id) {
      loadProject(id);
    }
  }, [id, isEdit, loadProject]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev: ProjectRequest) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev: ProjectRequest) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTechnology = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tech = techInput.trim();
      if (tech && !formData.technologies.includes(tech)) {
        setFormData((prev: ProjectRequest) => ({
          ...prev,
          technologies: [...prev.technologies, tech]
        }));
        setTechInput('');
      }
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setFormData((prev: ProjectRequest) => ({
      ...prev,
      technologies: prev.technologies.filter((t: string) => t !== tech)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit && id) {
        await projectsService.update(id, formData);
      } else {
        await projectsService.create(formData);
      }
      navigate('/admin/projects');
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <p style={{ textAlign: 'center', color: '#718096' }}>Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>{isEdit ? 'Edit Project' : 'Add New Project'}</h1>
        <button
          onClick={() => navigate('/admin/projects')}
          className="btn-admin btn-admin-secondary"
        >
          <FaArrowLeft /> Back to Projects
        </button>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="techInput">Technologies</label>
            <input
              type="text"
              id="techInput"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={handleAddTechnology}
              placeholder="Type and press Enter to add"
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {formData.technologies.map((tech: string) => (
                <span
                  key={tech}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#4299e1',
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTechnology(tech)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '1rem',
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_date">Start Date *</label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="end_date">End Date</label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="github_url">GitHub URL</label>
              <input
                type="url"
                id="github_url"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="live_url">Live URL</label>
              <input
                type="url"
                id="live_url"
                name="live_url"
                value={formData.live_url}
                onChange={handleChange}
                placeholder="https://project.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image_url">Image URL</label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
              />
              <span>Featured Project</span>
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
              className="btn-admin btn-admin-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-admin btn-admin-primary"
              disabled={loading}
            >
              <FaSave /> {loading ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
