import { useState } from 'react';
import './CatalogPage.css';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const geoUrl = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";
export default function CatalogPage() {
  
  const navigate = useNavigate();

  const [guides, setGuides] = useState([]);
  const [tags, setTags] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isMobileFilterVisible, setIsMobileFilterVisible] = useState(false);
  const type_tags = ["Food", "Trip", "Hotels"];
  const [countries, setCountries] = useState([]);
    useEffect(() => {
      const fetchCountries = async () => {
        try {
          const res = await fetch(geoUrl);
          const data = await res.json();
          const countryNames = data.features.map(d => d.properties.name);
    
          // Сортировка
          countryNames.sort((a, b) => a.localeCompare(b));
          setCountries(countryNames);
        } catch (error) {
          console.error("Ошибка при загрузке стран:", error);
        }
      };
      fetchCountries();
    }, []);

  // Получение данных с сервера
  useEffect(() => {
    axios.get('http://localhost:8000/catalog')
      .then(response => {
        setGuides(response.data.guides);
        setTags(response.data.tags); 
        
      })
      .catch(error => {
        console.error('Ошибка при получении каталога:', error);

      });
  }, []);

  // Обработчик изменения состояния чекбоксов
  const handleTagChange = (tag) => {
    setSelectedTags(prevSelectedTags => {
      if (prevSelectedTags.includes(tag)) {
        return prevSelectedTags.filter(t => t !== tag);
      } else {
        return [...prevSelectedTags, tag];
      }
    });
  };

  // Фильтрация гидов по тексту и выбранным тегам
  const filteredGuides = guides.filter(guide => {
    // Фильтрация по тексту
    const textMatch = guide.title.toLowerCase().includes(filterText.toLowerCase()) || 
                      guide.description.toLowerCase().includes(filterText.toLowerCase());
    
    // Если теги не выбраны, учитываем только текстовый фильтр
    if (selectedTags.length === 0) {
      return textMatch;
    }
    
    // Фильтрация по тегам
    const tagMatch = selectedTags.every(tag => 
      Array.isArray(guide.guide_tags) && guide.guide_tags.includes(tag)
    );
    
    // Возвращаем гиды, которые соответствуют обоим условиям
    return textMatch && tagMatch;
  });

  const toggleMobileFilter = () => {
    setIsMobileFilterVisible(!isMobileFilterVisible);
  };
  return (
    <div className="catalog-page-container">
      
      <div className="catalog-container">
        {/* Main content area */}
        <div className="main-content">
          <h1 className="page-title">Catalog</h1>
          
          {/* Guides grid */}
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
              <p>No added guides yet</p>
            </div>
          )}
        </div>
        
        {/* Filter sidebar */}
        <div className={`filter-sidebar ${isMobileFilterVisible ? 'mobile-visible' : ''}`}>
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
          
          {/* Categories filter */}
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
    </div>
  );
}