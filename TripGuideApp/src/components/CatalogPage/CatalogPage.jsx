import { useState, useEffect } from 'react';
import './CatalogPage.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const geoUrl = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

export default function CatalogPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [guides, setGuides] = useState([]);
  const [tags, setTags] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const type_tags = ["Food", "Trip", "Hotels"];
  const [countries, setCountries] = useState([]);
  const [mobileFilterVisible, setMobileFilterVisible] = useState(false);
  
  // Получение данных с сервера
  useEffect(() => {
    axios.get('http://localhost:8000/catalog')
      .then(response => {
        setGuides(response.data.guides);
        setTags(response.data.tags);
        
        if (location.state && location.state.selectedCountry) {
          const country = location.state.selectedCountry;
          
          if (response.data.tags.includes(country)) {
            setSelectedTags(prevTags => {
              if (!prevTags.includes(country)) {
                return [...prevTags, country];
              }
              return prevTags;
            });
          } else {
            toast.info(`Гидов по стране ${country} пока нет`, {
              position: "top-center",
              autoClose: 3000
            });
          }
          
          navigate(location.pathname, { replace: true });
        }
      })
      .catch(error => {
        console.error( error);
      });
  }, [location.state, navigate, location.pathname]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(geoUrl);
        const data = await res.json();
        const countryNames = data.features.map(d => d.properties.name);
  
        countryNames.sort((a, b) => a.localeCompare(b));
        setCountries(countryNames);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCountries();
  }, []);

  const handleTagChange = (tag) => {
    setSelectedTags(prevSelectedTags => {
      if (prevSelectedTags.includes(tag)) {
        return prevSelectedTags.filter(t => t !== tag);
      } else {
        return [...prevSelectedTags, tag];
      }
    });
  };

  const toggleMobileFilter = () => {
    setMobileFilterVisible(!mobileFilterVisible);
  };

  const filteredGuides = guides.filter(guide => {
    const textMatch = guide.title.toLowerCase().includes(filterText.toLowerCase()) || 
                      guide.description.toLowerCase().includes(filterText.toLowerCase());
    
    if (selectedTags.length === 0) {
      return textMatch;
    }
    
    const tagMatch = selectedTags.every(tag => 
      Array.isArray(guide.guide_tags) && guide.guide_tags.includes(tag)
    );
    
    return textMatch && tagMatch;
  });


  return (
    <div className="catalog-page-container">
      <ToastContainer />
      
      <div className="catalog-container">
        <div className="catalog-main-content">
          <h1 className="page-title">Catalog</h1>
          
          {filteredGuides.length > 0 ? (
            <div className="guides-grid">
              {filteredGuides.map(guide => (
                <div key={guide.id} className="guide-card">
                  <div className="catalog-logo-container">
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
                      {Array.isArray(guide.guide_tags) && guide.guide_tags.map((guide_tag, index) => (
                        <span key={index} className="guide-tag">{guide_tag}</span>
                      ))}
                    </div>
                  </div>
                  <button 
                    className="guide-button"
                    onClick={() => navigate(`/catalog/view_guide/${guide.id}`, { state: { guide } })}>
                    View Guide
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No guides match your filter criteria</p>
            </div>
          )}
        </div>
        
        <div className={`filter-sidebar ${mobileFilterVisible ? 'mobile-visible' : ''}`}>
          <h2 className="filter-title">Filters</h2>
          <div className="menuDivider"/>
          <div className="filter-group">
            <label htmlFor="search" className="filter-label">Search</label>
            <input
              id="search"
              type="text"
              className="search-input"
              placeholder="Search guides..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <div className="menuDivider"/>
            <h3 className="filter-subtitle">Type of guide</h3>

            <div className="checkbox-group">
              {Array.isArray(tags) &&
                tags
                  .filter(tag => type_tags.includes(tag))
                  .sort((a, b) => a.localeCompare(b))
                  .map((tag, index) => (
                    <label key={index} className="checkbox-label">
                      <input 
                        type="checkbox" 
                        className="checkbox-input" 
                        value={tag}
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagChange(tag)}
                      />
                      <span>{tag}</span>
                    </label>
                  ))}
            </div>
            <div className="menuDivider"/>
            <h3 className="filter-subtitle">Countries</h3>
            <div className="checkbox-group">
              {Array.isArray(tags) &&
                tags
                  .filter(tag => countries.includes(tag))
                  .sort((a, b) => a.localeCompare(b))
                  .map((tag, index) => (
                    <label key={index} className="checkbox-label">
                      <input 
                        type="checkbox" 
                        className="checkbox-input" 
                        value={tag}
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagChange(tag)}
                      />
                      <span>{tag}</span>
                    </label>
                  ))}
            </div>
          </div>
          
          <div className="mobile-filter-close" onClick={toggleMobileFilter}>
            Close Filters
          </div>
        </div>
      </div>

      <div className="mobile-filter-button" onClick={toggleMobileFilter}>
        Filters
      </div>
    </div>
  );
}