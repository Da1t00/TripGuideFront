import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, Graticule } from "react-simple-maps";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Предполагается, что вы используете react-toastify для уведомлений
import axios from "axios";
import { useEffect } from "react";

const geoUrl = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

const WorldMap = () => {
  const navigate = useNavigate();
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tags, setTags] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/guide/tags')
      .then(response => {
        setTags(response.data.tags);
        }
    )
      .catch(error => {
        console.error( error);
      });
    },[]);

  const handleMouseEnter = (geo) => {
    const { name } = geo.properties;
    setTooltipContent(name);
  };

  const handleMouseMove = (evt) => {
    setTooltipPosition({ x: evt.clientX, y: evt.clientY });
  };

  const handleMouseLeave = () => {
    setTooltipContent(null);
  };

  const handleCountryClick = (geo) => {
    const countryName = geo.properties.name;
    
    if (tags.includes(countryName)) {
      navigate(`/catalog`, { 
        state: { 
          selectedCountry: countryName 
        } 
      });
    } else {
      toast.info(`Гидов по стране ${countryName} пока нет`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    }
  };

  return (
    <div
      style={{ position: "relative", textAlign: "center" }}
      onMouseMove={handleMouseMove}
    >
      {tooltipContent && (
        <div
          style={{
            position: "fixed",
            top: tooltipPosition.y + 12,
            left: tooltipPosition.x + 12,
            backgroundColor: "#1a1a2e",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "10px",
            fontSize: "14px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 1000,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
          }}
        >
          {tooltipContent}
        </div>
      )}

      <div 
        style={{ 
          width: "100%", 
          maxWidth: "1200px", 
          margin: "0 auto",
          backgroundColor: "#708090", 
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}
      >
        <ComposableMap
          projection="geoEqualEarth" 
          projectionConfig={{
            scale: 180,
            center: [0, 0]
          }}
        >
  
          <Graticule stroke="#DDD" strokeWidth={0.5} />
          

          <Geography
            geography={{
              type: "Feature",
              geometry: {
                type: "Sphere"
              }
            }}
            style={{
              default: {
                fill: "#E6F2F8",
                stroke: "#2B65EC",
                strokeWidth: 2
              }
            }}
          />
          
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.filter((geo) => geo.properties.name !== "Antarctica").map((geo) => {
                const countryName = geo.properties.name;
                const hasGuides = tags.includes(countryName);
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => handleMouseEnter(geo)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleCountryClick(geo)}
                    style={{
                      default: {
                        fill: hasGuides ? "#FDF6e3" : "#e0e0e0",
                        stroke: "#708090",
                        strokeWidth: 1,
                        outline: "none",
                      },
                      hover: {
                        fill: hasGuides ? "#CD853F" : "#bdbdbd",
                        stroke: hasGuides ? "#CD853F" : "#9e9e9e",
                        strokeWidth: 1.4, 
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: hasGuides ? "#d84315" : "#9e9e9e",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  );
};

export default WorldMap;