import { useEffect, useState, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Preload } from "@react-three/drei";
import * as THREE from 'three';

// Add TypeScript declaration for the window.rotationTimer
declare global {
  interface Window {
    rotationTimer: ReturnType<typeof setTimeout> | undefined;
  }
}

interface CarModel3DProps {
  className?: string;
  selectedColor?: { hex: string };
  selectedWheel?: { id: string };
  selectedInterior?: { id: string };
}

function Model({ selectedColor, selectedWheel, selectedInterior }: Omit<CarModel3DProps, 'className'>) {
  const [modelLoaded, setModelLoaded] = useState(false);
  const modelRef = useRef<THREE.Object3D>(null);
  const [isRotating, setIsRotating] = useState(true);
  
  const { scene, nodes, materials } = useGLTF("/models/car3.glb", true, true, (loader) => {
    console.log('Loading model...', loader);
  });

  useEffect(() => {
    if (scene && selectedColor) {
      // Find and update the car body material
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          // Assuming the car body material is named 'CarBody' or similar
          if (child.material.name === 'CarBody') {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(selectedColor.hex),
              metalness: 0.6,
              roughness: 0.2,
            });
          }
        }
      });
    }
  }, [scene, selectedColor]);

  useEffect(() => {
    if (scene && selectedWheel) {
      // Update wheel geometry based on selection
      scene.traverse((child) => {
        // Properly type-cast the child to THREE.Mesh
        if (child instanceof THREE.Mesh) {
          if (child.name.includes('Wheel')) {
            // Load and apply the selected wheel model
            const wheelModel = `/models/wheels/${selectedWheel.id}.glb`;
            const { nodes: wheelNodes } = useGLTF(wheelModel);
            // Ensure wheelNodes.Wheel is a Mesh before accessing geometry
            if (wheelNodes.Wheel instanceof THREE.Mesh) {
              child.geometry = wheelNodes.Wheel.geometry;
            }
          }
        }
      });
    }
  }, [scene, selectedWheel]);

  useEffect(() => {
    if (scene && selectedInterior) {
      // Update interior materials based on selection
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.name.includes('Interior')) {
          // Apply interior materials based on selection
          child.material = new THREE.MeshStandardMaterial({
            map: new THREE.TextureLoader().load(`/textures/interior/${selectedInterior.id}.jpg`),
          });
        }
      });
    }
  }, [scene, selectedInterior]);

  useEffect(() => {
    if (scene) {
      console.log('Model loaded successfully', scene);
      setModelLoaded(true);
    }
  }, [scene]);

  // Auto-rotation animation
  useFrame((state, delta) => {
    if (modelRef.current && isRotating) {
      // Rotate the model around the Y axis
      modelRef.current.rotation.y += delta * 0.5; 
    }
  });

  // Handle pointer events to pause/resume rotation
  const handlePointerDown = () => setIsRotating(false);
  const handlePointerUp = () => setIsRotating(true);
  const handlePointerLeave = () => setIsRotating(true);

  if (!modelLoaded) {
    return null;
  }

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={1.5} 
      position={[0, 0, 0]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    />
  );
}

// Enhanced lighting setup component
function EnhancedLighting() {
  return (
    <>
      {/* Main ambient light for overall illumination */}
      <ambientLight intensity={0.6} color="#ffffff" />
      
      {/* Key light from top-front */}
      <directionalLight 
        position={[0, 8, 5]} 
        intensity={1.2} 
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Top lights arranged in a circle above the car */}
      <directionalLight position={[3, 6, 3]} intensity={0.8} color="#f0f8ff" />
      <directionalLight position={[-3, 6, 3]} intensity={0.8} color="#f0f8ff" />
      <directionalLight position={[3, 6, -3]} intensity={0.8} color="#f0f8ff" />
      <directionalLight position={[-3, 6, -3]} intensity={0.8} color="#f0f8ff" />
      
      {/* Additional top lights for better coverage */}
      <directionalLight position={[0, 7, 4]} intensity={0.7} color="#ffffff" />
      <directionalLight position={[4, 7, 0]} intensity={0.7} color="#ffffff" />
      <directionalLight position={[0, 7, -4]} intensity={0.7} color="#ffffff" />
      <directionalLight position={[-4, 7, 0]} intensity={0.7} color="#ffffff" />
      
      {/* Point lights for more dramatic lighting */}
      <pointLight position={[2, 5, 2]} intensity={0.8} color="#ffffff" distance={10} />
      <pointLight position={[-2, 5, 2]} intensity={0.8} color="#ffffff" distance={10} />
      <pointLight position={[2, 5, -2]} intensity={0.8} color="#ffffff" distance={10} />
      <pointLight position={[-2, 5, -2]} intensity={0.8} color="#ffffff" distance={10} />
      
      {/* Fill lights from the sides */}
      <directionalLight position={[5, 3, 0]} intensity={0.5} color="#e6f3ff" />
      <directionalLight position={[-5, 3, 0]} intensity={0.5} color="#e6f3ff" />
      
      {/* Rim lighting for better definition */}
      <directionalLight position={[0, 2, -6]} intensity={0.6} color="#fff5e6" />
      
      {/* Subtle colored accent lights */}
      <pointLight position={[0, 8, 0]} intensity={0.4} color="#ffffcc" distance={8} />
    </>
  );
}

const CarModel3D = ({ className = "", selectedColor, selectedWheel, selectedInterior }: CarModel3DProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <style>{`
        .car-model-container {
          cursor: grab;
        }
        .car-model-container:active {
          cursor: grabbing;
        }
      `}</style>
      
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      ) : null}
      
      <div className={`w-full h-full transition-opacity duration-500 car-model-container ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Canvas
          camera={{ position: [3, 3, 3], fov: 75 }}
          style={{ width: '100%', height: '100%' }}
          gl={{ 
            antialias: true,
            outputColorSpace: THREE.SRGBColorSpace
          }}
        >
          <Suspense fallback={null}>
            <EnhancedLighting />
            <Model 
              selectedColor={selectedColor}
              selectedWheel={selectedWheel}
              selectedInterior={selectedInterior}
            />
            <OrbitControls 
              enableZoom={true}
              minDistance={2}
              maxDistance={10}
              enableDamping={true}
              dampingFactor={0.05}
              rotateSpeed={0.5}
              onChange={() => {
                // Access the Model component's setIsRotating function
                // This is a workaround since we can't directly communicate between components
                // The user interaction with OrbitControls will temporarily stop the auto-rotation
                const modelElement = document.querySelector('canvas');
                if (modelElement) {
                  modelElement.dispatchEvent(new Event('pointerdown'));
                  // Resume rotation after a delay when user stops interacting
                  clearTimeout(window.rotationTimer);
                  window.rotationTimer = setTimeout(() => {
                    modelElement.dispatchEvent(new Event('pointerleave'));
                  }, 2000);
                }
              }}
            />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default CarModel3D;