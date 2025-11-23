import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaPlus, FaEdit, FaTrash, FaLink, FaCertificate } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { educationService } from '../../services/education.service';
import { certificationService } from '../../services/certification.service';
import type {
  CreateEducationDTO,
  Education,
  Certification,
  CreateCertificationDTO,
} from '../../types';
import DateInput from '../../components/common/DateInput';
import '../admin/AdminDashboard.css';

type EducationFormState = CreateEducationDTO & { order?: number };
type CertificationFormState = {
  id?: string;
  name: string;
  issuer: string;
  credentialUrl?: string;
  credentialId?: string;
  issueDate?: string;
  expirationDate?: string;
  skillsText?: string;
  order?: number;
};

const DEFAULT_FORM: EducationFormState = {
  institution: '',
  degree: '',
  field_of_study: '',
  start_date: '',
  end_date: '',
  current: false,
  location: '',
  gpa: '',
  grade: '',
  description: '',
  activities: [],
  achievements: [],
  relevant_courses: [],
  order: undefined,
};

const DEFAULT_CERTIFICATION_FORM: CertificationFormState = {
  name: '',
  issuer: '',
  credentialUrl: '',
  credentialId: '',
  issueDate: '',
  expirationDate: '',
  skillsText: '',
  order: undefined,
};

const EducationForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<EducationFormState>({ ...DEFAULT_FORM });
  const [loading, setLoading] = useState(false);
  const [loadingEducation, setLoadingEducation] = useState(isEdit);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loadingCertifications, setLoadingCertifications] = useState(false);
  const [certificationForm, setCertificationForm] = useState<CertificationFormState | null>(null);
  const [certificationSaving, setCertificationSaving] = useState(false);
  const [certificationDeleting, setCertificationDeleting] = useState<string | null>(null);

  useEffect(() => {
    const loadEducation = async (educationId: string) => {
      try {
        setLoadingEducation(true);
        const education = await educationService.getEducationById(educationId);
        populateForm(education);
      } catch (error) {
        console.error('Failed to load education record:', error);
        toast.error('Failed to load education record');
        navigate('/admin/education');
      } finally {
        setLoadingEducation(false);
      }
    };

    if (isEdit && id) {
      loadEducation(id);
    }
  }, [id, isEdit, navigate]);

  const populateForm = (education: Education) => {
    setFormData({
      institution: education.institution ?? '',
      degree: education.degree ?? '',
      field_of_study: education.field_of_study ?? education.fieldOfStudy ?? '',
      start_date: education.start_date ?? education.startDate ?? '',
      end_date: education.end_date ?? education.endDate ?? '',
      current: Boolean(education.current),
      location: education.location ?? '',
      gpa: education.gpa ?? '',
      grade: education.grade ?? '',
      description: education.description ?? '',
      activities: education.activities ?? [],
      achievements: education.achievements ?? [],
      relevant_courses: education.relevant_courses ?? [],
      order: education.order ?? undefined,
    });
    setCertifications(education.certifications ?? []);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;

    if (type === 'checkbox' && 'checked' in event.target) {
      const { checked } = event.target;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
        ...(name === 'current' && checked ? { end_date: '' } : {}),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const parsedValue = value === '' ? undefined : Number(value);
    setFormData((prev) => ({
      ...prev,
      [name]: Number.isNaN(parsedValue) ? undefined : parsedValue,
    }));
  };

  const handleArrayChange = (
    field: 'achievements' | 'relevant_courses' | 'activities',
    value: string
  ) => {
    const entries = value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    setFormData((prev) => ({
      ...prev,
      [field]: entries,
    }));
  };

  const refreshCertifications = async (educationId: string) => {
    try {
      setLoadingCertifications(true);
      const response = await certificationService.getCertifications({
        education: educationId,
        pageSize: 50,
        ordering: 'order',
      });
      setCertifications(response.results);
    } catch (error) {
      console.error('Failed to load certifications:', error);
      toast.error('Failed to load certifications. Please try again later.');
    } finally {
      setLoadingCertifications(false);
    }
  };

  const startCreateCertification = () => {
    setCertificationForm({ ...DEFAULT_CERTIFICATION_FORM });
  };

  const startEditCertification = (certification: Certification) => {
    setCertificationForm({
      id: certification.id,
      name: certification.name ?? '',
      issuer: certification.issuer ?? '',
      credentialUrl: certification.credentialUrl ?? certification.credential_url ?? undefined,
      credentialId: certification.credentialId ?? certification.credential_id ?? undefined,
      issueDate: certification.issueDate ?? certification.issue_date ?? undefined,
      expirationDate: certification.expirationDate ?? certification.expiration_date ?? undefined,
      skillsText: (certification.skills ?? []).join('\n'),
      order: certification.order ?? undefined,
    });
  };

  const handleCertificationInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!certificationForm) {
      return;
    }

    const { name, value, type } = event.target;
    if (type === 'number') {
      const parsedValue = value === '' ? undefined : Number(value);
      setCertificationForm((prev) =>
        prev ? { ...prev, [name]: Number.isNaN(parsedValue) ? undefined : parsedValue } : prev
      );
      return;
    }

    setCertificationForm((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const cancelCertificationForm = () => {
    setCertificationForm(null);
  };

  const handleCertificationSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!certificationForm || !id) {
      return;
    }

    if (!certificationForm.name.trim() || !certificationForm.issuer.trim()) {
      toast.error('Certificate title and issuer are required.');
      return;
    }

    if (!certificationForm.issueDate) {
      toast.error('Issued date is required.');
      return;
    }

    const skills = (certificationForm.skillsText ?? '')
      .split('\n')
      .map((skill) => skill.trim())
      .filter(Boolean);

    const payload: CreateCertificationDTO = {
      education: id,
      name: certificationForm.name.trim(),
      issuer: certificationForm.issuer.trim(),
      issueDate: certificationForm.issueDate,
      expirationDate: certificationForm.expirationDate ? certificationForm.expirationDate : null,
      credentialId: certificationForm.credentialId?.trim() || null,
      credentialUrl: certificationForm.credentialUrl?.trim() || null,
      skills,
      order: certificationForm.order,
    };

    setCertificationSaving(true);
    try {
      if (certificationForm.id) {
        await certificationService.updateCertification(certificationForm.id, payload);
        toast.success('Certificate updated successfully');
      } else {
        await certificationService.createCertification(payload);
        toast.success('Certificate added successfully');
      }
      await refreshCertifications(id);
      setCertificationForm(null);
    } catch (error) {
      console.error('Failed to save certificate:', error);
      toast.error('Failed to save certificate. Please try again.');
    } finally {
      setCertificationSaving(false);
    }
  };

  const handleDeleteCertification = async (certificateId?: string) => {
    if (!id || !certificateId) {
      return;
    }
    if (!window.confirm('Are you sure you want to delete this certificate?')) {
      return;
    }

    try {
      setCertificationDeleting(certificateId);
      await certificationService.deleteCertification(certificateId);
      toast.success('Certificate deleted successfully');
      await refreshCertifications(id);
    } catch (error) {
      console.error('Failed to delete certificate:', error);
      toast.error('Failed to delete certificate.');
    } finally {
      setCertificationDeleting(null);
    }
  };

  const buildPayload = (): EducationFormState => {
    const achievements = (formData.achievements ?? []).filter(Boolean);
    const relevantCourses = (formData.relevant_courses ?? []).filter(Boolean);
    const activities = (formData.activities ?? []).filter(Boolean);

    return {
      ...formData,
      field_of_study: formData.field_of_study || '',
      achievements,
      relevant_courses: relevantCourses,
      activities,
      end_date: formData.current ? undefined : formData.end_date,
      gpa: formData.gpa?.trim() ? formData.gpa : undefined,
      grade: formData.grade?.trim() ? formData.grade : undefined,
    };
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = buildPayload();

    if (!payload.institution || !payload.degree || !payload.field_of_study || !payload.start_date) {
      toast.error('Institution, degree, field of study, and start date are required.');
      return;
    }

    setLoading(true);
    try {
      if (isEdit && id) {
        await educationService.updateEducation(id, payload);
        toast.success('Education record updated successfully');
      } else {
        await educationService.createEducation(payload);
        toast.success('Education record created successfully');
      }
      navigate('/admin/education');
    } catch (error) {
      console.error('Failed to save education record:', error);
      toast.error('Failed to save education record. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingEducation) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <p style={{ textAlign: 'center', color: '#718096' }}>Loading education record...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>{isEdit ? 'Edit Education' : 'Add Education'}</h1>
        <div className="admin-actions">
          <button
            type="button"
            className="btn-admin btn-admin-secondary"
            onClick={() => navigate('/admin/education')}
          >
            <FaArrowLeft /> Back to Education
          </button>
        </div>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="institution">Institution *</label>
              <input
                id="institution"
                name="institution"
                type="text"
                value={formData.institution}
                onChange={handleInputChange}
                required
                placeholder="e.g. University of Ghana"
              />
            </div>

            <div className="form-group">
              <label htmlFor="degree">Qualification / Program *</label>
              <input
                id="degree"
                name="degree"
                type="text"
                value={formData.degree}
                onChange={handleInputChange}
                required
                placeholder="e.g. Diploma in UI Design"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="field_of_study">Field of Study *</label>
              <input
                id="field_of_study"
                name="field_of_study"
                type="text"
                value={formData.field_of_study}
                onChange={handleInputChange}
                required
                placeholder="e.g. Software Engineering"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location ?? ''}
                onChange={handleInputChange}
                placeholder="City, Country"
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
                placeholder={formData.current ? 'Current program' : 'Select end date'}
              />
              <label className="checkbox-inline" style={{ marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  name="current"
                  checked={formData.current}
                  onChange={handleInputChange}
                />
                Currently enrolled
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gpa">GPA</label>
              <input
                id="gpa"
                name="gpa"
                type="text"
                value={formData.gpa ?? ''}
                onChange={handleInputChange}
                placeholder="e.g. 3.8 / 4.0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="grade">Grade / Classification</label>
              <input
                id="grade"
                name="grade"
                type="text"
                value={formData.grade ?? ''}
                onChange={handleInputChange}
                placeholder="e.g. First Class"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Summary / Highlights</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description ?? ''}
              onChange={handleInputChange}
              placeholder="Share key learnings, subject focus, or notable accomplishments"
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
              <label htmlFor="relevant_courses">Relevant Courses (one per line)</label>
              <textarea
                id="relevant_courses"
                name="relevant_courses"
                rows={4}
                value={(formData.relevant_courses ?? []).join('\n')}
                onChange={(event) => handleArrayChange('relevant_courses', event.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="activities">Activities & Societies (one per line)</label>
            <textarea
              id="activities"
              name="activities"
              rows={3}
              value={(formData.activities ?? []).join('\n')}
              onChange={(event) => handleArrayChange('activities', event.target.value)}
            />
          </div>

          <div className="button-group">
            <button
              type="button"
              className="btn-admin btn-admin-secondary"
              onClick={() => navigate('/admin/education')}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-admin btn-admin-primary" disabled={loading}>
              <FaSave /> {loading ? 'Saving...' : isEdit ? 'Update Education' : 'Create Education'}
            </button>
          </div>
        </form>
      </div>

      {isEdit ? (
        <div className="admin-card">
          <div className="admin-header" style={{ padding: 0, marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaCertificate /> Certificates
            </h2>
            <div className="admin-actions">
              <button
                type="button"
                className="btn-admin btn-admin-primary"
                onClick={startCreateCertification}
              >
                <FaPlus /> Add Certificate
              </button>
            </div>
          </div>

          {loadingCertifications ? (
            <p style={{ textAlign: 'center', color: '#718096' }}>Loading certificates...</p>
          ) : certifications.length === 0 ? (
            <p style={{ color: '#718096' }}>No certificates added yet.</p>
          ) : (
            <div className="certificate-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {certifications.map((certification) => (
                <div
                  key={certification.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1rem' }}>{certification.name}</div>
                    <div style={{ color: '#4a5568', fontSize: '0.9rem' }}>{certification.issuer}</div>
                    <div style={{ color: '#718096', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      {certification.issueDate ?? certification.issue_date
                        ? new Date(certification.issueDate ?? certification.issue_date ?? '').toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Issued date not set'}
                      {typeof certification.order === 'number' && (
                        <span style={{ marginLeft: '0.75rem' }}>Order: {certification.order}</span>
                      )}
                    </div>
                    {(certification.skills ?? []).length > 0 && (
                      <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {(certification.skills ?? []).map((skill) => (
                          <span
                            key={`${certification.id}-${skill}`}
                            style={{
                              background: '#edf2f7',
                              color: '#4a5568',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {(certification.credentialUrl ?? certification.credential_url) && (
                      <a
                        href={certification.credentialUrl ?? certification.credential_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-admin btn-admin-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <FaLink /> View Credential
                      </a>
                    )}
                    <button
                      type="button"
                      className="btn-admin btn-admin-secondary"
                      onClick={() => startEditCertification(certification)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      type="button"
                      className="btn-admin btn-admin-secondary danger"
                      onClick={() => handleDeleteCertification(certification.id)}
                      disabled={certificationDeleting === certification.id}
                    >
                      <FaTrash />
                      {certificationDeleting === certification.id ? ' Deleting...' : ' Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {certificationForm && (
            <form onSubmit={handleCertificationSubmit} className="admin-form" style={{ marginTop: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>
                {certificationForm.id ? 'Edit Certificate' : 'Add Certificate'}
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="certificate_title">Certificate Name *</label>
                  <input
                    id="certificate_title"
                    name="name"
                    type="text"
                    value={certificationForm.name}
                    onChange={handleCertificationInputChange}
                    required
                    placeholder="e.g. React Advanced Module"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="certificate_issuer">Issuer *</label>
                  <input
                    id="certificate_issuer"
                    name="issuer"
                    type="text"
                    value={certificationForm.issuer}
                    onChange={handleCertificationInputChange}
                    required
                    placeholder="e.g. Microverse"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="certificate_credential_id">Credential ID</label>
                  <input
                    id="certificate_credential_id"
                    name="credentialId"
                    type="text"
                    value={certificationForm.credentialId ?? ''}
                    onChange={handleCertificationInputChange}
                    placeholder="e.g. ABCD-12345"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="certificate_credential_url">Credential URL</label>
                  <input
                    id="certificate_credential_url"
                    name="credentialUrl"
                    type="url"
                    value={certificationForm.credentialUrl ?? ''}
                    onChange={handleCertificationInputChange}
                    placeholder="https://..."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="certificate_issued_date">Issued Date</label>
                  <input
                    id="certificate_issued_date"
                    name="issueDate"
                    type="date"
                    value={certificationForm.issueDate ?? ''}
                    onChange={handleCertificationInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="certificate_expiration_date">Expiration Date</label>
                  <input
                    id="certificate_expiration_date"
                    name="expirationDate"
                    type="date"
                    value={certificationForm.expirationDate ?? ''}
                    onChange={handleCertificationInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="certificate_skills">Skills / Focus Areas (one per line)</label>
                  <textarea
                    id="certificate_skills"
                    name="skillsText"
                    rows={3}
                    value={certificationForm.skillsText ?? ''}
                    onChange={(event) =>
                      setCertificationForm((prev) => (prev ? { ...prev, skillsText: event.target.value } : prev))
                    }
                    placeholder="e.g. User Research\nInteraction Design"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="certificate_order">Order</label>
                  <input
                    id="certificate_order"
                    name="order"
                    type="number"
                    min={0}
                    value={certificationForm.order ?? ''}
                    onChange={handleCertificationInputChange}
                    placeholder="Lower numbers appear first"
                  />
                </div>
              </div>

              <div className="button-group">
                <button
                  type="button"
                  className="btn-admin btn-admin-secondary"
                  onClick={cancelCertificationForm}
                  disabled={certificationSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-admin btn-admin-primary"
                  disabled={certificationSaving}
                >
                  <FaSave /> {certificationSaving ? 'Saving...' : certificationForm.id ? 'Update Certificate' : 'Add Certificate'}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="admin-card">
          <h2>Certificates</h2>
          <p style={{ color: '#718096' }}>
            Save this education record first, then reopen it to attach certificates such as module completions or program badges.
          </p>
        </div>
      )}
    </div>
  );
};

export default EducationForm;
