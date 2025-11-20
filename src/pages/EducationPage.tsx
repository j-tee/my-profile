import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import { educationService } from '../services/education.service';
import type { Education } from '../types/education.types';
import './HomePage.css';

const EducationPage = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const data = await educationService.getEducations();
      setEducation(data.results);
    } catch (error) {
      console.error('Failed to fetch education:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#718096' }}>Loading education...</p>
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
            <h1 className="section-title">Education</h1>
            <p style={{ textAlign: 'center', color: '#718096', marginBottom: '3rem' }}>
              My academic background and qualifications
            </p>

            {education.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#718096', padding: '3rem' }}>
                No education records found
              </p>
            ) : (
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {education.map((edu, index) => (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '2rem',
                      marginBottom: '1.5rem',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      borderLeft: '4px solid #4299e1',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{
                        background: '#ebf8ff',
                        padding: '1rem',
                        borderRadius: '12px',
                        color: '#4299e1',
                        fontSize: '1.5rem',
                      }}>
                        <FaGraduationCap />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 0.5rem', color: '#2d3748', fontSize: '1.5rem' }}>
                          {edu.degree} in {edu.field_of_study}
                        </h3>
                        <h4 style={{ margin: '0 0 1rem', color: '#4a5568', fontWeight: 500 }}>
                          {edu.institution}
                        </h4>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#718096', fontSize: '0.875rem' }}>
                            <FaCalendar />
                            <span>
                              {new Date(edu.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                              {edu.current ? ' Present' : ` ${new Date(edu.end_date || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                            </span>
                          </div>
                          {edu.location && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#718096', fontSize: '0.875rem' }}>
                              <FaMapMarkerAlt />
                              <span>{edu.location}</span>
                            </div>
                          )}
                        </div>

                        {edu.gpa && (
                          <div style={{ marginBottom: '1rem' }}>
                            <span style={{
                              padding: '0.5rem 1rem',
                              background: '#c6f6d5',
                              color: '#22543d',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                            }}>
                              GPA: {edu.gpa}
                            </span>
                          </div>
                        )}

                        {edu.description && (
                          <p style={{ color: '#4a5568', lineHeight: 1.6, marginBottom: '1rem' }}>
                            {edu.description}
                          </p>
                        )}

                        {edu.achievements && edu.achievements.length > 0 && (
                          <div>
                            <h5 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>Achievements:</h5>
                            <ul style={{ color: '#4a5568', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
                              {edu.achievements.map((achievement, idx) => (
                                <li key={idx}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {edu.relevant_courses && edu.relevant_courses.length > 0 && (
                          <div style={{ marginTop: '1rem' }}>
                            <h5 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>Relevant Courses:</h5>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                              {edu.relevant_courses.map((course, idx) => (
                                <span
                                  key={idx}
                                  style={{
                                    padding: '0.25rem 0.75rem',
                                    background: '#edf2f7',
                                    color: '#4a5568',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                  }}
                                >
                                  {course}
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

export default EducationPage;
