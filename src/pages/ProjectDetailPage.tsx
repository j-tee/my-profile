import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaCalendar, FaArrowLeft, FaImages } from 'react-icons/fa';
import { projectService } from '../services/project.service';
import type { ProjectDetail } from '../types/project.types';
import ImageGalleryModal from '../components/common/ImageGalleryModal';
import './HomePage.css';

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [initialIndex, setInitialIndex] = useState(0);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await projectService.getProjectById(id);
        setProject(data);
        
        // Prepare gallery images
        if (data.images && data.images.length > 0) {
          const imageUrls = data.images
            .sort((a, b) => a.order - b.order)
            .map(img => img.image_url);
          setGalleryImages(imageUrls);
        }
      } catch (err) {
        console.error('Failed to fetch project details:', err);
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetail();
  }, [id]);

  const openGallery = (slideIndex: number = 0) => {
    setInitialIndex(slideIndex);
    setGalleryOpen(true);
  };

  const closeGallery = () => {
    setGalleryOpen(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#718096' }}>Loading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <p style={{ color: '#e53e3e' }}>{error || 'Project not found'}</p>
        <button
          onClick={() => navigate('/projects')}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#4299e1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="home-page">
      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back Button */}
            <button
              onClick={() => navigate('/projects')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'transparent',
                color: '#4299e1',
                border: '2px solid #4299e1',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                marginBottom: '2rem',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#4299e1';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#4299e1';
              }}
            >
              <FaArrowLeft /> Back to Projects
            </button>

            {/* Project Header */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <h1 style={{ margin: 0, color: '#2d3748', fontSize: '2.5rem' }}>
                  {project.title}
                </h1>
                {project.featured && (
                  <span style={{
                    padding: '0.5rem 1rem',
                    background: '#fef3c7',
                    color: '#92400e',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}>
                    ⭐ Featured
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', color: '#718096', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaCalendar />
                  <span>{project.duration}</span>
                  {project.current && (
                    <span style={{
                      marginLeft: '0.5rem',
                      padding: '0.25rem 0.75rem',
                      background: '#feebc8',
                      color: '#7c2d12',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}>
                      In Progress
                    </span>
                  )}
                </div>
                <div>
                  <strong style={{ color: '#4a5568' }}>Role:</strong> {project.role}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      background: '#2d3748',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#1a202c';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#2d3748';
                    }}
                  >
                    <FaGithub size={20} /> View Code
                  </a>
                )}
                {project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      background: '#4299e1',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#3182ce';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#4299e1';
                    }}
                  >
                    <FaExternalLinkAlt /> Live Demo
                  </a>
                )}
              </div>
            </div>

            {/* Image Gallery Section */}
            {galleryImages.length > 0 && (
              <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ color: '#2d3748', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaImages /> Project Gallery ({galleryImages.length} images)
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '1rem',
                }}>
                  {galleryImages.map((imageUrl, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => openGallery(index)}
                      style={{
                        height: '200px',
                        background: `url(${imageUrl}) center/cover`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        bottom: '0.5rem',
                        right: '0.5rem',
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}>
                        {index + 1} / {galleryImages.length}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Content */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '2rem',
            }}>
              {/* Description */}
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}>
                <h2 style={{ color: '#2d3748', marginBottom: '1rem' }}>Overview</h2>
                <p style={{ color: '#4a5568', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                  {project.description}
                </p>
              </div>

              {/* Long Description */}
              {project.long_description && (
                <div style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}>
                  <h2 style={{ color: '#2d3748', marginBottom: '1rem' }}>Detailed Description</h2>
                  <div style={{ color: '#4a5568', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                    {project.long_description}
                  </div>
                </div>
              )}

              {/* Technologies */}
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}>
                <h2 style={{ color: '#2d3748', marginBottom: '1rem' }}>Technologies Used</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#edf2f7',
                        color: '#2d3748',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <div style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}>
                  <h2 style={{ color: '#2d3748', marginBottom: '1rem' }}>Project Highlights</h2>
                  <ul style={{ color: '#4a5568', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
                    {project.highlights.map((highlight: string, index: number) => (
                      <li key={index} style={{ marginBottom: '0.5rem' }}>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Challenges */}
              {project.challenges && (
                <div style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}>
                  <h2 style={{ color: '#2d3748', marginBottom: '1rem' }}>Challenges & Solutions</h2>
                  <p style={{ color: '#4a5568', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                    {project.challenges}
                  </p>
                </div>
              )}

              {/* Outcomes */}
              {project.outcomes && (
                <div style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}>
                  <h2 style={{ color: '#2d3748', marginBottom: '1rem' }}>Outcomes & Impact</h2>
                  <p style={{ color: '#4a5568', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                    {project.outcomes}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <ImageGalleryModal
        images={galleryImages}
        initialIndex={initialIndex}
        isOpen={galleryOpen}
        onClose={closeGallery}
      />
    </div>
  );
};

export default ProjectDetailPage;
