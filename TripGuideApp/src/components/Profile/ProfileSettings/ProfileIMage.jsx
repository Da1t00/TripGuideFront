import React from 'react';
import { User, Upload, Trash2 } from 'lucide-react';
import axios from 'axios';

export default function ProfileImage({ 
  profileImage, 
  setProfileImage, 
  isEditing, 
  userData 
}) {
  const handleImageUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

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
      // Update image after upload
      const timestamp = new Date().getTime();
      setProfileImage(`http://localhost:8000/user/avatar/${userData.nickname}?t=${timestamp}`);
    } catch (error) {
      console.error('Upload error:', error.response?.data || error.message);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;
  
      // Send DELETE request to server
      await axios.delete('http://localhost:8000/user/delete_avatar', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
  
      setProfileImage(null); // remove image from UI
      console.log('Avatar deleted successfully');
    } catch (error) {
      console.error('Error deleting avatar:', error.response?.data || error.message);
    }
  };

  return (
    <>
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
    <div className="profile-name">
    {userData.nickname || 'User'}
    </div>
  </>
  );
}