import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Recs() {
  const navigate = useNavigate();
  const [guides, setGuides] = useState([]);
  const accessToken = localStorage.getItem('accessToken');
  

  useEffect(() => {
    axios.get('http://localhost:8000/recs', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
    .then(response => {
      setGuides(response.data.recommendations);
    })
    .catch(error => {
      console.error( error);
    });
  }, [accessToken]);

  const navigateToGuide = (guide) => {
    const path = `/catalog/view_guide/${guide.id}`;
    navigate(path, { state: { guide } });
  };


  return (
    <div className="profile-page-container">
      <div className="profile-container">
        <div className="main-content">
          <h1 className="profile-title">Recommendations</h1>
          {guides.length > 0 ? (
            <div className="guides-grid">
              {guides.map(guide => (
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
              <p>No recommended guides yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}