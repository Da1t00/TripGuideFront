import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {User, Upload, Trash2 } from 'lucide-react';
import './ProfileSettings.css';

// export default function ProfileImage() { 
//   return (
    
//   )
// }
export default function ProfileSettings() {
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    age: '',
    gender: '',
    about: '',
    cof: '',
    nickname: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [, setFile] = useState(null);

  const ages = Array.from({ length: 100 }, (_, i) => i + 1);
  const genders = ['Male', 'Female'];

  const handleDeleteImage = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;
  
      // Отправляем DELETE-запрос на сервер
      await axios.delete('http://localhost:8000/user/delete_avatar', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
  
      setProfileImage(null); // удаляем картинку из интерфейса
      console.log('Avatar deleted successfully');
    } catch (error) {
      console.error('Error deleting avatar:', error.response?.data || error.message);
    }
  };
  
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
      setProfileImage(`http://localhost:8000/user/avatar/${parsedData.nickname}`);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.post('http://localhost:8000/user/upload_avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`
        }
      });
      // Обновляем картинку после загрузки
      const timestamp = new Date().getTime();
      setProfileImage(`http://localhost:8000/user/avatar/${userData.nickname}?t=${timestamp}`);
    } catch (error) {
      console.error('Upload error:', error.response?.data || error.message);
    }
  };



  const updateUserInfoOnServer = async (updatedData) => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return false;

      await axios.post('http://localhost:8000/user/info', updatedData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      return true;
    } catch (error) {
      console.error('Error updating user info:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEditMode = async () => {
    if (isEditing) {
      const dataToSend = {
        nickname: userData.nickname || '',
        username: userData.username || '',
        age: String(userData.age || ''),
        gender: userData.gender || '',
        about: userData.about || '',
        cof: userData.cof || '0'
      };

      const updateSuccessful = await updateUserInfoOnServer(dataToSend);
      if (updateSuccessful) {
        localStorage.setItem('userData', JSON.stringify(userData));
      }
    }

    setIsEditing(!isEditing);
  };

  return (
    <div className="profile-container">
      <div className="content-wrapper">
        <div className="main-content">
          <div className="profile-section">
            <div className="profile-image-container">
              <div className="profile-image">
              {profileImage ? (
                   <img src={profileImage} alt="Profile" className="image" />
                 ) : (
                   <div className="profile-placeholder">
                     <User size={40} color="#675c43" />
                   </div>
                 )}
              </div>
              {isEditing &&
                <>
                  <label className="upload-button">
                    <input
                      type="file"
                      className="hidden-input"
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                    <Upload size={16} color="#FDF6E3" />
                  </label>
                  {profileImage && (
                    <button
                      className="delete-image-button"
                      onClick={handleDeleteImage}
                      title="Удалить фото"
                    >
                      <Trash2 size={16} color="#FDF6E3" />
                    </button>
                  )}
                </>
              }
              
            </div>
            <div className="profile-name">{userData.nickname || 'User'}</div>
          </div>

          <div className="user-info-section">
            <div className="section-header">
              <h3 className="section-title">Info about user</h3>
              <div className="section-actions">
                <button
                  className={`edit-button ${isEditing ? 'save-button' : ''}`}
                  onClick={toggleEditMode}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : isEditing ? 'Save' : 'Change'}
                </button>
                <button className="delete-button">Delete account</button>
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
        </div>
      </div>
    </div>
  );
}
