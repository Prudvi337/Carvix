// Sidebar.js
import React from 'react';
import './styles.css';

const Sidebar = ({ customizationOptions, setCustomizationOptions }) => {
  const handleColorChange = (event) => {
    setCustomizationOptions({ ...customizationOptions, color: event.target.value });
  };

  const handleSeatMaterialChange = (event) => {
    setCustomizationOptions({ ...customizationOptions, seatMaterial: event.target.value });
  };

  const handleTireTypeChange = (event) => {
    setCustomizationOptions({ ...customizationOptions, tireType: event.target.value });
  };

  const handleRimStyleChange = (event) => {
    setCustomizationOptions({ ...customizationOptions, rimStyle: event.target.value });
  };

  const handleWindowTintChange = (event) => {
    setCustomizationOptions({ ...customizationOptions, windowTint: event.target.value });
  };

  const handleWindowTintOpacityChange = (event) => {
    setCustomizationOptions({ ...customizationOptions, windowTintOpacity: parseFloat(event.target.value) });
  };

  const handleHeadlightColorChange = (event) => {
    setCustomizationOptions({ ...customizationOptions, headlightColor: event.target.value });
  };

  const handleHeadlightIntensityChange = (event) => {
    setCustomizationOptions({ ...customizationOptions, headlightIntensity: parseFloat(event.target.value) });
  };

  const handleInteriorLightColorChange = (event) => {
    setCustomizationOptions({ ...customizationOptions, interiorLightColor: event.target.value });
  };

  const handleInteriorLightIntensityChange = (event) => {
    setCustomizationOptions({ ...customizationOptions, interiorLightIntensity: parseFloat(event.target.value) });
  };

  const handleRoofTypeChange = (event) => {
    setCustomizationOptions({ ...customizationOptions, roofType: event.target.value });
  };

  const handleRoofColorChange = (event) => {
    setCustomizationOptions({ ...customizationOptions, roofColor: event.target.value });
  };

  return (
    <div className="sidebar">
      <h2>Customize Options</h2>

      <div>
        <label>Body Color:</label>
        <input type="color" value={customizationOptions.color} onChange={handleColorChange} />
      </div>

      <div>
        <label>Seat Material:</label>
        <input type="color" value={customizationOptions.seatMaterial} onChange={handleSeatMaterialChange} />
      </div>

      <div>
        <label>Tire Type:</label>
        <select value={customizationOptions.tireType} onChange={handleTireTypeChange}>
          <option value="standard">Standard</option>
          <option value="sport">Sport</option>
          <option value="offroad">Offroad</option>
        </select>
      </div>

      <div>
        <label>Rim Style:</label>
        <input type="color" value={customizationOptions.rimStyle} onChange={handleRimStyleChange} />
      </div>

      <div>
        <label>Window Tint:</label>
        <input type="color" value={customizationOptions.windowTint} onChange={handleWindowTintChange} />
      </div>

      <div>
        <label>Window Tint Opacity:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={customizationOptions.windowTintOpacity || 0.5}
          onChange={handleWindowTintOpacityChange}
        />
      </div>

      <div>
        <label>Headlight Color:</label>
        <input type="color" value={customizationOptions.headlightColor} onChange={handleHeadlightColorChange} />
      </div>

      <div>
        <label>Headlight Intensity:</label>
        <input
          type="range"
          min="0"
          max="3"
          step="0.1"
          value={customizationOptions.headlightIntensity || 1.5}
          onChange={handleHeadlightIntensityChange}
        />
      </div>

      <div>
        <label>Interior Light Color:</label>
        <input type="color" value={customizationOptions.interiorLightColor} onChange={handleInteriorLightColorChange} />
      </div>

      <div>
        <label>Interior Light Intensity:</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={customizationOptions.interiorLightIntensity || 0.8}
          onChange={handleInteriorLightIntensityChange}
        />
      </div>

      <div>
        <label>Roof Type:</label>
        <select value={customizationOptions.roofType} onChange={handleRoofTypeChange}>
          <option value="standard">Standard</option>
          <option value="panoramic">Panoramic</option>
          <option value="hardtop">Hardtop</option>
        </select>
      </div>

      <div>
        <label>Roof Color:</label>
        <input type="color" value={customizationOptions.roofColor} onChange={handleRoofColorChange} />
      </div>
    </div>
  );
};

export default Sidebar;
