import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCertificate, FaExternalLinkAlt, FaCalendar, FaCheckCircle } from 'react-icons/fa';
import { certificationService } from '../services/certification.service';
import type { Certification } from '../types/certification.types';
import { getPortfolioOwnerId } from '../utils/profileUtils';
import './HomePage.css';

const CertificationsPage = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const profileId = await getPortfolioOwnerId();
      const data = await certificationService.getCertifications(profileId);
      setCertifications(data.results);
    } catch (error) {
      console.error('Failed to fetch certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#718096' }}>Loading certifications...</p>
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
            <h1 className="section-title">Professional Certifications</h1>
            <p style={{ textAlign: 'center', color: '#718096', marginBottom: '3rem' }}>
              Industry-recognized credentials and qualifications
            </p>

            {certifications.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#718096', padding: '3rem' }}>
                No certifications found
              </p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                gap: '2rem',
                maxWidth: '1200px',
                margin: '0 auto',
              }}>
                {certifications.map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '2rem',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      border: '1px solid #e2e8f0',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    }}
                    whileHover={{ transform: 'translateY(-4px)', boxShadow: '0 8px 12px rgba(0,0,0,0.15)' }}
                  >
                    {/* Accent Border */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #4299e1 0%, #667eea 100%)',
                    }} />

                    {/* Header with Icon */}
                    <div style={{ display: 'flex', alignItems: 'start', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: '1rem',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '1.5rem',
                        flexShrink: 0,
                      }}>
                        <FaCertificate />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 0.5rem', color: '#2d3748', fontSize: '1.25rem', lineHeight: 1.3 }}>
                          {cert.name}
                        </h3>
                        <p style={{ margin: 0, color: '#4a5568', fontWeight: 600 }}>
                          {cert.issuer}
                        </p>
                      </div>
                      {!cert.expirationDate && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.5rem 0.75rem',
                          background: '#c6f6d5',
                          color: '#22543d',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}>
                          <FaCheckCircle />
                          Valid
                        </div>
                      )}
                    </div>

                    {/* Date Information */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#718096', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        <FaCalendar />
                        <span>
                          Issued: {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      {cert.expirationDate && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#718096', fontSize: '0.875rem' }}>
                          <FaCalendar />
                          <span>
                            Expires: {new Date(cert.expirationDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Credential ID */}
                    {cert.credentialId && (
                      <div style={{
                        padding: '1rem',
                        background: '#f7fafc',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                      }}>
                        <span style={{ fontSize: '0.75rem', color: '#718096', textTransform: 'uppercase', fontWeight: 600 }}>
                          Credential ID
                        </span>
                        <p style={{ margin: '0.25rem 0 0', color: '#2d3748', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                          {cert.credentialId}
                        </p>
                      </div>
                    )}

                    {/* Description */}
                    {cert.description && (
                      <p style={{
                        color: '#4a5568',
                        fontSize: '0.875rem',
                        lineHeight: 1.6,
                        marginBottom: '1.5rem',
                      }}>
                        {cert.description}
                      </p>
                    )}

                    {/* Skills */}
                    {cert.skills && cert.skills.length > 0 && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h5 style={{ color: '#2d3748', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: 600 }}>
                          Skills Covered:
                        </h5>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {cert.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              style={{
                                padding: '0.5rem 0.75rem',
                                background: '#ebf8ff',
                                color: '#2c5282',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Credential URL */}
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.75rem 1.5rem',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          transition: 'transform 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        View Credential
                        <FaExternalLinkAlt style={{ fontSize: '0.75rem' }} />
                      </a>
                    )}
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

export default CertificationsPage;
