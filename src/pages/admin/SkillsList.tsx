import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { skillService } from '../../services/skill.service';
import { useAuth } from '../../contexts/useAuth';
import type { Skill } from '../../types';
import '../admin/AdminDashboard.css';

const SkillsList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      toast.error('Unable to load skills. Please make sure you are logged in.');
      return;
    }

    const loadSkills = async () => {
      setLoading(true);
      try {
        const response = await skillService.getSkills(user.id, {
          page,
          pageSize: PAGE_SIZE,
        });
        setSkills(response.results);
        setTotalCount(response.count ?? response.results.length);
        setTotalPages(response.totalPages ?? Math.max(1, Math.ceil((response.count ?? 0) / PAGE_SIZE)));
      } catch (error) {
        console.error('Failed to load skills:', error);
        toast.error('Failed to load skills. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, [user?.id, page]);

  useEffect(() => {
    setPage(1);
  }, [user?.id]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    try {
      setDeleting(id);
      await skillService.deleteSkill(id);
      setSkills((prev) => prev.filter((skill) => skill.id !== id));
      toast.success('Skill deleted successfully');
    } catch (error) {
      console.error('Failed to delete skill:', error);
      toast.error('Failed to delete skill');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <p style={{ textAlign: 'center', color: '#718096' }}>Loading skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Skills</h1>
        <div className="admin-actions">
          <button
            className="btn-admin btn-admin-primary"
            onClick={() => navigate('/admin/skills/new')}
          >
            <FaPlus /> Add Skill
          </button>
        </div>
      </div>

      <div className="admin-card">
        {skills.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#718096' }}>
            No skills found. Click "Add Skill" to create your first skill.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Proficiency</th>
                  <th>Experience (years)</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((skill) => (
                  <tr key={skill.id}>
                    <td style={{ fontWeight: 600 }}>{skill.name}</td>
                    <td style={{ textTransform: 'capitalize' }}>{skill.category.replace('_', ' ')}</td>
                    <td style={{ textTransform: 'capitalize' }}>{skill.proficiencyLevel}</td>
                    <td>{skill.yearsOfExperience}</td>
                    <td>{skill.order ?? '-'}</td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/admin/skills/${skill.id}/edit`}
                          className="btn-icon"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          className="btn-icon danger"
                          title="Delete"
                          onClick={() => handleDelete(skill.id)}
                          disabled={deleting === skill.id}
                        >
                          {deleting === skill.id ? '...' : <FaTrash />}
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
          Showing {skills.length} of {totalCount} skills
        </p>
      </div>
    </div>
  );
};

export default SkillsList;
