import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaCalendar, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import { experienceService } from '../services/experience.service';
import type { Experience } from '../types/experience.types';
import './HomePage.css';

const ExperiencePage = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const data = await experienceService.getExperiences();
      setExperiences(data.results);
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#718096' }}>Loading experience...</p>
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
            <h1 className="section-title">Work Experience</h1>
            <p style={{ textAlign: 'center', color: '#718096', marginBottom: '3rem' }}>
              My professional journey and key accomplishments
            </p>

            {experiences.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#718096', padding: '3rem' }}>
                No experience records found
              </p>
            ) : (
              <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {experiences.map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '2rem',
                      marginBottom: '2rem',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      borderLeft: '4px solid #48bb78',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{
                        background: '#f0fff4',
                        padding: '1rem',
                        borderRadius: '12px',
                        color: '#48bb78',
                        fontSize: '1.5rem',
                      }}>
                        <FaBriefcase />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                          <div>
                            <h3 style={{ margin: '0 0 0.25rem', color: '#2d3748', fontSize: '1.5rem' }}>
                              {exp.position}
                            </h3>
                            <h4 style={{ margin: 0, color: '#4a5568', fontWeight: 500, fontSize: '1.125rem' }}>
                              {exp.company}
                            </h4>
                          </div>
                          {exp.current && (
                            <span style={{
                              padding: '0.5rem 1rem',
                              background: '#c6f6d5',
                              color: '#22543d',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}>
                              Current
                            </span>
                          )}
                        </div>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1rem', marginTop: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#718096', fontSize: '0.875rem' }}>
                            <FaCalendar />
                            <span>
                              {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                              {exp.current ? ' Present' : ` ${new Date(exp.end_date || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                            </span>
                          </div>
                          {exp.location && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#718096', fontSize: '0.875rem' }}>
                              <FaMapMarkerAlt />
                              <span>{exp.location}</span>
                            </div>
                          )}
                          {exp.employment_type && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#718096', fontSize: '0.875rem' }}>
                              <FaUsers />
                              <span>{exp.employment_type.replace('_', ' ')}</span>
                            </div>
                          )}
                        </div>

                        {exp.description && (
                          <p style={{ color: '#4a5568', lineHeight: 1.6, marginBottom: '1rem' }}>
                            {exp.description}
                          </p>
                        )}

                        {exp.key_responsibilities && exp.key_responsibilities.length > 0 && (
                          <div style={{ marginBottom: '1rem' }}>
                            <h5 style={{ color: '#2d3748', marginBottom: '0.5rem', fontSize: '1rem' }}>Key Responsibilities:</h5>
                            <ul style={{ color: '#4a5568', lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
                              {exp.key_responsibilities.map((resp, idx) => (
                                <li key={idx}>{resp}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {exp.achievements && exp.achievements.length > 0 && (
                          <div style={{ marginBottom: '1rem' }}>
                            <h5 style={{ color: '#2d3748', marginBottom: '0.5rem', fontSize: '1rem' }}>Achievements:</h5>
                            <ul style={{ color: '#4a5568', lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
                              {exp.achievements.map((achievement, idx) => (
                                <li key={idx}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {exp.technologies && exp.technologies.length > 0 && (
                          <div>
                            <h5 style={{ color: '#2d3748', marginBottom: '0.75rem', fontSize: '1rem' }}>Technologies Used:</h5>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                              {exp.technologies.map((tech, idx) => (
                                <span
                                  key={idx}
                                  style={{
                                    padding: '0.5rem 1rem',
                                    background: '#ebf8ff',
                                    color: '#2c5282',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                  }}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
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

export default ExperiencePage;
