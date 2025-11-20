import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { projectService } from '../../services/project.service';
import { PORTFOLIO_OWNER_PROFILE_ID } from '../../constants';
import type { ProjectCreateRequest, ProjectDetail, ProjectMedia } from '../../types/project.types';
import '../admin/AdminDashboard.css';

const ProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [formData, setFormData] = useState<ProjectCreateRequest>({
    profile: '', // Will be set from context/props
    title: '',
    description: '',
    long_description: '',
    technologies: [],
    role: '',
    team_size: undefined,
    start_date: '',
    end_date: '',
    current: false,
    project_url: '',
    github_url: '',
    demo_url: '',
    highlights: [],
    challenges: '',
    outcomes: '',
    featured: false,
    order: 0,
  });

  const [techInput, setTechInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [mediaItems, setMediaItems] = useState<ProjectMedia[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [captionInput, setCaptionInput] = useState<string>('');
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Set portfolio owner profile ID
  useEffect(() => {
    setFormData(prev => ({ ...prev, profile: PORTFOLIO_OWNER_PROFILE_ID }));
  }, []);

  useEffect(() => {
    const loadProject = async (projectId: string) => {
      try {
        const project: ProjectDetail = await projectService.getProjectById(projectId);
        setFormData({
          profile: project.profile,
          title: project.title,
          description: project.description,
          long_description: project.long_description || '',
          technologies: project.technologies,
          role: project.role,
          team_size: project.team_size || undefined,
          start_date: project.start_date,
          end_date: project.end_date || '',
          current: project.current,
          project_url: project.project_url || '',
          github_url: project.github_url || '',
          demo_url: project.demo_url || '',
          highlights: project.highlights || [],
          challenges: project.challenges || '',
          outcomes: project.outcomes || '',
          featured: project.featured,
          order: project.order,
        });
        
        // Load existing images into mediaItems for display
        if (project.images && project.images.length > 0) {
          const existingMedia: ProjectMedia[] = project.images.map((img) => ({
            id: img.id,
            type: 'image' as const,
            url: img.image_url,
            caption: img.caption || '',
            order: img.order,
          }));
          setMediaItems(existingMedia);
        }
      } catch (error) {
        console.error('Failed to load project:', error);
        toast.error('Failed to load project');
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
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: value ? parseInt(value) : undefined }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      // Validate file type
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (type === 'image' && !isImage) {
        toast.error('Please select image files only');
        return;
      }
      
      if (type === 'video' && !isVideo) {
        toast.error('Please select video files only');
        return;
      }
      
      // Validate file size
      const maxSize = type === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB for images, 50MB for videos
      if (file.size > maxSize) {
        toast.error(`${type === 'image' ? 'Image' : 'Video'} size must be less than ${maxSize / (1024 * 1024)}MB`);
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const newItem = {
          id: `${Date.now()}-${Math.random()}`,
          type,
          file,
          url: '',
          preview: reader.result as string,
          caption: ''
        };
        setMediaItems((prev) => [...prev, newItem]);
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    e.target.value = '';
  };

  const getVideoThumbnail = (url: string): string => {
    // Extract YouTube thumbnail
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (youtubeMatch) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
    }
    
    // For other videos, use a placeholder
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150"%3E%3Crect fill="%23ddd" width="200" height="150"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="20"%3EVideo%3C/text%3E%3C/svg%3E';
  };

  const removeMedia = (id: string) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== id));
  };

  const moveMedia = (id: string, direction: 'up' | 'down') => {Element> | React.FormEvent) => {
    if ('key' in e && e.key === 'Enter') {
      e.preventDefault();
      const tech = techInput.trim();
      if (tech && !formData.technologies.includes(tech)) {
        setFormData((prev) => ({
          ...prev,
          technologies: [...prev.technologies, tech]
        }));
        setTechInput('');
      }
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech)
    }));
  };

  const handleAddHighlight = (e: React.KeyboardEvent<HTMLInputElement> | React.FormEvent) => {
    if ('key' in e && e.key === 'Enter') {
      e.preventDefault();
      const highlight = highlightInput.trim();
      if (highlight && !formData.highlights?.includes(highlight)) {
        setFormData((prev) => ({
          ...prev,
          highlights: [...(prev.highlights || []), highlight]
        }));
        setHighlightInput('');
      }
    }
  };

  const handleRemoveHighlight = (highlight: string) => {
    setFormData((prev) => ({
      ...prev,
      highlights: (prev.highlights || []).filter((h) => h !== highlight)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.profile) {
        toast.error('Profile ID is required');
        return;
      }

      // Prepare project data
      const projectData: ProjectCreateRequest = {
        ...formData,
        end_date: formData.current ? undefined : formData.end_date,
      };

      // Collect image files from mediaItems
      const imageFiles: File[] = mediaItems
        .filter(item => item.type === 'image' && item.file)
        .map(item => item.file!);

      // Use the single video file (backend supports one video per project)
      const video = videoFile || mediaItems.find(item => item.type === 'video' && item.file)?.file;

      // Create or update project
      let savedProject: ProjectDetail;
      if (isEdit && id) {
        savedProject = await projectService.updateProject(id, projectData, video);
      } else {
        savedProject = await projectService.createProject(projectData, imageFiles, video);
      }

      console.log('Project saved:', savedProject);
      toast.success('Project saved successfully!');
      navigate('/admin/projects');
    } catch (error) {
      console.error('Failed to save project:', error);
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? (error as { message: string }).message 
        : 'Failed to save project. Please check all required fields.';
      toast.error(errorMessage);
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
              <label htmlFor="title">Project Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="E-Commerce Platform"
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Your Role *</label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                placeholder="Full Stack Developer"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Short Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
              placeholder="Brief summary of the project (1-2 sentences)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="long_description">Detailed Description</label>
            <textarea
              id="long_description"
              name="long_description"
              value={formData.long_description}
              onChange={handleChange}
              rows={6}
              placeholder="Full project description, features, and technical details..."
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
              placeholder="Type and press Enter to add (e.g., React, Django, PostgreSQL)"
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {formData.technologies.map((tech) => (
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
              <label htmlFor="team_size">Team Size</label>
              <input
                type="number"
                id="team_size"
                name="team_size"
                value={formData.team_size || ''}
                onChange={handleChange}
                min="1"
                placeholder="5"
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="current"
                  checked={formData.current}
                  onChange={handleChange}
                  style={{ marginRight: '0.5rem' }}
                />
                Currently working on this project
              </label>
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
              <label htmlFor="end_date">End Date {!formData.current && '*'}</label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required={!formData.current}
                disabled={formData.current}
              />
              {formData.current && (
                <small style={{ color: '#718096' }}>Disabled for current projects</small>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="highlightInput">Key Achievements & Highlights</label>
            <input
              type="text"
              id="highlightInput"
              value={highlightInput}
              onChange={(e) => setHighlightInput(e.target.value)}
              onKeyDown={handleAddHighlight}
              placeholder="Type and press Enter to add (e.g., Reduced load time by 60%)"
            />
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
              {(formData.highlights || []).map((highlight) => (
                <li key={highlight} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {highlight}
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(highlight)}
                    style={{
                      background: '#fed7d7',
                      color: '#c53030',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.25rem 0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="form-group">
            <label htmlFor="challenges">Challenges Faced</label>
            <textarea
              id="challenges"
              name="challenges"
              value={formData.challenges}
              onChange={handleChange}
              rows={3}
              placeholder="Main challenges encountered and how you solved them..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="outcomes">Outcomes & Results</label>
            <textarea
              id="outcomes"
              name="outcomes"
              value={formData.outcomes}
              onChange={handleChange}
              rows={3}
              placeholder="Measurable results, user impact, business value..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="project_url">Project URL</label>
              <input
                type="url"
                id="project_url"
                name="project_url"
                value={formData.project_url}
                onChange={handleChange}
                placeholder="https://project.com"
              />
            </div>

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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="demo_url">Demo Video URL</label>
              <input
                type="url"
                id="demo_url"
                name="demo_url"
                value={formData.demo_url}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>

          <div className="form-group">
            <label>Project Media</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Multiple Images Upload */}
              <div>
                <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                  Project Images (max 10MB each)
                </label>
                <input
                  type="file"
                  id="image_files"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleMediaUpload(e, 'image')}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="image_files"
                  className="btn-admin btn-admin-primary"
                  style={{ cursor: 'pointer', margin: 0, display: 'inline-block' }}
                >
                  📷 Upload Images
                </label>
                <small style={{ display: 'block', color: '#718096', marginTop: '0.5rem' }}>
                  Supported formats: JPG, PNG, GIF, WebP
                </small>
              </div>

              {/* Single Video Upload */}
              <div>
                <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                  Project Video (max 100MB, optional)
                </label>
                <input
                  type="file"
                  id="video_file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 100 * 1024 * 1024) {
                        alert('Video file must be less than 100MB');
                        e.target.value = '';
                        return;
                      }
                      setVideoFile(file);
                    }
                  }}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="video_file"
                  className="btn-admin btn-admin-primary"
                  style={{ cursor: 'pointer', margin: 0, display: 'inline-block' }}
                >
                  🎥 Upload Video
                </label>
                {videoFile && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#48bb78' }}>✓ {videoFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setVideoFile(null)}
                      style={{
                        background: '#fed7d7',
                        color: '#c53030',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.25rem 0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
                <small style={{ display: 'block', color: '#718096', marginTop: '0.5rem' }}>
                  Supported formats: MP4, MOV, AVI, WebM, MKV
                </small>
              </div>

              {/* Image Preview Gallery */}
              {mediaItems.length > 0 && (
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '1rem' }}>
                    Selected Images ({mediaItems.length})
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                    {mediaItems.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '0.5rem',
                          position: 'relative',
                        }}
                      >
                        <div style={{ position: 'relative', paddingBottom: '75%', background: '#f7fafc', borderRadius: '4px', overflow: 'hidden' }}>
                          <img
                            src={item.preview || item.url}
                            alt={item.caption || 'Project image'}
                            style={{
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMedia(item.id)}
                          style={{
                            position: 'absolute',
                            top: '0.75rem',
                            right: '0.75rem',
                            background: '#fed7d7',
                            color: '#c53030',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  style={{ width: 'auto' }}
                />
                <span>Featured Project</span>
              </label>
              <small style={{ display: 'block', color: '#718096', marginTop: '0.25rem' }}>
                Featured projects appear on the homepage
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="order">Display Order</label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
              <small style={{ display: 'block', color: '#718096', marginTop: '0.25rem' }}>
                Lower numbers appear first
              </small>
            </div>
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
