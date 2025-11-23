import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaPaperPlane, FaUser, FaEnvelope, FaClock, FaTag, FaStickyNote } from 'react-icons/fa';
import { messageService } from '../../services/message.service';
import type { Message, MessageStatus } from '../../types';
import '../admin/AdminDashboard.css';

const MessageDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [status, setStatus] = useState<MessageStatus>('new');

  useEffect(() => {
    if (!id) {
      navigate('/admin/messages');
      return;
    }

    const loadMessage = async () => {
      try {
        setLoading(true);
        const data = await messageService.getMessageById(id);
        setMessage(data);
        setStatus(data.status);
        setAdminNotes(data.adminNotes ?? data.admin_notes ?? '');

        // Mark as read if it's new
        if (data.status === 'new') {
          await messageService.updateMessage(id, { status: 'read' });
          setStatus('read');
        }
      } catch (error) {
        console.error('Failed to load message:', error);
        toast.error('Failed to load message');
        navigate('/admin/messages');
      } finally {
        setLoading(false);
      }
    };

    loadMessage();
  }, [id, navigate]);

  const handleStatusChange = async (newStatus: MessageStatus) => {
    if (!id) return;

    try {
      setUpdating(true);
      await messageService.updateMessage(id, { status: newStatus });
      setStatus(newStatus);
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateNotes = async () => {
    if (!id) return;

    try {
      setUpdating(true);
      await messageService.updateMessage(id, { adminNotes });
      toast.success('Notes saved successfully');
    } catch (error) {
      console.error('Failed to save notes:', error);
      toast.error('Failed to save notes');
    } finally {
      setUpdating(false);
    }
  };

  const handleRespond = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !responseText.trim()) return;

    try {
      setResponding(true);
      await messageService.respondToMessage(id, {
        responseMessage: responseText,
        status: 'responded',
      });
      toast.success('Response sent successfully');
      setResponseText('');
      setStatus('responded');
      
      // Reload message to get updated data
      const updated = await messageService.getMessageById(id);
      setMessage(updated);
    } catch (error) {
      console.error('Failed to send response:', error);
      toast.error('Failed to send response');
    } finally {
      setResponding(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <p style={{ textAlign: 'center', color: '#718096' }}>Loading message...</p>
        </div>
      </div>
    );
  }

  if (!message) {
    return null;
  }

  const formatDate = (value?: string | null) => {
    if (!value) return '—';
    try {
      return new Date(value).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return value;
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Message Details</h1>
        <div className="admin-actions">
          <button
            type="button"
            className="btn-admin btn-admin-secondary"
            onClick={() => navigate('/admin/messages')}
          >
            <FaArrowLeft /> Back to Messages
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 350px' }}>
        {/* Main Message Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Message Header */}
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ margin: '0 0 0.5rem', color: '#2d3748', fontSize: '1.5rem' }}>
                  {message.subject}
                </h2>
                <div style={{ display: 'flex', gap: '1rem', color: '#718096', fontSize: '0.875rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FaClock /> {formatDate(message.createdAt ?? message.created_at)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FaTag /> {message.messageType ?? message.message_type ?? 'general'}
                  </span>
                </div>
              </div>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as MessageStatus)}
                disabled={updating}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="in_progress">In Progress</option>
                <option value="responded">Responded</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Sender Info */}
            <div
              style={{
                padding: '1rem',
                background: '#f7fafc',
                borderRadius: '8px',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <FaUser style={{ color: '#718096' }} />
                <strong style={{ color: '#2d3748' }}>
                  {message.senderName ?? message.sender_name ?? 'Anonymous'}
                </strong>
              </div>
              {message.senderEmail && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#718096', fontSize: '0.875rem' }}>
                  <FaEnvelope />
                  <a href={`mailto:${message.senderEmail ?? message.sender_email}`} style={{ color: '#4299e1' }}>
                    {message.senderEmail ?? message.sender_email}
                  </a>
                </div>
              )}
            </div>

            {/* Message Content */}
            <div>
              <h3 style={{ margin: '0 0 0.75rem', color: '#2d3748', fontSize: '1rem' }}>Message</h3>
              <div
                style={{
                  padding: '1.25rem',
                  background: '#ffffff',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  color: '#4a5568',
                }}
              >
                {message.message}
              </div>
            </div>

            {/* Project Details (if applicable) */}
            {(message.projectBudget || message.projectTimeline) && (
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ margin: '0 0 0.75rem', color: '#2d3748', fontSize: '1rem' }}>Project Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {message.projectBudget && (
                    <div
                      style={{
                        padding: '1rem',
                        background: '#f7fafc',
                        borderRadius: '8px',
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.25rem' }}>Budget</div>
                      <div style={{ fontWeight: 600, color: '#2d3748' }}>
                        {message.projectBudget ?? message.project_budget}
                      </div>
                    </div>
                  )}
                  {message.projectTimeline && (
                    <div
                      style={{
                        padding: '1rem',
                        background: '#f7fafc',
                        borderRadius: '8px',
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.25rem' }}>Timeline</div>
                      <div style={{ fontWeight: 600, color: '#2d3748' }}>
                        {message.projectTimeline ?? message.project_timeline}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Previous Response (if exists) */}
          {message.responseMessage && (
            <div className="admin-card">
              <h3 style={{ margin: '0 0 1rem', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaPaperPlane style={{ color: '#48bb78' }} />
                Your Response
              </h3>
              <div
                style={{
                  padding: '1.25rem',
                  background: '#f0fff4',
                  border: '2px solid #9ae6b4',
                  borderRadius: '8px',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  color: '#2d3748',
                }}
              >
                {message.responseMessage ?? message.response_message}
              </div>
              {message.respondedAt && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#718096' }}>
                  Sent on {formatDate(message.respondedAt ?? message.responded_at)}
                  {message.repliedByName && ` by ${message.repliedByName ?? message.replied_by_name}`}
                </div>
              )}
            </div>
          )}

          {/* Response Form */}
          {status !== 'archived' && (
            <div className="admin-card">
              <h3 style={{ margin: '0 0 1rem', color: '#2d3748' }}>Send Response</h3>
              <form onSubmit={handleRespond}>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={6}
                  placeholder="Type your response here..."
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    resize: 'vertical',
                  }}
                  required
                />
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    className="btn-admin btn-admin-primary"
                    disabled={responding || !responseText.trim()}
                  >
                    <FaPaperPlane /> {responding ? 'Sending...' : 'Send Response'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Admin Notes */}
          <div className="admin-card">
            <h3 style={{ margin: '0 0 1rem', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
              <FaStickyNote style={{ color: '#f59e0b' }} />
              Admin Notes
            </h3>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={6}
              placeholder="Private notes (not visible to sender)..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.875rem',
                lineHeight: 1.6,
                resize: 'vertical',
              }}
            />
            <button
              type="button"
              onClick={handleUpdateNotes}
              disabled={updating}
              className="btn-admin btn-admin-secondary"
              style={{ marginTop: '0.75rem', width: '100%' }}
            >
              {updating ? 'Saving...' : 'Save Notes'}
            </button>
          </div>

          {/* Message Stats */}
          <div className="admin-card">
            <h3 style={{ margin: '0 0 1rem', color: '#2d3748', fontSize: '1rem' }}>Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#718096' }}>Status:</span>
                <strong style={{ color: '#2d3748' }}>{status}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#718096' }}>Type:</span>
                <strong style={{ color: '#2d3748' }}>
                  {message.messageType ?? message.message_type ?? 'general'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#718096' }}>Priority:</span>
                <strong style={{ color: message.priority ? '#f59e0b' : '#718096' }}>
                  {message.priority ? 'High' : 'Normal'}
                </strong>
              </div>
              {(message.replyCount ?? message.reply_count ?? 0) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#718096' }}>Replies:</span>
                  <strong style={{ color: '#2d3748' }}>
                    {message.replyCount ?? message.reply_count}
                  </strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDetail;
