// CostSummary.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

const CarModel = ({ modelPath }) => {
  const { scene } = useGLTF(modelPath);  // Use the modelPath to load the GLTF model
  return <primitive object={scene} dispose={null} />;
};

const CostSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Ensure modelPath is valid
  const defaultModelPath = '/models/volkswagen_virtus_gt.glb'; // Default model path
  const { customizationOptions, modelPath } = location.state || {};
  const modelToLoad = modelPath || defaultModelPath;

  const calculateCost = () => {
    let baseCost = 20000; // Base price
    const extras = {
      color: 500,
      seatMaterial: 800,
      tireType: 400,
      rimStyle: 600,
      windowTint: 300,
      headlightColor: 200,
      interiorLightColor: 150,
      roofType: 700,
    };

    return Object.keys(customizationOptions || {}).reduce((acc, key) => acc + (extras[key] || 0), baseCost);
  };

  const totalCost = calculateCost();

  const handleBooking = () => {
    alert('Order booked successfully!');
    navigate('/');
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#000000', minHeight: '100vh',color:'#fff' }}>
      <h1 style={{background:'linear-gradient(98.43deg, #C0362C 12.91%, #4169E1 100%)',fontSize: '2rem',marginBottom: '20px'}}>Car Customization Summary</h1>

      {/* Car Model Preview */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <div style={{ width: '300px', height: '300px', border: '2px solid #ccc', padding: '10px' }}>
          <h3>Preview</h3>
          <Canvas style={{ height: '100%', width: '100%' }} camera={{ position: [5, 2, 5], near: 1, far: 1000 }}>
            <ambientLight intensity={0.3} />
            <directionalLight intensity={5} position={[0, 10, 5]} castShadow />
            <spotLight position={[0, 15, 10]} angle={0.3} intensity={5} penumbra={0.5} castShadow />
            <OrbitControls />
            <CarModel modelPath={modelToLoad} />
          </Canvas>
        </div>
      </div>

      {/* Customization Options */}
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {Object.keys(customizationOptions || {}).map((option) => (
          <li key={option} style={{ margin: '10px 0' }}>
            <strong>{option.replace(/([A-Z])/g, ' $1')}</strong>: {customizationOptions[option]}
          </li>
        ))}
      </ul>

      {/* Total Cost */}
      <h2>Total Cost: ${totalCost}</h2>

      {/* Booking Button */}
      <button
        onClick={handleBooking}
        style={{
          padding: '10px 20px',
          fontSize: '1rem',
          background: 'linear-gradient(98.43deg, #C0362C 12.91%, #4169E1 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        Book Order
      </button>
    </div>
  );
};

export default CostSummary;
