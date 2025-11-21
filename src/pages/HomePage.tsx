import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowDown, FaCode, FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import type { User } from '../types';
import { userService } from '../services';
import { getPortfolioOwnerId } from '../utils/profileUtils';
import './HomePage.css';

const HomePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPortfolioOwner = async () => {
      try {
        // Fetch the portfolio owner's user ID dynamically, then get their data
        const ownerId = await getPortfolioOwnerId();
        const userData = await userService.get(ownerId);
        setUser(userData);
      } catch (err) {
        console.error('Failed to load portfolio owner data:', err);
        // Fallback to basic data if API fails
        setUser({
          id: '',
          email: 'portfolio@example.com',
          first_name: 'Julius',
          last_name: 'Tetteh',
          full_name: 'Julius Tetteh',
          phone: null,
          role: 'super_admin',
          is_verified: true,
          is_active: true,
          mfa_enabled: false,
          headline: 'Full Stack Developer',
          summary: 'Building exceptional digital experiences with cutting-edge technologies.',
          city: 'Accra',
          state: 'Greater Accra',
          country: 'Ghana',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };

    loadPortfolioOwner();
  }, []);

  // Helper to get social link URL by platform
  const getSocialLink = (platform: 'github' | 'linkedin' | 'twitter' | 'portfolio' | 'other') => {
    return user?.social_links?.find(link => link.platform === platform)?.url;
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-page">
      {/* Hero Banner Section */}
      <section className="hero-banner">
        <div className="hero-overlay"></div>
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="profile-image-container"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <div className="profile-image">
              {user?.profile_picture_url ? (
                <img src={user.profile_picture_url} alt={user.full_name || 'Profile'} />
              ) : (
                <div className="profile-placeholder">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
              )}
            </div>
          </motion.div>

          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {loading ? 'Loading...' : user?.headline || 'Full Stack Developer'}
          </motion.h1>

          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {user?.summary || 'Building exceptional digital experiences with cutting-edge technologies'}
          </motion.p>

          <motion.div 
            className="hero-cta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <button className="btn-primary" onClick={() => scrollToSection('contact')}>
              Get In Touch
            </button>
            <button className="btn-secondary" onClick={() => scrollToSection('projects')}>
              View Projects
            </button>
          </motion.div>

          <motion.div 
            className="social-links"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            {getSocialLink('github') && (
              <a href={getSocialLink('github')} target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaGithub />
              </a>
            )}
            {getSocialLink('linkedin') && (
              <a href={getSocialLink('linkedin')} target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaLinkedin />
              </a>
            )}
            {user?.email && (
              <a href={`mailto:${user.email}`} className="social-icon">
                <FaEnvelope />
              </a>
            )}
          </motion.div>

          <motion.div 
            className="scroll-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            onClick={() => scrollToSection('about')}
          >
            <FaArrowDown className="scroll-arrow" />
          </motion.div>
        </motion.div>

        {/* Animated Background Elements */}
        <div className="floating-elements">
          <div className="float-element element-1"></div>
          <div className="float-element element-2"></div>
          <div className="float-element element-3"></div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section about-section">
        <motion.div 
          className="container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">About Me</h2>
          <div className="about-content">
            <p className="about-text">
              {user?.summary || "I'm a passionate full-stack developer with expertise in building scalable web applications. With a strong foundation in both frontend and backend technologies, I create seamless digital experiences that solve real-world problems."}
            </p>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">5+</div>
                <div className="stat-label">Years Experience</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">50+</div>
                <div className="stat-label">Projects Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">30+</div>
                <div className="stat-label">Happy Clients</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="section services-section">
        <div className="container">
          <h2 className="section-title">What I Do</h2>
          <div className="services-grid">
            <motion.div 
              className="service-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="service-icon">
                <FaCode />
              </div>
              <h3>Web Development</h3>
              <p>Building responsive and performant web applications using modern frameworks and best practices.</p>
            </motion.div>

            <motion.div 
              className="service-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="service-icon">
                <FaBriefcase />
              </div>
              <h3>Backend Solutions</h3>
              <p>Designing and implementing robust backend systems with RESTful APIs and database optimization.</p>
            </motion.div>

            <motion.div 
              className="service-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="service-icon">
                <FaGraduationCap />
              </div>
              <h3>Technical Consulting</h3>
              <p>Providing expert guidance on architecture, technology stack selection, and best practices.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="section tech-section">
        <motion.div 
          className="container"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Technologies I Work With</h2>
          <div className="tech-grid">
            {['React', 'TypeScript', 'Node.js', 'Python', 'Django', 'PostgreSQL', 'AWS', 'Docker'].map((tech, index) => (
              <motion.div 
                key={tech}
                className="tech-badge"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="section cta-section">
        <motion.div 
          className="container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="cta-title">Let's Work Together</h2>
          <p className="cta-text">
            Have a project in mind? Let's discuss how I can help bring your ideas to life.
          </p>
          <div className="cta-buttons">
            <button className="btn-primary btn-large">Start a Project</button>
            <button className="btn-outline btn-large">Download Resume</button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
