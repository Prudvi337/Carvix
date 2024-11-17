import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Color } from 'three';
import { useNavigate } from 'react-router-dom';

const CarModel = ({ modelPath, customizationOptions }) => {
  const { scene } = useGLTF(modelPath);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    if (!scene || modelLoaded) return;
    setModelLoaded(true);
  }, [scene, modelLoaded]);

  useEffect(() => {
    if (!scene) return;

    const applyCustomizations = () => {
      const mainGroup = scene.getObjectByName('Sketchfab_Scene') || scene;

      mainGroup.traverse((child) => {
        if (child.isMesh) {
          // Apply body color customization
          if (child.name.includes('biodyshell') && customizationOptions.color) {
            child.material.color.set(new Color(customizationOptions.color));
            child.material.needsUpdate = true;
          }
          
          // Apply seat color customization
          if (child.name.includes('seat') && customizationOptions.seatMaterial) {
            child.material.color.set(new Color(customizationOptions.seatMaterial));
            child.material.needsUpdate = true;
          }

          // Apply tire customization
          if (child.name.includes('tire') || child.name.includes('wheel')) {
            const tireColor = customizationOptions.tireType === 'sport' ? '#FF0000' : 
                              customizationOptions.tireType === 'offroad' ? '#008000' : '#808080';
            child.material.color.set(new Color(tireColor));
            child.material.needsUpdate = true;
          }

          // Apply rim customization without affecting the whole car
          if (child.name.includes('rim') && customizationOptions.rimStyle) {
            child.material.color.set(new Color(customizationOptions.rimStyle));
            child.material.needsUpdate = true;
          }

          // Apply window tint customization
          if (child.name.includes('window') && customizationOptions.windowTint) {
            child.material.color.set(new Color(customizationOptions.windowTint));
            child.material.opacity = customizationOptions.windowTintOpacity || 0.5;
            child.material.transparent = true;
            child.material.needsUpdate = true;
          }

          // Apply headlight customization
          if (child.name.includes('headlight') && customizationOptions.headlightColor) {
            child.material.emissive = new Color(customizationOptions.headlightColor);
            child.material.emissiveIntensity = customizationOptions.headlightIntensity || 1.5;
            child.material.needsUpdate = true;
          }

          // Apply interior light customization
          if (child.name.includes('interiorLight') && customizationOptions.interiorLightColor) {
            child.material.emissive = new Color(customizationOptions.interiorLightColor);
            child.material.emissiveIntensity = customizationOptions.interiorLightIntensity || 0.8;
            child.material.needsUpdate = true;
          }

          // Apply roof customization without affecting other parts
          if (child.name.includes('roof') && customizationOptions.roofType) {
            const roofColor = customizationOptions.roofType === 'panoramic' ? '#444444' : 
                              customizationOptions.roofType === 'hardtop' ? '#222222' : 
                              customizationOptions.roofColor || '#666666';
            child.material.color.set(new Color(roofColor));
            child.material.needsUpdate = true;
          }
        }
      });
    };

    applyCustomizations();
  }, [scene, customizationOptions]);

  return <primitive object={scene} dispose={null} />;
};

const Visualizer = ({ modelPath, customizationOptions, name }) => {
  const navigate = useNavigate();

  const handleARView = () => {
    navigate('/ar-view');
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#222', color: 'white' }}>
      <h2 style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '1.5rem', fontWeight: 'bold' }}>{name}</h2>

      <Canvas
        style={{ height: '100%', width: '100%' }}
        camera={{
          position: [5, 2, 5],
          near: 1,
          far: 1000,
        }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight intensity={5} position={[0, 10, 5]} castShadow />
        <spotLight position={[0, 15, 10]} angle={0.3} intensity={5} penumbra={0.5} castShadow />
        <OrbitControls />
        <CarModel modelPath={modelPath} customizationOptions={customizationOptions} />
      </Canvas>
    </div>
  );
};

useGLTF.preload('/models/volkswagen_virtus_gt.glb');
useGLTF.preload('/models/volkswagen_passat.glb');
useGLTF.preload('/models/volkswagen_polo.glb');

export default Visualizer;
