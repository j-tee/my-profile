import React from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import './ProfileProgressBar.css';

const ProfileProgressBar: React.FC = () => {
  const { getProfileCompleteness } = useProfile();
  const status = getProfileCompleteness();

  // Don't show if profile is complete
  if (status.isComplete && status.percentage === 100) {
    return null;
  }

  const incompleteTasks = [];
  if (!status.hasHeadline) incompleteTasks.push('Add a professional headline');
  if (!status.hasSummary) incompleteTasks.push('Write your professional summary');
  if (!status.hasLocation) incompleteTasks.push('Add your location');
  if (!status.hasPhoto) incompleteTasks.push('Upload a profile picture');
  if (!status.hasContact) incompleteTasks.push('Add contact information');

  return (
    <div className="profile-progress-container">
      <div className="profile-progress-header">
        <h3>Complete Your Profile</h3>
        <span className="progress-percentage">{status.percentage.toFixed(0)}% Complete</span>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${status.percentage}%` }}
          role="progressbar"
          aria-valuenow={status.percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      
      {incompleteTasks.length > 0 && (
        <ul className="checklist">
          {incompleteTasks.slice(0, 3).map((task, index) => (
            <li key={index}>
              <span className="task-icon">✏️</span> {task}
            </li>
          ))}
        </ul>
      )}
      
      <Link to="/complete-profile" className="complete-profile-link">
        Complete Now →
      </Link>
    </div>
  );
};

export default ProfileProgressBar;
