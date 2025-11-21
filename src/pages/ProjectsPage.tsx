import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaCalendar, FaStar, FaImages, FaInfoCircle } from 'react-icons/fa';
import { projectService } from '../services/project.service';
import type { ProjectListItem } from '../types/project.types';
import ImageGalleryModal from '../components/common/ImageGalleryModal';
import './HomePage.css';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'featured'>('all');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        if (filter === 'featured') {
          const data = await projectService.getFeaturedProjects();
          // getFeaturedProjects returns ProjectDetail[], but we need ProjectListItem[]
          // Use type assertion since both types are compatible for display
          setProjects(data as unknown as ProjectListItem[]);
        } else {
          // Fetch all projects without user filter - backend will return all public projects
          const data = await projectService.getProjects();
          setProjects(data.results);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [filter]);

  const handleImageClick = async (projectId: string) => {
    try {
      const projectDetail = await projectService.getProjectById(projectId);
      
      if (projectDetail.images && projectDetail.images.length > 0) {
        const imageUrls = projectDetail.images
          .sort((a, b) => a.order - b.order)
          .map(img => img.image_url);
        setGalleryImages(imageUrls);
        setGalleryOpen(true);
      }
    } catch (error) {
      console.error('Failed to fetch project details:', error);
    }
  };

  const closeGallery = () => {
    setGalleryOpen(false);
    setGalleryImages([]);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#718096' }}>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="section-title">My Projects</h1>
            <p style={{ textAlign: 'center', color: '#718096', marginBottom: '2rem' }}>
              Explore my portfolio of work and technical achievements
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <button
                onClick={() => setFilter('all')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: filter === 'all' ? '#4299e1' : 'transparent',
                  color: filter === 'all' ? 'white' : '#4299e1',
                  border: '2px solid #4299e1',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                All Projects
              </button>
              <button
                onClick={() => setFilter('featured')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: filter === 'featured' ? '#4299e1' : 'transparent',
                  color: filter === 'featured' ? 'white' : '#4299e1',
                  border: '2px solid #4299e1',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                ⭐ Featured
              </button>
            </div>

            {projects.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#718096', padding: '3rem' }}>
                No projects found
              </p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '2rem',
                padding: '1rem 0',
              }}>
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {project.thumbnail && (
                      <div 
                        className="project-thumbnail"
                        onClick={() => handleImageClick(project.id)}
                        style={{
                          width: '100%',
                          height: '200px',
                          background: `url(${project.thumbnail}) center/cover`,
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'transform 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <div style={{
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          right: '0',
                          bottom: '0',
                          background: 'rgba(0, 0, 0, 0)',
                          transition: 'background 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0)';
                        }}
                        >
                          <div style={{
                            background: 'rgba(66, 153, 225, 0.95)',
                            color: 'white',
                            padding: '0.75rem 1.25rem',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '1rem',
                            fontWeight: 600,
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            pointerEvents: 'none',
                          }}
                          className="gallery-hint"
                          >
                            <FaImages size={20} />
                            <span>View Gallery</span>
                          </div>
                        </div>
                        <div style={{
                          position: 'absolute',
                          top: '0.75rem',
                          right: '0.75rem',
                          background: 'rgba(66, 153, 225, 0.95)',
                          color: 'white',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                        }}>
                          <FaImages />
                          <span>Gallery</span>
                        </div>
                      </div>
                    )}
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ margin: 0, color: '#2d3748', fontSize: '1.25rem' }}>
                          {project.title}
                        </h3>
                        {project.featured && (
                          <FaStar style={{ color: '#f59e0b', fontSize: '1rem' }} />
                        )}
                      </div>
                      
                      <p style={{ color: '#718096', fontSize: '0.875rem', marginBottom: '1rem' }}>
                        {project.description}
                      </p>

                      <div style={{ marginBottom: '1rem' }}>
                        <span style={{ color: '#4a5568', fontSize: '0.75rem', fontWeight: 600 }}>
                          Role: {project.role}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                        {project.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            style={{
                              padding: '0.25rem 0.75rem',
                              background: '#edf2f7',
                              color: '#4a5568',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span style={{ color: '#718096', fontSize: '0.75rem', alignSelf: 'center' }}>
                            +{project.technologies.length - 4} more
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#718096', fontSize: '0.875rem' }}>
                        <FaCalendar />
                        <span>{project.duration}</span>
                        {project.current && (
                          <span style={{ 
                            marginLeft: 'auto', 
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

                      <Link
                        to={`/projects/${project.id}`}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '0.75rem',
                          background: '#4299e1',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '8px',
                          textAlign: 'center',
                          fontWeight: 600,
                          marginBottom: '1rem',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#3182ce';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#4299e1';
                        }}
                      >
                        <FaInfoCircle style={{ marginRight: '0.5rem' }} />
                        View Details
                      </Link>

                      <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              color: '#4299e1',
                              textDecoration: 'none',
                              fontSize: '0.875rem',
                              fontWeight: 500,
                            }}
                          >
                            <FaGithub /> Code
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
                              color: '#4299e1',
                              textDecoration: 'none',
                              fontSize: '0.875rem',
                              fontWeight: 500,
                            }}
                          >
                            <FaExternalLinkAlt /> Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <ImageGalleryModal
        images={galleryImages}
        initialIndex={0}
        isOpen={galleryOpen}
        onClose={closeGallery}
      />
    </div>
  );
};

export default ProjectsPage;
