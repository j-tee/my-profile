import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { projectsService } from '../../services/portfolio.service';
import { apiClient } from '../../services/apiClient';
import type { ProjectRequest } from '../../types/project.types';
import type { Project as PortfolioProject } from '../../types/portfolio.types';
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    const loadProject = async (projectId: string) => {
      try {
        const project: PortfolioProject = await projectsService.get(projectId);
        const mappedStatus: ProjectRequest['status'] =
          project.status === 'planned' ? 'in_progress' : project.status;
        setFormData({
          title: project.title,
          description: project.description,
          technologies: project.technologies,
          status: mappedStatus,
          start_date: project.start_date,
          end_date: project.end_date || '',
          github_url: project.github_url || '',
          live_url: project.project_url || '',
          image_url: project.image || project.project_url || '',
          is_featured: project.is_featured,
        });
      } catch (error) {
        console.error('Failed to load project:', error);
        alert('Failed to load project');
        navigate('/admin/projects');
      } finally {
        setLoadingData(false);
      }
    };

    if (isEdit && id) {
      loadProject(id);
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev: ProjectRequest) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev: ProjectRequest) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData((prev) => ({ ...prev, image_url: '' }));
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
      // If there's an image file, we need to upload it with FormData
      if (imageFile) {
        const formDataWithFile = new FormData();
        formDataWithFile.append('title', formData.title);
        formDataWithFile.append('description', formData.description);
        formDataWithFile.append('technologies', JSON.stringify(formData.technologies));
        formDataWithFile.append('status', formData.status);
        formDataWithFile.append('start_date', formData.start_date);
        if (formData.end_date) formDataWithFile.append('end_date', formData.end_date);
        if (formData.github_url) formDataWithFile.append('github_url', formData.github_url);
        if (formData.live_url) formDataWithFile.append('live_url', formData.live_url);
        formDataWithFile.append('is_featured', String(formData.is_featured));
        formDataWithFile.append('image', imageFile);

        // Note: Backend needs to support multipart/form-data
        const response = await apiClient.post(
          isEdit && id ? `/projects/${id}/` : '/projects/',
          formDataWithFile,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );
        console.log('Project saved with image:', response.data);
      } else {
        // Regular JSON submission
        if (isEdit && id) {
          await projectsService.update(id, formData);
        } else {
          await projectsService.create(formData);
        }
      }
      
      alert('Project saved successfully!');
      navigate('/admin/projects');
    } catch (error) {
      console.error('Failed to save project:', error);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? (error as { message: string }).message 
        : 'Failed to save project. Make sure the backend API is running.';
      alert(errorMessage);
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
            <label>Project Image</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Image Upload */}
              <div>
                <input
                  type="file"
                  id="image_file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="image_file"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    background: '#4299e1',
                    color: 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#3182ce')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#4299e1')}
                >
                  📷 Upload Image
                </label>
                <span style={{ marginLeft: '1rem', fontSize: '0.875rem', color: '#718096' }}>
                  {imageFile ? imageFile.name : 'No file selected'}
                </span>
              </div>

              {/* Image URL Alternative */}
              <div>
                <p style={{ fontSize: '0.875rem', color: '#4a5568', marginBottom: '0.5rem' }}>
                  Or provide an image URL:
                </p>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              {/* Image Preview */}
              {(imagePreview || formData.image_url) && (
                <div style={{ position: 'relative' }}>
                  <img
                    src={imagePreview || formData.image_url}
                    alt="Preview"
                    style={{
                      maxWidth: '300px',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      border: '2px solid #e2e8f0',
                    }}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      background: '#fc8181',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                style={{ width: 'auto' }}
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
