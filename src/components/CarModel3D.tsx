import { useEffect, useState, Suspense, useRef, useMemo } from "react";
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
  modelPath?: string;
  onMaterialDetected?: (materials: string[]) => void;
}

// AI-powered material detection and color mapping
class AIMaterialDetector {
  private static instance: AIMaterialDetector;
  private materialPatterns: Map<string, string[]> = new Map();
  private colorHistory: Map<string, string[]> = new Map();

  static getInstance(): AIMaterialDetector {
    if (!AIMaterialDetector.instance) {
      AIMaterialDetector.instance = new AIMaterialDetector();
    }
    return AIMaterialDetector.instance;
  }

  // Detect car body materials based on common naming patterns and geometry analysis
  detectCarBodyMaterials(scene: THREE.Object3D): string[] {
    const bodyMaterials: string[] = [];
    const materialNames: string[] = [];

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const materialName = child.material.name || '';
        materialNames.push(materialName);
        
        // AI pattern matching for car body detection
        if (this.isCarBodyMaterial(materialName, child)) {
          bodyMaterials.push(materialName);
        }
      }
    });

    // If no specific body materials found, use intelligent fallback
    if (bodyMaterials.length === 0) {
      bodyMaterials.push(...this.intelligentFallback(materialNames, scene));
    }

    return bodyMaterials;
  }

  private isCarBodyMaterial(materialName: string, mesh: THREE.Mesh): boolean {
    const name = materialName.toLowerCase();
    
    // Positive patterns for car body materials
    const bodyPatterns = [
      'body', 'exterior', 'paint', 'car_body', 'vehicle_body', 'main_body',
      'chassis', 'shell', 'outer', 'surface', 'metal', 'steel', 'aluminum'
    ];
    
    // Negative patterns for non-body materials (glass, mirrors, wheels, etc.)
    const nonBodyPatterns = [
      'glass', 'window', 'mirror', 'wheel', 'tire', 'rim', 'tyre', 'headlight',
      'taillight', 'light', 'lamp', 'chrome', 'plastic', 'rubber', 'interior',
      'seat', 'dashboard', 'steering', 'console', 'trim', 'grill', 'bumper'
    ];
    
    // Check if material name contains non-body patterns (exclude these)
    if (nonBodyPatterns.some(pattern => name.includes(pattern))) {
      return false;
    }
    
    // Check if material name contains body patterns
    if (bodyPatterns.some(pattern => name.includes(pattern))) {
      return true;
    }
    
    // Additional geometry-based detection for body materials
    const boundingBox = new THREE.Box3().setFromObject(mesh);
    const size = boundingBox.getSize(new THREE.Vector3());
    
    // Body materials are typically large and cover the main surface area
    const isLargeSurface = size.x > 1 && size.y > 0.5 && size.z > 2;
    const isMainBody = mesh.position.y > -0.5 && mesh.position.y < 1.5; // Main body area
    
    return isLargeSurface && isMainBody;
  }

  private intelligentFallback(materialNames: string[], scene: THREE.Object3D): string[] {
    // Find the largest mesh by volume (likely the car body)
    let largestMesh: THREE.Mesh | null = null;
    let maxVolume = 0;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const boundingBox = new THREE.Box3().setFromObject(child);
        const size = boundingBox.getSize(new THREE.Vector3());
        const volume = size.x * size.y * size.z;
        
        if (volume > maxVolume && child.material) {
          maxVolume = volume;
          largestMesh = child;
        }
      }
    });

    if (largestMesh && largestMesh.material) {
      const material = Array.isArray(largestMesh.material) ? largestMesh.material[0] : largestMesh.material;
      const materialName = (material as any).name || '';
      return materialName ? [materialName] : [];
    }
    
    return [];
  }

  // Get AI-powered color suggestions based on current selection and trends
  getColorSuggestions(currentColor: string, userPreferences: string[] = []): string[] {
    const suggestions: string[] = [];
    
    // Complementary colors
    const complementary = this.getComplementaryColor(currentColor);
    suggestions.push(complementary);
    
    // Popular car colors based on trends
    const trendingColors = [
      '#000000', '#FFFFFF', '#3b82f6', '#ef4444', '#22c55e',
      '#a855f7', '#f97316', '#eab308', '#14b8a6', '#8b5cf6'
    ];
    
    // Add trending colors that aren't the current color
    trendingColors.forEach(color => {
      if (color !== currentColor && !suggestions.includes(color)) {
        suggestions.push(color);
      }
    });

    // Add user preference-based suggestions
    userPreferences.forEach(pref => {
      if (!suggestions.includes(pref)) {
        suggestions.push(pref);
      }
    });

    return suggestions.slice(0, 8); // Return top 8 suggestions
  }

  private getComplementaryColor(hexColor: string): string {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate complementary color
    const compR = (255 - r).toString(16).padStart(2, '0');
    const compG = (255 - g).toString(16).padStart(2, '0');
    const compB = (255 - b).toString(16).padStart(2, '0');
    
    return `#${compR}${compG}${compB}`;
  }
}

function Model({ selectedColor, selectedWheel, selectedInterior, modelPath = "/models/car3.glb", onMaterialDetected }: Omit<CarModel3DProps, 'className'>) {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [detectedMaterials, setDetectedMaterials] = useState<string[]>([]);
  const modelRef = useRef<THREE.Object3D>(null);
  const [isRotating, setIsRotating] = useState(true);
  const aiDetector = useMemo(() => AIMaterialDetector.getInstance(), []);
  
  const { scene, nodes, materials } = useGLTF(modelPath, true, true, (loader) => {
    console.log('Loading model...', loader);
  });

  // Detect materials on model load
  useEffect(() => {
    if (scene) {
      const bodyMaterials = aiDetector.detectCarBodyMaterials(scene);
      setDetectedMaterials(bodyMaterials);
      onMaterialDetected?.(bodyMaterials);
      console.log('Detected car body materials:', bodyMaterials);
      setModelLoaded(true);
    }
  }, [scene, aiDetector, onMaterialDetected]);

  // Universal color application that works with any material naming
  useEffect(() => {
    if (scene && selectedColor && detectedMaterials.length > 0) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          // Handle both single material and material arrays
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          
          materials.forEach((material, index) => {
            // Apply color to detected body materials ONLY
            const materialName = (material as any).name || '';
            if (detectedMaterials.includes(materialName)) {
              // Create new material to avoid affecting other instances
              const newMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color(selectedColor.hex),
                metalness: 0.6,
                roughness: 0.2,
                map: (material as any).map, // Preserve existing textures
                normalMap: (material as any).normalMap,
                roughnessMap: (material as any).roughnessMap,
                metalnessMap: (material as any).metalnessMap,
              });
              
              if (Array.isArray(child.material)) {
                child.material[index] = newMaterial;
              } else {
                child.material = newMaterial;
              }
            }
            // DO NOT apply color to glass, mirrors, or wheels - preserve their original materials
          });
        }
      });
    }
  }, [scene, selectedColor, detectedMaterials]);

  // Enhanced wheel customization
  useEffect(() => {
    if (scene && selectedWheel) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Detect wheel meshes by name patterns and geometry
          if (isWheelMesh(child)) {
            applyWheelCustomization(child, selectedWheel);
          }
        }
      });
    }
  }, [scene, selectedWheel]);

  // Enhanced interior customization
  useEffect(() => {
    if (scene && selectedInterior) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Detect interior meshes by name patterns and position
          if (isInteriorMesh(child)) {
            applyInteriorCustomization(child, selectedInterior);
          }
        }
      });
    }
  }, [scene, selectedInterior]);

  // Helper methods for mesh detection
  const isWheelMesh = (mesh: THREE.Mesh): boolean => {
    const name = mesh.name.toLowerCase();
    const wheelPatterns = ['wheel', 'tire', 'rim', 'tyre'];
    
    // Check name patterns
    if (wheelPatterns.some(pattern => name.includes(pattern))) {
      return true;
    }
    
    // Check geometry characteristics (wheels are typically cylindrical)
    const boundingBox = new THREE.Box3().setFromObject(mesh);
    const size = boundingBox.getSize(new THREE.Vector3());
    
    // Wheels are typically round and positioned at the bottom
    const isRound = Math.abs(size.x - size.z) < 0.1; // Similar width and depth
    const isAtBottom = mesh.position.y < 0; // Positioned below center
    
    return isRound && isAtBottom;
  };

  const isInteriorMesh = (mesh: THREE.Mesh): boolean => {
    const name = mesh.name.toLowerCase();
    const interiorPatterns = ['interior', 'seat', 'dashboard', 'steering', 'console'];
    
    // Check name patterns
    if (interiorPatterns.some(pattern => name.includes(pattern))) {
      return true;
    }
    
    // Check if mesh is inside the car body (position-based detection)
    const boundingBox = new THREE.Box3().setFromObject(mesh);
    const center = boundingBox.getCenter(new THREE.Vector3());
    
    // Interior elements are typically centered and not at the very bottom
    const isCentered = Math.abs(center.x) < 0.5;
    const isNotAtBottom = center.y > -0.5;
    
    return isCentered && isNotAtBottom;
  };

  const applyWheelCustomization = (mesh: THREE.Mesh, wheelSelection: { id: string }) => {
    // Apply wheel-specific materials and textures
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2a2a2a'), // Dark wheel color
      metalness: 0.8,
      roughness: 0.1,
    });
    
    // Apply different wheel styles based on selection
    switch (wheelSelection.id) {
      case 'wheel2': // Sport wheels
        wheelMaterial.metalness = 0.9;
        wheelMaterial.roughness = 0.05;
        break;
      case 'wheel3': // Performance wheels
        wheelMaterial.metalness = 0.95;
        wheelMaterial.roughness = 0.02;
        break;
    }
    
    mesh.material = wheelMaterial;
  };

  const applyInteriorCustomization = (mesh: THREE.Mesh, interiorSelection: { id: string }) => {
    // Apply interior-specific materials
    let interiorColor = new THREE.Color('#1a1a1a'); // Default black
    
    switch (interiorSelection.id) {
      case 'interior2': // Premium White
        interiorColor = new THREE.Color('#f8f8f8');
        break;
      case 'interior3': // Luxury Wood Trim
        interiorColor = new THREE.Color('#8B4513');
        break;
    }
    
    const interiorMaterial = new THREE.MeshStandardMaterial({
      color: interiorColor,
      metalness: 0.1,
      roughness: 0.8,
    });
    
    mesh.material = interiorMaterial;
  };

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

const CarModel3D = ({ className = "", selectedColor, selectedWheel, selectedInterior, modelPath, onMaterialDetected }: CarModel3DProps) => {
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
              modelPath={modelPath}
              onMaterialDetected={onMaterialDetected}
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