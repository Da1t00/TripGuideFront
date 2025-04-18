import React, { useState, useEffect } from 'react';
import { Upload, User, Trash2 } from 'lucide-react';
import './Profile.css'; // Импортируем стили для компонента профиля

export default function ProfileSettings() {
  // Состояния для пользовательских данных
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    age: '',
    gender: '',
    about: ''
  });

  // Данные для выпадающих списков
  const ages = Array.from({ length: 100 }, (_, i) => i + 1);
  const genders = ['Male', 'Female'];

  // Загрузка данных из localStorage при монтировании компонента
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
    
    const storedAvatar = localStorage.getItem('profileImage');
    if (storedAvatar) {
      setProfileImage(storedAvatar);
    }
  }, []);

  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обработчик загрузки изображения
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setProfileImage(imageData);
        localStorage.setItem('profileImage', imageData);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Функция удаления фотографии профиля
  const handleDeleteImage = () => {
    setProfileImage(null);
    localStorage.removeItem('profileImage');
  };

  // Включение/выключение режима редактирования
  const toggleEditMode = () => {
    if (isEditing) {
      // Сохраняем данные в localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="profile-container">
      <div className="content-wrapper">
        {/* Основное содержимое */}
        <div className="main-content">
          {/* Секция профиля */}
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
            </div>
            <div className="profile-name">
              {userData.username || 'User'}
            </div>
          </div>
          
          <div className="user-info-section">
            <div className="section-header">
              <h3 className="section-title">Info about user</h3>
              <div className="section-actions">
                <button 
                  className={`edit-button ${isEditing ? 'save-button' : ''}`} 
                  onClick={toggleEditMode}
                >
                  {isEditing ? 'Save' : 'Change'}
                </button>
                <button className="delete-button">
                  Delete account
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
                    placeholder="Enter your name"
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
                    {genders.map(gender => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                ) : (
                  <span>{userData.gender || 'Not specified'}</span>
                )}
              </div>
              
              {/* Замененный блок с простым выбором возраста */}
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
                    {ages.map(age => (
                      <option key={age} value={age}>{age}</option>
                    ))}
                  </select>
                ) : (
                  <span>{userData.age ? `${userData.age} age` : 'Not specified'}</span>
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