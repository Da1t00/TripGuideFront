import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

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

      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto"
      }}>
        <ComposableMap projectionConfig={{ scale: 180 }}>
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
                      fill: "#708090",
                      stroke: "#ffffff",
                      strokeWidth: 0.8,
                      outline: "none",
                    },
                    hover: {
                      fill: "#8B7355 ",
                      stroke: "#8B7355",
                      strokeWidth: 1.2, 
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
