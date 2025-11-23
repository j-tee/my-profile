import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { experienceService } from '../../services/experience.service';
import type {
  CreateExperienceDTO,
  EmploymentType,
  Experience,
  LocationType,
} from '../../types/experience.types';
import SelectField from '../../components/common/SelectField';
import DateInput from '../../components/common/DateInput';
import '../admin/AdminDashboard.css';

const EMPLOYMENT_OPTIONS: { value: EmploymentType; label: string }[] = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
];

const LOCATION_OPTIONS: { value: LocationType; label: string }[] = [
  { value: 'on_site', label: 'On-site' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
];

const defaultForm: CreateExperienceDTO = {
  position: '',
  title: '',
  company: '',
  employmentType: 'full_time',
  location: '',
  locationType: 'on_site',
  start_date: '',
  end_date: '',
  current: false,
  description: '',
  key_responsibilities: [],
  achievements: [],
  technologies: [],
  order: 1,
};

const ExperienceForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<CreateExperienceDTO>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [loadingExperience, setLoadingExperience] = useState(isEdit);

  useEffect(() => {
    const loadExperience = async (experienceId: string) => {
      try {
        setLoadingExperience(true);
        const experience = await experienceService.getExperienceById(experienceId);
        populateForm(experience);
      } catch (error) {
        console.error('Failed to load experience:', error);
        toast.error('Failed to load experience');
        navigate('/admin/experiences');
      } finally {
        setLoadingExperience(false);
      }
    };

    if (isEdit && id) {
      loadExperience(id);
    }
  }, [id, isEdit, navigate]);

  const populateForm = (experience: Experience) => {
    setFormData({
      position: experience.position ?? experience.title ?? '',
      title: experience.title ?? experience.position ?? '',
      company: experience.company ?? '',
      employmentType: experience.employment_type ?? experience.employmentType ?? 'full_time',
      location: experience.location ?? '',
      locationType: experience.location_type ?? experience.locationType ?? 'on_site',
      start_date: experience.start_date,
      end_date: experience.end_date ?? '',
      current: experience.current,
      description: experience.description ?? '',
      key_responsibilities:
        experience.key_responsibilities ?? experience.responsibilities ?? [],
      achievements: experience.achievements ?? [],
      technologies: experience.technologies ?? [],
      order: experience.order ?? undefined,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && 'checked' in e.target) {
      const { checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
        ...(name === 'current' && checked ? { end_date: '' } : {}),
      }));
      return;
    }

    if (name === 'position') {
      setFormData((prev) => ({
        ...prev,
        position: value,
        title: prev.title || value,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsed = value === '' ? undefined : Number(value);
    setFormData((prev) => ({
      ...prev,
      [name]: Number.isNaN(parsed) ? undefined : parsed,
    }));
  };

  const handleSelectChange = <K extends 'employmentType' | 'locationType'>(
    field: K,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === 'employmentType'
          ? (value as EmploymentType)
          : (value as LocationType),
    }));
  };

  const handleArrayChange = (field: keyof CreateExperienceDTO, value: string) => {
    const entries = value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    setFormData((prev) => ({
      ...prev,
      [field]: entries,
    }));
  };

  const buildPayload = (): CreateExperienceDTO => {
    const responsibilities = (formData.key_responsibilities ?? []).filter(Boolean);
    const achievements = (formData.achievements ?? []).filter(Boolean);
    const technologies = (formData.technologies ?? []).filter(Boolean);

    return {
      ...formData,
      title: formData.title || formData.position,
      position: formData.position || formData.title,
      key_responsibilities: responsibilities,
      achievements,
      technologies,
      end_date: formData.current ? undefined : formData.end_date,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = buildPayload();

    if (!payload.company || !payload.start_date || !payload.position) {
      toast.error('Position, company, and start date are required.');
      return;
    }

    setLoading(true);
    try {
      if (isEdit && id) {
        await experienceService.updateExperience(id, payload);
        toast.success('Experience updated successfully');
      } else {
        await experienceService.createExperience(payload);
        toast.success('Experience created successfully');
      }
      navigate('/admin/experiences');
    } catch (error) {
      console.error('Failed to save experience:', error);
      toast.error('Failed to save experience. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingExperience) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <p style={{ textAlign: 'center', color: '#718096' }}>Loading experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>{isEdit ? 'Edit Experience' : 'Add Experience'}</h1>
        <div className="admin-actions">
          <button
            type="button"
            className="btn-admin btn-admin-secondary"
            onClick={() => navigate('/admin/experiences')}
          >
            <FaArrowLeft /> Back to Experience
          </button>
        </div>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="position">Role / Position *</label>
              <input
                id="position"
                name="position"
                type="text"
                value={formData.position}
                onChange={handleInputChange}
                required
                placeholder="e.g. Senior Frontend Engineer"
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">Company *</label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleInputChange}
                required
                placeholder="Company name"
              />
            </div>
          </div>

          <div className="form-row">
            <SelectField
              id="employmentType"
              name="employmentType"
              label="Employment Type"
              value={formData.employmentType ?? 'full_time'}
              options={EMPLOYMENT_OPTIONS}
              onChange={(value) => handleSelectChange('employmentType', value)}
            />

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location ?? ''}
                onChange={handleInputChange}
                placeholder="e.g. Accra, Ghana"
              />
            </div>

            <SelectField
              id="locationType"
              name="locationType"
              label="Location Type"
              value={formData.locationType ?? 'on_site'}
              options={LOCATION_OPTIONS}
              onChange={(value) => handleSelectChange('locationType', value)}
            />
          </div>

          <div className="form-row">
            <DateInput
              id="start_date"
              name="start_date"
              label="Start Date *"
              value={formData.start_date}
              onChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  start_date: date,
                }))
              }
              required
              placeholder="Select start date"
            />

            <div className="form-group" style={{ position: 'relative' }}>
              <DateInput
                id="end_date"
                name="end_date"
                label="End Date"
                value={formData.end_date ?? ''}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    end_date: date,
                  }))
                }
                disabled={formData.current}
                required={!formData.current}
                placeholder={formData.current ? 'Current role' : 'Select end date'}
              />
              <label className="checkbox-inline" style={{ marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  name="current"
                  checked={formData.current}
                  onChange={handleInputChange}
                />
                Currently working here
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="order">Display Order</label>
              <input
                id="order"
                name="order"
                type="number"
                min={0}
                value={formData.order ?? ''}
                onChange={handleNumberChange}
                placeholder="Lower numbers appear first"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Summary / Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description ?? ''}
              onChange={handleInputChange}
              placeholder="Highlight impact, scope, and outcomes"
            />
          </div>

          <div className="form-group">
            <label htmlFor="key_responsibilities">Key Responsibilities (one per line)</label>
            <textarea
              id="key_responsibilities"
              name="key_responsibilities"
              rows={4}
              value={(formData.key_responsibilities ?? []).join('\n')}
              onChange={(event) => handleArrayChange('key_responsibilities', event.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="achievements">Achievements (one per line)</label>
              <textarea
                id="achievements"
                name="achievements"
                rows={4}
                value={(formData.achievements ?? []).join('\n')}
                onChange={(event) => handleArrayChange('achievements', event.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="technologies">Technologies (one per line)</label>
              <textarea
                id="technologies"
                name="technologies"
                rows={4}
                value={(formData.technologies ?? []).join('\n')}
                onChange={(event) => handleArrayChange('technologies', event.target.value)}
              />
            </div>
          </div>

          <div className="button-group">
            <button
              type="button"
              className="btn-admin btn-admin-secondary"
              onClick={() => navigate('/admin/experiences')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-admin btn-admin-primary"
              disabled={loading}
            >
              <FaSave /> {loading ? 'Saving…' : isEdit ? 'Update Experience' : 'Create Experience'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExperienceForm;
