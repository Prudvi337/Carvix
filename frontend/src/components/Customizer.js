import React, { useState } from 'react'; 
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Visualizer from './Visualizer';
import './Layout.css';

const Customizer = () => {
  const { modelId } = useParams(); 
  const location = useLocation();
  const navigate = useNavigate();
  const modelPath = location.state?.modelPath;

  const [customizationOptions, setCustomizationOptions] = useState({
    color: '#ff0000', 
    tireType: 'standard', 
    seatMaterial: '#ffffff'
  });
  const handleARView = () => {
    navigate('/ar-view');
  };
  const handleNext = () => {
    navigate('/cost-summary', { state: { customizationOptions } });
  };

  return (
    <div className="layout-container">
      <Sidebar
        customizationOptions={customizationOptions}
        setCustomizationOptions={setCustomizationOptions}
      />

      <Visualizer modelPath={modelPath} customizationOptions={customizationOptions} />
      <button
        onClick={handleARView}
        style={{
          position: 'absolute',
          top: '100px',
          right: '20px',
          padding: '10px 20px',
          backgroundImage: 'linear-gradient(98.43deg, #C0362C 12.91%, #4169E1 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        Explore AR View
      </button>

      <button
        onClick={handleNext}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px 20px',
          backgroundImage: 'linear-gradient(98.43deg, #C0362C 12.91%, #4169E1 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Next
      </button>
    </div>
  );
};

export default Customizer;
