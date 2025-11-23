import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { experienceService } from '../../services/experience.service';
import type { Experience } from '../../types';
import { PORTFOLIO_OWNER_PROFILE_ID } from '../../constants/index';
import '../admin/AdminDashboard.css';

const PAGE_SIZE = 10;

const formatDateRange = (start: string, end?: string | null, current?: boolean) => {
  if (!start) return '—';
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
    console.error('Failed to format date range', error);
    return `${start} — ${end ?? 'Present'}`;
  }
};

const ExperiencesList: React.FC = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const profileId = useMemo(() => PORTFOLIO_OWNER_PROFILE_ID, []);

  useEffect(() => {
    const loadExperiences = async () => {
      if (!profileId) {
        toast.error('Missing portfolio profile. Please configure PORTFOLIO_OWNER_PROFILE_ID.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await experienceService.getExperiences(profileId, {
          page,
          pageSize: PAGE_SIZE,
          ordering: 'order',
        });
        setExperiences(response.results);
        setTotalCount(response.count ?? response.results.length);
        setTotalPages(
          response.totalPages ?? Math.max(1, Math.ceil((response.count ?? 0) / PAGE_SIZE))
        );
      } catch (error) {
        console.error('Failed to load experiences:', error);
        toast.error('Failed to load experiences. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadExperiences();
  }, [page, profileId]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) {
      return;
    }

    try {
      setDeleting(id);
      await experienceService.deleteExperience(id);
      setExperiences((prev) => prev.filter((exp) => exp.id !== id));
      toast.success('Experience deleted successfully');
    } catch (error) {
      console.error('Failed to delete experience:', error);
      toast.error('Failed to delete experience');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <p style={{ textAlign: 'center', color: '#718096' }}>Loading experiences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Experience</h1>
        <div className="admin-actions">
          <button
            className="btn-admin btn-admin-primary"
            onClick={() => navigate('/admin/experiences/new')}
          >
            <FaPlus /> Add Experience
          </button>
        </div>
      </div>

      <div className="admin-card">
        {experiences.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#718096' }}>
            No experience records found. Click "Add Experience" to create your first entry.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Role & Company</th>
                  <th>Duration</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {experiences.map((exp) => (
                  <tr key={exp.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{exp.position ?? exp.title ?? 'Untitled Role'}</div>
                      <div style={{ color: '#4a5568', fontSize: '0.85rem' }}>{exp.company}</div>
                    </td>
                    <td style={{ minWidth: '180px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <FaCalendarAlt style={{ color: '#a0aec0' }} />
                        <span>{formatDateRange(exp.start_date, exp.end_date, exp.current)}</span>
                      </div>
                    </td>
                    <td>
                      {exp.location ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <FaMapMarkerAlt style={{ color: '#f56565' }} />
                          <span>{exp.location}</span>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>
                      {exp.employment_type?.replace('_', ' ') ?? '—'}
                    </td>
                    <td>{exp.order ?? '—'}</td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/admin/experiences/${exp.id}/edit`}
                          className="btn-icon"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          className="btn-icon danger"
                          title="Delete"
                          onClick={() => handleDelete(exp.id)}
                          disabled={deleting === exp.id}
                        >
                          {deleting === exp.id ? '…' : <FaTrash />}
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
          Showing {experiences.length} of {totalCount} experiences
        </p>
      </div>
    </div>
  );
};

export default ExperiencesList;
