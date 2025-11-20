import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaCalendar, FaStar } from 'react-icons/fa';
import { projectService } from '../services/project.service';
import { PORTFOLIO_OWNER_PROFILE_ID } from '../constants';
import type { ProjectListItem } from '../types/project.types';
import './HomePage.css';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'featured'>('all');

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
          const data = await projectService.getProjectsByProfile(PORTFOLIO_OWNER_PROFILE_ID);
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
                      <div style={{
                        width: '100%',
                        height: '200px',
                        background: `url(${project.thumbnail}) center/cover`,
                      }} />
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
    </div>
  );
};

export default ProjectsPage;
