import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, Graticule } from "react-simple-maps";

const geoUrl = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

const WorldMap = () => {
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

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
    console.log("Нажата страна:", countryName);
  };

  return (
    <div
      style={{ position: "relative", textAlign: "center" }}
      onMouseMove={handleMouseMove}
    >
      {/* Всплывающая подсказка */}
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
          backgroundColor: "#708090", // Light blue background like water
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}
      >
        <ComposableMap
          projection="geoEqualEarth" // Changed to a more globe-like projection
          projectionConfig={{
            scale: 180,
            center: [0, 0]
          }}
        >
          {/* Add a graticule (grid lines) to represent longitude/latitude lines */}
          <Graticule stroke="#DDD" strokeWidth={0.5} />
          
          {/* Add an "outline" for the globe */}
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
              geographies.filter((geo) => geo.properties.name !== "Antarctica").map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => handleMouseEnter(geo)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleCountryClick(geo)}
                  style={{
                    default: {
                      fill: "#FDF6e3",
                      stroke: "#708090",
                      strokeWidth: 1,
                      outline: "none",
                    },
                    hover: {
                      fill: "#CD853F",
                      stroke: "#CD853F",
                      strokeWidth: 1.4, 
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: "#d84315",
                      outline: "none",
                    },
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  );
};

export default WorldMap;