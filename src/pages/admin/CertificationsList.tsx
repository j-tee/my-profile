import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaCertificate, FaLink, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { certificationService } from '../../services/certification.service';
import { PORTFOLIO_OWNER_PROFILE_ID } from '../../constants/index';
import type { Certification } from '../../types';
import '../admin/AdminDashboard.css';

const formatDate = (value?: string | null) => {
  if (!value) {
    return '—';
  }
  try {
    return new Date(value).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch (error) {
    console.warn('Failed to format date', value, error);
    return value;
  }
};

const computeStatus = (certification: Certification) => {
  const expirationValue = certification.expirationDate ?? certification.expiration_date;
  if (certification.isActive === false) {
    return { label: 'Inactive', color: '#fed7d7', text: '#822727', icon: <FaTimesCircle /> };
  }
  if (expirationValue) {
    const expiration = new Date(expirationValue);
    if (Number.isFinite(expiration.getTime()) && expiration < new Date()) {
      return { label: 'Expired', color: '#fefcbf', text: '#744210', icon: <FaTimesCircle /> };
    }
  }
  return { label: 'Active', color: '#c6f6d5', text: '#22543d', icon: <FaCheckCircle /> };
};

const CertificationsList: React.FC = () => {
  const profileId = useMemo(() => PORTFOLIO_OWNER_PROFILE_ID, []);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadCertifications = useCallback(async () => {
    if (!profileId) {
      toast.error('Missing portfolio profile ID configuration.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await certificationService.getCertificationsForProfile(profileId, {
        ordering: 'order,-issue_date',
        pageSize: 100,
      });
      setCertifications(response.results ?? []);
    } catch (error) {
      console.error('Failed to load certifications:', error);
      toast.error('Failed to load certifications. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    loadCertifications();
  }, [loadCertifications]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this certification?')) {
      return;
    }

    try {
      setDeletingId(id);
      await certificationService.deleteCertification(id);
      setCertifications((prev) => prev.filter((cert) => cert.id !== id));
      toast.success('Certification deleted successfully');
    } catch (error) {
      console.error('Failed to delete certification:', error);
      toast.error('Failed to delete certification');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <p style={{ textAlign: 'center', color: '#718096' }}>Loading certifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Certifications</h1>
        <div className="admin-actions">
          <Link to="/admin/certifications/new" className="btn-admin btn-admin-primary">
            <FaPlus /> Add Certification
          </Link>
        </div>
      </div>

      <div className="admin-card">
        {certifications.length === 0 ? (
          <div className="empty-state">
            <FaCertificate />
            <h3>No Certifications Yet</h3>
            <p>Link certifications to your education history to showcase achievements.</p>
            <Link to="/admin/certifications/new" className="btn-admin btn-admin-primary">
              <FaPlus /> Add Certification
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Certification</th>
                  <th>Issuer</th>
                  <th>Education Link</th>
                  <th>Issued</th>
                  <th>Expires</th>
                  <th>Status</th>
                  <th>Credential</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {certifications.map((cert) => {
                  const status = computeStatus(cert);
                  return (
                    <tr key={cert.id}>
                      <td>
                        <strong>{cert.name}</strong>
                        {typeof cert.order === 'number' && (
                          <span style={{ marginLeft: '0.5rem', color: '#718096', fontSize: '0.75rem' }}>
                            #{cert.order}
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span>{cert.issuer}</span>
                          {cert.issuer_display && (
                            <small style={{ color: '#718096' }}>{cert.issuer_display}</small>
                          )}
                        </div>
                      </td>
                      <td>
                        {cert.education_display ?? cert.educationDisplay ?? (
                          <span style={{ color: '#a0aec0' }}>Unlinked</span>
                        )}
                      </td>
                      <td>{formatDate(cert.issueDate ?? cert.issue_date)}</td>
                      <td>{formatDate(cert.expirationDate ?? cert.expiration_date)}</td>
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: status.color,
                            color: status.text,
                          }}
                        >
                          {status.icon} {status.label}
                        </span>
                      </td>
                      <td>
                        {(cert.credentialUrl ?? cert.credential_url) ? (
                          <a
                            href={cert.credentialUrl ?? cert.credential_url ?? undefined}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-admin btn-admin-secondary"
                            style={{ padding: '0.35rem 0.75rem', display: 'inline-flex', gap: '0.35rem', alignItems: 'center' }}
                          >
                            <FaLink /> View
                          </a>
                        ) : (
                          <span style={{ color: '#a0aec0' }}>—</span>
                        )}
                      </td>
                      <td>
                        <div className="table-actions">
                          <Link
                            to={`/admin/certifications/${cert.id}/edit`}
                            className="btn-icon"
                            title="Edit"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            type="button"
                            className="btn-icon danger"
                            onClick={() => handleDelete(cert.id)}
                            disabled={deletingId === cert.id}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationsList;
