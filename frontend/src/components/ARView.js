// ARView.js
import React from 'react';

const ARView = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#000000', minHeight: '100vh', color:'#fff' }}>
      <h1 style={{background:'linear-gradient(98.43deg, #C0362C 12.91%, #4169E1 100%)',fontSize: '2rem',
    marginBottom: '20px'}}>AR View</h1>
      <p>This feature is under construction. Here, users will be able to view the customized car model in augmented reality.</p>
      <button
        onClick={() => window.history.back()}
        style={{
          marginTop:'50px',
          padding: '10px 20px',
          fontSize: '1rem',
          backgroundImage: 'linear-gradient(98.43deg, #C0362C 12.91%, #4169E1 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        &larr; Back to Visualizer
      </button>
    </div>
  );
};

export default ARView;
