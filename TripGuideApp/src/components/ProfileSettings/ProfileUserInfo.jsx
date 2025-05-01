import React from 'react';
import './ProfileSettings.css';
function ProfileUserInfo({ 
  userData, 
  isEditing, 
  handleInputChange, 
  isLoading, 
  toggleEditMode 
}) {
  const ages = Array.from({ length: 100 }, (_, i) => i + 1);
  const genders = ['Male', 'Female'];

  return (
    <div className="user-info-section">
      <div className="section-header">
        <h3 className="section-title">Info about user</h3>
        <div className="section-actions">
          <button
            className={`set-edit-button ${isEditing ? 'save-button' : ''}`}
            onClick={toggleEditMode}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : isEditing ? 'Save' : 'Change'}
          </button>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-item">
          <label>Name:</label>
          {isEditing ? (
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleInputChange}
              className="select"
            />
          ) : (
            <span>{userData.username || 'Not specified'}</span>
          )}
        </div>

        <div className="info-item gender">
          <label>Gender:</label>
          {isEditing ? (
            <select
              name="gender"
              value={userData.gender}
              onChange={handleInputChange}
              className="select"
            >
              <option value="">Choose your gender</option>
              {genders.map((gender) => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>
          ) : (
            <span>{userData.gender || 'Not specified'}</span>
          )}
        </div>

        <div className="info-item age">
          <label>Age:</label>
          {isEditing ? (
            <select
              name="age"
              value={userData.age}
              onChange={handleInputChange}
              className="select"
            >
              <option value="">Choose your age</option>
              {ages.map((age) => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          ) : (
            <span>{userData.age ? `${userData.age} years` : 'Not specified'}</span>
          )}
        </div>
      </div>

      <div className="about-section">
        <label className="about-label">About me</label>
        {isEditing ? (
          <textarea
            name="about"
            value={userData.about}
            onChange={handleInputChange}
            placeholder="Say something about yourself..."
            className="about-textarea editable"
          />
        ) : (
          <div className="about-textarea">
            {userData.about || 'Say something about yourself...'}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileUserInfo;