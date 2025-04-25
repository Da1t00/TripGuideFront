import { useState, useEffect } from 'react';
import './Profile.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [myGuides, setMyGuides] = useState([]);
  const [likedGuides, setlikedGuides] = useState([]);
  const [activeTab, setActiveTab] = useState('myGuides'); 
  const accessToken = localStorage.getItem('accessToken');
  
  // Получение данных с сервера
  useEffect(() => {
    axios.get('http://localhost:8000/profile', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
    .then(response => {
      setMyGuides(response.data.guides);
      setlikedGuides(response.data.liked_guides);
    })
    .catch(error => {
      console.error('Ошибка при получении каталога:', error);
    });
  }, [accessToken]);

  // Function to handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Determine which guides to display based on active tab
  const displayedGuides = activeTab === 'myGuides' ? myGuides : likedGuides;

  // Функция для перехода к нужному руководству
  const navigateToGuide = (guide) => {
    const path = activeTab === 'myGuides' 
      ? `/catalog/my_guide/${guide.id}` 
      : `/catalog/view_guide/${guide.id}`;
    
    navigate(path, { state: { guide } });
  };

  return (
    <div className="profile-page-container">
      <div className="profile-container">
        {/* Main content area */}
        <div className="main-content">
          <h1 className="profile-title">My Profile</h1>
          
          {/* Tab buttons */}
          <div className="tab-buttons">
            <button 
              className={`tab-button ${activeTab === 'myGuides' ? 'active' : ''}`}
              onClick={() => handleTabChange('myGuides')}
            >
              My Guides
            </button>
            <button 
              className={`tab-button ${activeTab === 'likedGuides' ? 'active' : ''}`}
              onClick={() => handleTabChange('likedGuides')}
            >
              Liked Guides
            </button>
          </div>
          
          {/* Guides grid */}
          {displayedGuides.length > 0 ? (
            <div className="guides-grid">
              {displayedGuides.map(guide => (
                <div key={guide.id} className="guide-card">
                  <div className="guide-logo-container">
                    <img 
                      src={`http://localhost:8000/guide/get_guide_logo/${guide.id}`}
                      alt={`${guide.title} logo`} 
                      className="guide-logo"
                    />
                  </div>
                  <div className="guide-info">
                    <h2 className="guide-title">{guide.title}</h2>
                    <p className="guide-description">{guide.description}</p>
                    <div className="guide-tags">
                      {Array.isArray(guide.tags) && guide.tags.map((guide_tag, index) => (
                        <span key={index} className="guide-tag">{guide_tag}</span>
                      ))}
                    </div>
                  </div>
                  <button 
                    className="guide-button"
                    onClick={() => navigateToGuide(guide)}>
                    View Guide
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No {activeTab === 'myGuides' ? 'added' : 'liked'} guides yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}