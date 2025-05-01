import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileSettings.css';
import ProfileImage from './ProfileImage';
import ProfileUserInfo from './ProfileUserInfo'; // Import the new component

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
      console.error( error);
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
    <div className="profileset-container">
      <div className="profileset-content-wrapper">
        <div className="profileset-main-content">
          <div className="profileset-section">
            <ProfileImage 
              profileImage={profileImage}
              setProfileImage={setProfileImage}
              isEditing={isEditing}
              userData={userData}
            />
          </div>

          <ProfileUserInfo
            userData={userData}
            isEditing={isEditing}
            handleInputChange={handleInputChange}
            isLoading={isLoading}
            toggleEditMode={toggleEditMode}
          />
        </div>
      </div>
    </div>
  );
}