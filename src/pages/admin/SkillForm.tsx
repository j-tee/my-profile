import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { skillService } from '../../services/skill.service';
import type { SkillCategory, ProficiencyLevel, CreateSkillDTO } from '../../types';
import SelectField from '../../components/common/SelectField';
import '../admin/AdminDashboard.css';

const CATEGORY_OPTIONS: { value: SkillCategory; label: string }[] = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'database', label: 'Database' },
  { value: 'devops', label: 'DevOps' },
  { value: 'cloud', label: 'Cloud' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'testing', label: 'Testing' },
  { value: 'tools', label: 'Tools' },
  { value: 'soft_skills', label: 'Soft Skills' },
  { value: 'other', label: 'Other' },
];

const PROFICIENCY_OPTIONS: { value: ProficiencyLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

const SkillForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<CreateSkillDTO>({
    name: '',
    category: 'frontend',
    proficiencyLevel: 'intermediate',
    yearsOfExperience: 1,
  });
  const [loading, setLoading] = useState(false);
  const [loadingSkill, setLoadingSkill] = useState(isEdit);

  useEffect(() => {
    const fetchSkill = async (skillId: string) => {
      try {
        setLoadingSkill(true);
        const skill = await skillService.getSkillById(skillId);
        setFormData({
          name: skill.name,
          category: skill.category,
          proficiencyLevel: skill.proficiencyLevel,
          yearsOfExperience: skill.yearsOfExperience,
        });
      } catch (error) {
        console.error('Failed to load skill:', error);
        toast.error('Failed to load skill');
        navigate('/admin/skills');
      } finally {
        setLoadingSkill(false);
      }
    };

    if (isEdit && id) {
      fetchSkill(id);
    }
  }, [id, isEdit, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'yearsOfExperience' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit && id) {
        await skillService.updateSkill(id, formData);
        toast.success('Skill updated successfully');
      } else {
        await skillService.createSkill(formData);
        toast.success('Skill created successfully');
      }
      navigate('/admin/skills');
    } catch (error) {
      console.error('Failed to save skill:', error);
      toast.error('Failed to save skill. Please check your inputs');
    } finally {
      setLoading(false);
    }
  };

  if (loadingSkill) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <p style={{ textAlign: 'center', color: '#718096' }}>Loading skill...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>{isEdit ? 'Edit Skill' : 'Add Skill'}</h1>
        <div className="admin-actions">
          <button
            type="button"
            className="btn-admin btn-admin-secondary"
            onClick={() => navigate('/admin/skills')}
          >
            <FaArrowLeft /> Back to Skills
          </button>
        </div>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="name">Skill Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. React, GraphQL, AWS"
            />
          </div>

          <div className="form-row">
            <SelectField
              id="category"
              name="category"
              label="Category *"
              value={formData.category}
              options={CATEGORY_OPTIONS}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value as SkillCategory }))
              }
            />

            <SelectField
              id="proficiencyLevel"
              name="proficiencyLevel"
              label="Proficiency *"
              value={formData.proficiencyLevel}
              options={PROFICIENCY_OPTIONS}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  proficiencyLevel: value as ProficiencyLevel,
                }))
              }
            />

            <div className="form-group">
              <label htmlFor="yearsOfExperience">Years of Experience *</label>
              <input
                id="yearsOfExperience"
                name="yearsOfExperience"
                type="number"
                min={0}
                step={0.5}
                value={formData.yearsOfExperience}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="button-group">
            <button
              type="button"
              className="btn-admin btn-admin-secondary"
              onClick={() => navigate('/admin/skills')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-admin btn-admin-primary"
              disabled={loading}
            >
              <FaSave /> {loading ? 'Saving...' : isEdit ? 'Update Skill' : 'Create Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillForm;
