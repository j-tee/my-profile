import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaMapMarkerAlt, FaCertificate } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { educationService } from '../../services/education.service';
import type { Education } from '../../types';
import { PORTFOLIO_OWNER_PROFILE_ID } from '../../constants/index';
import '../admin/AdminDashboard.css';

const PAGE_SIZE = 10;

const formatDateRange = (start?: string, end?: string | null, current?: boolean) => {
  if (!start) {
    return '—';
  }

  try {
    const startLabel = new Date(start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (current) {
      return `${startLabel} — Present`;
    }

    if (!end) {
      return `${startLabel} — Unknown`;
    }

    const endLabel = new Date(end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return `${startLabel} — ${endLabel}`;
  } catch (error) {
    console.error('Failed to format education date range', error);
    return `${start ?? '—'} — ${end ?? 'Present'}`;
  }
};

const EducationList: React.FC = () => {
  const navigate = useNavigate();
  const profileId = useMemo(() => PORTFOLIO_OWNER_PROFILE_ID, []);

  const [educationRecords, setEducationRecords] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadEducation = async () => {
      if (!profileId) {
        toast.error('Missing portfolio profile. Please configure PORTFOLIO_OWNER_PROFILE_ID.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await educationService.getEducation(profileId, {
          page,
          pageSize: PAGE_SIZE,
          ordering: 'order',
        });

        setEducationRecords(response.results);
        setTotalCount(response.count ?? response.results.length);
        setTotalPages(
          response.totalPages ??
            Math.max(1, Math.ceil((response.count ?? response.results.length) / PAGE_SIZE))
        );
      } catch (error) {
        console.error('Failed to load education records:', error);
        toast.error('Failed to load education records. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadEducation();
  }, [page, profileId]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this education record?')) {
      return;
    }

    try {
      setDeleting(id);
      await educationService.deleteEducation(id);
      setEducationRecords((prev) => prev.filter((record) => record.id !== id));
      toast.success('Education record deleted successfully');
    } catch (error) {
      console.error('Failed to delete education record:', error);
      toast.error('Failed to delete education record');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <p style={{ textAlign: 'center', color: '#718096' }}>Loading education records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Education</h1>
        <div className="admin-actions">
          <button
            className="btn-admin btn-admin-primary"
            onClick={() => navigate('/admin/education/new')}
          >
            <FaPlus /> Add Education
          </button>
        </div>
      </div>

      <div className="admin-card">
        {educationRecords.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#718096' }}>
            No education records found. Click "Add Education" to create your first entry.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Qualification & Institution</th>
                  <th>Field of Study</th>
                  <th>Duration</th>
                  <th>Location</th>
                  <th>GPA / Grade</th>
                  <th>Certificates</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {educationRecords.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{record.degree ?? 'Untitled Qualification'}</div>
                      <div style={{ color: '#4a5568', fontSize: '0.85rem' }}>{record.institution}</div>
                    </td>
                    <td>{record.field_of_study ?? record.fieldOfStudy ?? '—'}</td>
                    <td style={{ minWidth: '180px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <FaCalendarAlt style={{ color: '#a0aec0' }} />
                        <span>
                          {formatDateRange(record.start_date, record.end_date, record.current)}
                        </span>
                      </div>
                    </td>
                    <td>
                      {record.location ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <FaMapMarkerAlt style={{ color: '#f56565' }} />
                          <span>{record.location}</span>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      {record.gpa ?? record.grade ?? (
                        <span style={{ color: '#a0aec0' }}>—</span>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '999px',
                          background: '#edf2f7',
                          fontSize: '0.85rem',
                        }}
                      >
                        <FaCertificate style={{ color: '#805ad5' }} />
                        {record.certificate_count ?? 0}
                      </span>
                    </td>
                    <td>{record.order ?? '—'}</td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/admin/education/${record.id}/edit`}
                          className="btn-icon"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          className="btn-icon danger"
                          title="Delete"
                          onClick={() => handleDelete(record.id)}
                          disabled={deleting === record.id}
                        >
                          {deleting === record.id ? '...' : <FaTrash />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="btn-admin btn-admin-secondary"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="btn-admin btn-admin-secondary"
          >
            Next
          </button>
        </div>
      )}

      <div className="admin-card">
        <p style={{ color: '#718096', fontSize: '0.875rem' }}>
          Showing {educationRecords.length} of {totalCount} education records
        </p>
      </div>
    </div>
  );
};

export default EducationList;
