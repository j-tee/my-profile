import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaCode, FaTools, FaComments } from 'react-icons/fa';
import { skillService } from '../services/skill.service';
import type { Skill } from '../types/skill.types';
import './HomePage.css';

const SkillsPage = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await skillService.getSkills();
      setSkills(data.results);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group skills by category
  const categories = ['All', ...Array.from(new Set(skills.map(skill => skill.category)))];
  
  const filteredSkills = selectedCategory === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('technical') || lowerCategory.includes('programming')) return <FaCode />;
    if (lowerCategory.includes('tool') || lowerCategory.includes('framework')) return <FaTools />;
    if (lowerCategory.includes('soft') || lowerCategory.includes('communication')) return <FaComments />;
    return <FaStar />;
  };

  const getProficiencyColor = (level: string) => {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel === 'expert' || lowerLevel === 'advanced') return '#48bb78';
    if (lowerLevel === 'intermediate') return '#4299e1';
    return '#ed8936';
  };

  const getProficiencyWidth = (level: string) => {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel === 'expert') return '100%';
    if (lowerLevel === 'advanced') return '85%';
    if (lowerLevel === 'intermediate') return '70%';
    return '50%';
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#718096' }}>Loading skills...</p>
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
            <h1 className="section-title">Skills & Expertise</h1>
            <p style={{ textAlign: 'center', color: '#718096', marginBottom: '3rem' }}>
              My technical abilities and professional competencies
            </p>

            {/* Category Filter */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: selectedCategory === category ? '#48bb78' : '#f7fafc',
                    color: selectedCategory === category ? 'white' : '#4a5568',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '1rem',
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            {filteredSkills.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#718096', padding: '3rem' }}>
                No skills found in this category
              </p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '2rem',
                maxWidth: '1200px',
                margin: '0 auto',
              }}>
                {filteredSkills.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      border: '1px solid #e2e8f0',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    }}
                    whileHover={{ transform: 'translateY(-4px)', boxShadow: '0 8px 12px rgba(0,0,0,0.15)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{
                        fontSize: '1.5rem',
                        color: getProficiencyColor(skill.proficiency_level),
                        background: `${getProficiencyColor(skill.proficiency_level)}20`,
                        padding: '0.75rem',
                        borderRadius: '8px',
                      }}>
                        {getCategoryIcon(skill.category)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, color: '#2d3748', fontSize: '1.25rem' }}>
                          {skill.name}
                        </h3>
                        <p style={{ margin: '0.25rem 0 0', color: '#718096', fontSize: '0.875rem' }}>
                          {skill.category}
                        </p>
                      </div>
                    </div>

                    {/* Proficiency Level */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: '#4a5568', fontWeight: 600 }}>
                          Proficiency
                        </span>
                        <span style={{ fontSize: '0.875rem', color: getProficiencyColor(skill.proficiency_level), fontWeight: 600 }}>
                          {skill.proficiency_level}
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        background: '#e2e8f0',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: getProficiencyWidth(skill.proficiency_level) }}
                          transition={{ duration: 0.8, delay: index * 0.05 + 0.2 }}
                          style={{
                            height: '100%',
                            background: getProficiencyColor(skill.proficiency_level),
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    {skill.description && (
                      <p style={{
                        color: '#4a5568',
                        fontSize: '0.875rem',
                        lineHeight: 1.6,
                        marginBottom: '1rem',
                      }}>
                        {skill.description}
                      </p>
                    )}

                    {/* Years of Experience */}
                    {skill.years_of_experience && (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: '#f7fafc',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        color: '#4a5568',
                        fontWeight: 500,
                      }}>
                        <FaStar style={{ color: '#f6ad55' }} />
                        {skill.years_of_experience} {skill.years_of_experience === 1 ? 'year' : 'years'} of experience
                      </div>
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

export default SkillsPage;
