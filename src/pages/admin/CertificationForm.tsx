import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { certificationService } from '../../services/certification.service';
import { educationService } from '../../services/education.service';
import { PORTFOLIO_OWNER_PROFILE_ID } from '../../constants/index';
import type { Certification, CreateCertificationDTO } from '../../types';
import SelectField, { type SelectOption } from '../../components/common/SelectField';
import DateInput from '../../components/common/DateInput';
import '../admin/AdminDashboard.css';

type CertificationFormState = {
  education: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  skillsText: string;
  order?: number;
  isActive: boolean;
};

const DEFAULT_FORM: CertificationFormState = {
  education: '',
  name: '',
  issuer: '',
  issueDate: '',
  expirationDate: '',
  credentialId: '',
  credentialUrl: '',
  description: '',
  skillsText: '',
  order: undefined,
  isActive: true,
};

const CertificationForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const profileId = useMemo(() => PORTFOLIO_OWNER_PROFILE_ID, []);

  const [formData, setFormData] = useState<CertificationFormState>({ ...DEFAULT_FORM });
  const [loading, setLoading] = useState(false);
  const [loadingCertification, setLoadingCertification] = useState(isEdit);
  const [educationOptions, setEducationOptions] = useState<SelectOption[]>([]);
  const [loadingEducation, setLoadingEducation] = useState(true);

  useEffect(() => {
    const loadEducationOptions = async () => {
      if (!profileId) {
        toast.error('Missing portfolio profile configuration.');
        setLoadingEducation(false);
        return;
      }

      try {
        const response = await educationService.getEducation(profileId, {
          pageSize: 100,
          ordering: 'order,-start_date',
        });
        const options = (response.results ?? [])
          .filter((education) => Boolean(education.id))
          .map((education) => ({
            value: education.id as string,
            label: `${education.degree || 'Qualification'} · ${education.institution ?? 'Institution'}`,
          }));
        setEducationOptions(options);
      } catch (error) {
        console.error('Failed to load education options:', error);
        toast.error('Failed to load education options.');
      } finally {
        setLoadingEducation(false);
      }
    };

    loadEducationOptions();
  }, [profileId]);

  useEffect(() => {
    if (!isEdit || !id) {
      setLoadingCertification(false);
      return;
    }

    const loadCertification = async () => {
      try {
        setLoadingCertification(true);
        const certification = await certificationService.getCertificationById(id);
        populateForm(certification);
      } catch (error) {
        console.error('Failed to load certification:', error);
        toast.error('Failed to load certification');
        navigate('/admin/certifications');
      } finally {
        setLoadingCertification(false);
      }
    };

    loadCertification();
  }, [id, isEdit, navigate]);

  const populateForm = (certification: Certification) => {
    setFormData({
      education: certification.education ?? '',
      name: certification.name ?? '',
      issuer: certification.issuer ?? '',
      issueDate: certification.issueDate ?? certification.issue_date ?? '',
      expirationDate: certification.expirationDate ?? certification.expiration_date ?? '',
      credentialId: certification.credentialId ?? certification.credential_id ?? '',
      credentialUrl: certification.credentialUrl ?? certification.credential_url ?? '',
      description: certification.description ?? '',
      skillsText: (certification.skills ?? []).join('\n'),
      order: certification.order ?? undefined,
      isActive: certification.isActive ?? certification.is_active ?? true,
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = event.target as HTMLInputElement;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const parsedValue = value === '' ? undefined : Number(value);
    setFormData((prev) => ({
      ...prev,
      [name]: Number.isNaN(parsedValue) ? undefined : parsedValue,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.education) {
      toast.error('Please select the related education record.');
      return;
    }

    if (!formData.name.trim() || !formData.issuer.trim()) {
      toast.error('Certification name and issuer are required.');
      return;
    }

    if (!formData.issueDate) {
      toast.error('Issued date is required.');
      return;
    }

    const skills = formData.skillsText
      .split('\n')
      .map((skill) => skill.trim())
      .filter(Boolean);

    const payload: CreateCertificationDTO = {
      education: formData.education,
      name: formData.name.trim(),
      issuer: formData.issuer.trim(),
      issueDate: formData.issueDate,
      expirationDate: formData.expirationDate ? formData.expirationDate : null,
      credentialId: formData.credentialId?.trim() || undefined,
      credentialUrl: formData.credentialUrl?.trim() || undefined,
      description: formData.description?.trim() || undefined,
      skills,
      order: formData.order,
      isActive: formData.isActive,
    };

    setLoading(true);
    try {
      if (isEdit && id) {
        await certificationService.updateCertification(id, payload);
        toast.success('Certification updated successfully');
      } else {
        await certificationService.createCertification(payload);
        toast.success('Certification created successfully');
      }
      navigate('/admin/certifications');
    } catch (error) {
      console.error('Failed to save certification:', error);
      toast.error('Failed to save certification. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingCertification) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <p style={{ textAlign: 'center', color: '#718096' }}>Loading certification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>{isEdit ? 'Edit Certification' : 'Add Certification'}</h1>
        <div className="admin-actions">
          <button
            type="button"
            className="btn-admin btn-admin-secondary"
            onClick={() => navigate('/admin/certifications')}
          >
            <FaArrowLeft /> Back to Certifications
          </button>
        </div>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <SelectField
              id="education"
              name="education"
              label="Education Record *"
              value={formData.education}
              options={educationOptions}
              onChange={(selectedValue) =>
                setFormData((prev) => ({ ...prev, education: selectedValue }))
              }
              placeholder={loadingEducation ? 'Loading education records...' : 'Select education record'}
              isDisabled={loadingEducation}
            />
            <div className="form-group">
              <label htmlFor="name">Certification Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g. UX Research & Strategy"
              />
            </div>
            <div className="form-group">
              <label htmlFor="issuer">Issuer *</label>
              <input
                id="issuer"
                name="issuer"
                type="text"
                value={formData.issuer}
                onChange={handleInputChange}
                required
                placeholder="e.g. Coursera"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <DateInput
                id="issueDate"
                name="issueDate"
                label="Issued Date *"
                value={formData.issueDate}
                onChange={(value) => setFormData((prev) => ({ ...prev, issueDate: value }))}
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <DateInput
                id="expirationDate"
                name="expirationDate"
                label="Expiration Date"
                value={formData.expirationDate ?? ''}
                onChange={(value) => setFormData((prev) => ({ ...prev, expirationDate: value }))}
              />
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="credentialId">Credential ID</label>
              <input
                id="credentialId"
                name="credentialId"
                type="text"
                value={formData.credentialId ?? ''}
                onChange={handleInputChange}
                placeholder="e.g. ABCD-12345"
              />
            </div>
            <div className="form-group">
              <label htmlFor="credentialUrl">Credential URL</label>
              <input
                id="credentialUrl"
                name="credentialUrl"
                type="url"
                value={formData.credentialUrl ?? ''}
                onChange={handleInputChange}
                placeholder="https://..."
              />
            </div>
            <div className="form-group" style={{ alignSelf: 'flex-end' }}>
              <label className="checkbox-label" htmlFor="isActive">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                Active / Show on site
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description ?? ''}
              onChange={handleInputChange}
              placeholder="Short summary of what the certification covered"
            />
          </div>

          <div className="form-group">
            <label htmlFor="skillsText">Skills / Focus Areas (one per line)</label>
            <textarea
              id="skillsText"
              name="skillsText"
              rows={3}
              value={formData.skillsText}
              onChange={handleInputChange}
              placeholder="e.g. Wireframing\nInteraction Design"
            />
          </div>

          <div className="button-group">
            <button
              type="button"
              className="btn-admin btn-admin-secondary"
              onClick={() => navigate('/admin/certifications')}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-admin btn-admin-primary" disabled={loading}>
              <FaSave /> {loading ? 'Saving...' : isEdit ? 'Update Certification' : 'Create Certification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificationForm;
