import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEnvelope, FaTrash, FaEye, FaReply, FaClock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { messageService } from '../../services/message.service';
import type { Message, MessageStatus } from '../../types';
import '../admin/AdminDashboard.css';

const formatDate = (value?: string | null) => {
  if (!value) return '—';
  try {
    const date = new Date(value);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (error) {
    return value;
  }
};

const getStatusConfig = (status: MessageStatus) => {
  switch (status) {
    case 'new':
      return { label: 'New', color: '#feebc8', text: '#7c2d12', icon: <FaExclamationCircle /> };
    case 'read':
      return { label: 'Read', color: '#e0e7ff', text: '#3730a3', icon: <FaEye /> };
    case 'in_progress':
      return { label: 'In Progress', color: '#dbeafe', text: '#1e3a8a', icon: <FaClock /> };
    case 'responded':
      return { label: 'Responded', color: '#c6f6d5', text: '#22543d', icon: <FaCheckCircle /> };
    case 'archived':
      return { label: 'Archived', color: '#e2e8f0', text: '#4a5568', icon: <FaCheckCircle /> };
    default:
      return { label: status, color: '#f7fafc', text: '#718096', icon: <FaEnvelope /> };
  }
};

const getTypeLabel = (type?: string) => {
  switch (type) {
    case 'proposal': return 'Proposal';
    case 'job': return 'Job Offer';
    case 'collaboration': return 'Collaboration';
    case 'feedback': return 'Feedback';
    case 'general': return 'General';
    default: return 'Other';
  }
};

const MessagesList: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, unknown> = {
        ordering: '-created_at',
        pageSize: 100,
      };

      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }

      const response = await messageService.getAllMessages(params);
      setMessages(response.results ?? []);
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      setDeletingId(id);
      await messageService.deleteMessage(id);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      toast.success('Message deleted successfully');
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast.error('Failed to delete message');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewMessage = (id: string) => {
    navigate(`/admin/messages/${id}`);
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <p style={{ textAlign: 'center', color: '#718096' }}>Loading messages...</p>
        </div>
      </div>
    );
  }

  const newCount = messages.filter(m => m.status === 'new').length;
  const inProgressCount = messages.filter(m => m.status === 'in_progress').length;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Messages</h1>
          <p style={{ margin: '0.5rem 0 0', color: '#718096', fontSize: '0.875rem' }}>
            {newCount > 0 && <span style={{ color: '#f59e0b', fontWeight: 600 }}>{newCount} new</span>}
            {newCount > 0 && inProgressCount > 0 && ' • '}
            {inProgressCount > 0 && <span>{inProgressCount} in progress</span>}
            {newCount === 0 && inProgressCount === 0 && 'All messages reviewed'}
          </p>
        </div>
        <div className="admin-actions" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '2px solid #e2e8f0',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            <option value="all">All Messages</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="in_progress">In Progress</option>
            <option value="responded">Responded</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="admin-card">
        {messages.length === 0 ? (
          <div className="empty-state">
            <FaEnvelope />
            <h3>No Messages Yet</h3>
            <p>
              {filterStatus === 'all'
                ? 'Messages from visitors will appear here.'
                : `No ${filterStatus} messages found.`}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Subject</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Received</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => {
                  const status = getStatusConfig(message.status);
                  const isUnread = message.status === 'new';
                  
                  return (
                    <tr
                      key={message.id}
                      style={{
                        background: isUnread ? '#fffbeb' : 'transparent',
                        fontWeight: isUnread ? 600 : 400,
                      }}
                    >
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong style={{ color: '#2d3748' }}>
                            {message.senderName ?? message.sender_name ?? 'Anonymous'}
                          </strong>
                          {message.senderEmail && (
                            <small style={{ color: '#718096', fontSize: '0.75rem' }}>
                              {message.senderEmail ?? message.sender_email}
                            </small>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ maxWidth: '300px' }}>
                          <div style={{ color: '#2d3748', marginBottom: '0.25rem' }}>
                            {message.subject}
                          </div>
                          <div
                            style={{
                              color: '#718096',
                              fontSize: '0.75rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {message.message.substring(0, 80)}
                            {message.message.length > 80 ? '...' : ''}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            padding: '0.25rem 0.75rem',
                            background: '#f7fafc',
                            color: '#4a5568',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                          }}
                        >
                          {getTypeLabel(message.messageType ?? message.message_type)}
                        </span>
                      </td>
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
                      <td style={{ whiteSpace: 'nowrap', color: '#718096', fontSize: '0.875rem' }}>
                        {formatDate(message.createdAt ?? message.created_at)}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => handleViewMessage(message.id)}
                            title="View & Respond"
                          >
                            {message.status === 'new' ? <FaEnvelope /> : <FaReply />}
                          </button>
                          <button
                            type="button"
                            className="btn-icon danger"
                            onClick={() => handleDelete(message.id)}
                            disabled={deletingId === message.id}
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

export default MessagesList;
