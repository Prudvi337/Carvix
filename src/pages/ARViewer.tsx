import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Smartphone, 
  CreditCard, 
  Share2,
  Palette, 
  Maximize, 
  Camera, 
  Info, 
  X,
  Check,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { carDataService, CarModel } from "@/services/carData";
import * as THREE from 'three';

// Car model info (would come from API in real app)
const CAR_MODELS = {
  "1": {
    name: "Velocity X3",
    color: "#3b82f6",
    price: 45999,
  },
  "2": {
    name: "Eco Explorer",
    color: "#22c55e",
    price: 38500,
  },
  "3": {
    name: "Luxury Phantom",
    color: "#a855f7",
    price: 82750,
  }
};

// Available colors for the car
const AVAILABLE_COLORS = [
  { name: "Electric Blue", value: "#3b82f6" },
  { name: "Racing Red", value: "#ef4444" },
  { name: "Forest Green", value: "#22c55e" },
  { name: "Midnight Black", value: "#171717" },
  { name: "Arctic White", value: "#f8fafc" },
  { name: "Royal Purple", value: "#a855f7" },
  { name: "Sunburst Yellow", value: "#eab308" },
  { name: "Ocean Teal", value: "#14b8a6" },
];

const ARViewer = () => {
  const { buildId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isARSupported, setIsARSupported] = useState(false);
  const [isARSessionActive, setIsARSessionActive] = useState(false);
  const [carData, setCarData] = useState<CarModel | null>(null);
  const [currentColor, setCurrentColor] = useState("#3b82f6");
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arSessionRef = useRef<XRSession | null>(null);
  const carModelRef = useRef<THREE.Object3D | null>(null);

  // Check WebXR AR support
  useEffect(() => {
    const checkARSupport = async () => {
      try {
        if ('xr' in navigator) {
          const isSupported = await navigator.xr.isSessionSupported('immersive-ar');
          setIsARSupported(isSupported);
          
          if (!isSupported) {
            setError('AR is not supported on this device. Please try on a compatible smartphone or tablet.');
          }
        } else {
          setError('WebXR is not supported in this browser. Please use a modern browser with AR support.');
        }
      } catch (err) {
        setError('Failed to check AR support. Please try again.');
      }
    };

    checkARSupport();
  }, []);

  // Load car data
  useEffect(() => {
    const loadCarData = async () => {
      if (!buildId) {
        setError('No build ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const carId = buildId.split('-')[0];
        const car = await carDataService.getCarById(carId);
        if (car) {
          setCarData(car);
          if (car.customizationOptions.colors.length > 0) {
            setCurrentColor(car.customizationOptions.colors[0].hex);
          }
        } else {
          setError('Car data not found');
        }
      } catch (err) {
        setError('Failed to load car data');
      } finally {
        setIsLoading(false);
      }
    };

    loadCarData();
  }, [buildId]);

  // Initialize AR session
  const startARSession = useCallback(async () => {
    if (!isARSupported || !canvasRef.current) return;

    try {
      setIsLoading(true);
      
      // Request AR session
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'dom-overlay'],
        domOverlay: { root: canvasRef.current }
      });

      arSessionRef.current = session;
      setIsARSessionActive(true);

      // Set up AR session
      session.addEventListener('end', () => {
        setIsARSessionActive(false);
        arSessionRef.current = null;
      });

      // Start rendering loop
      session.requestReferenceSpace('viewer').then((referenceSpace) => {
        session.requestAnimationFrame((time, frame) => {
          renderARFrame(time, frame, referenceSpace);
        });
      });

      toast({
        title: "AR Session Started",
        description: "Point your camera at a flat surface to place the car.",
      });

    } catch (err) {
      console.error('Failed to start AR session:', err);
      setError('Failed to start AR session. Please check camera permissions and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isARSupported, toast]);

  // Render AR frame
  const renderARFrame = (time: number, frame: XRFrame, referenceSpace: XRReferenceSpace) => {
    if (!arSessionRef.current || !canvasRef.current) return;

    const session = arSessionRef.current;
    const pose = frame.getViewerPose(referenceSpace);

    if (pose) {
      // Update car model position and rotation
      if (carModelRef.current) {
        carModelRef.current.scale.setScalar(scale);
        carModelRef.current.rotation.y = rotation;
      }

      // Continue rendering
      session.requestAnimationFrame((time, frame) => {
        renderARFrame(time, frame, referenceSpace);
      });
    }
  };

  // Handle AR interactions
  const handleARInteraction = (event: any) => {
    if (!arSessionRef.current) return;

    // Handle tap to place car
    const hitTestSource = event.frame.getHitTestSource(event.inputSource);
    if (hitTestSource) {
      const hitTestResults = event.frame.getHitTestResults(hitTestSource);
      if (hitTestResults.length > 0) {
        const hit = hitTestResults[0];
        const pose = hit.getPose(event.referenceSpace);
        
        if (pose && carModelRef.current) {
          carModelRef.current.position.set(
            pose.transform.position.x,
            pose.transform.position.y,
            pose.transform.position.z
          );
        }
      }
    }
  };

  // Handle color change
  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    setShowColorPicker(false);
    
    // Update car model color in AR
    if (carModelRef.current) {
      // Apply color to car model materials
      carModelRef.current.traverse((child: any) => {
        if (child.isMesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat: any) => {
              if (mat.name && mat.name.toLowerCase().includes('body')) {
                mat.color.setHex(parseInt(color.replace('#', ''), 16));
              }
            });
          } else {
            if (child.material.name && child.material.name.toLowerCase().includes('body')) {
              child.material.color.setHex(parseInt(color.replace('#', ''), 16));
            }
          }
        }
      });
    }
    
    toast({
      title: "Color Updated",
      description: "Car color has been changed in AR view.",
      duration: 1500,
    });
  };

  // Handle zoom and rotation
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 45) % 360);

  // Handle screenshot
  const handleScreenCapture = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `ar-capture-${buildId}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
      
      toast({
        title: "Screenshot Captured",
        description: "AR view saved to your device.",
      });
    }
  };

  // Handle back navigation
  const handleBackToCustomization = () => {
    if (arSessionRef.current) {
      arSessionRef.current.end();
    }
    navigate(`/customize/${buildId?.split('-')[0]}`);
  };

  // Handle checkout
  const handleProceedToCheckout = () => {
    if (arSessionRef.current) {
      arSessionRef.current.end();
    }
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <Layout hideNavbar={true} hideFooter={true}>
        <div className="fixed inset-0 bg-black flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-white" />
            <p className="text-white text-lg">Loading AR Experience...</p>
            <p className="text-gray-400 text-sm mt-2">Please wait while we prepare your virtual experience</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout hideNavbar={true} hideFooter={true}>
        <div className="fixed inset-0 bg-black flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">AR Not Available</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <div className="space-y-3">
              <Button onClick={handleBackToCustomization} className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Customization
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()} className="w-full">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideNavbar={true} hideFooter={true}>
      <div className="fixed inset-0 bg-black">
        {/* AR Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: isARSessionActive ? 'block' : 'none' }}
        />
        
        {/* AR Instructions Overlay */}
        {!isARSessionActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-6">
              <Smartphone className="h-16 w-16 text-primary-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">AR Experience Ready</h2>
              <p className="text-gray-300 mb-6">
                View your custom {carData?.name} in your real environment using augmented reality.
              </p>
              <Button 
                onClick={startARSession}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
                size="lg"
              >
                Start AR Experience
              </Button>
            </div>
          </div>
        )}

        {/* AR Controls */}
        {isARSessionActive && (
          <>
            {/* Top Controls */}
            <div className="absolute top-4 left-0 right-0 flex justify-between px-4 z-10">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBackToCustomization} 
                className="bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleScreenCapture} 
                  className="bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70"
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowColorPicker(!showColorPicker)} 
                  className="bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70"
                >
                  <Palette className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-4 left-4 right-4">
              <Card className="bg-black/70 backdrop-blur-md border-white/10">
                <CardHeader className="py-2 px-4">
                  <CardTitle className="text-white text-lg flex justify-between items-center">
                    <span>AR Preview: {carData?.name}</span>
                    <span className="text-sm text-primary-400">
                      ${carData?.basePrice.toLocaleString()}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <div className="flex justify-center space-x-3">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="w-10 h-10 rounded-full bg-black/50 border-white/20 text-white hover:bg-black/70"
                      onClick={handleZoomIn}
                    >
                      <ZoomIn className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="w-10 h-10 rounded-full bg-black/50 border-white/20 text-white hover:bg-black/70"
                      onClick={handleZoomOut}
                    >
                      <ZoomOut className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="w-10 h-10 rounded-full bg-black/50 border-white/20 text-white hover:bg-black/70"
                      onClick={handleRotate}
                    >
                      <RotateCcw className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  {/* Color Picker */}
                  {showColorPicker && carData && (
                    <div className="mt-3 p-3 bg-black/80 rounded-lg border border-gray-700">
                      <div className="text-white/90 text-xs mb-2">Choose a color:</div>
                      <div className="grid grid-cols-4 gap-2">
                        {carData.customizationOptions.colors.map((color) => (
                          <button
                            key={color.hex}
                            className={`w-full h-8 rounded transition-all ${currentColor === color.hex ? 'ring-2 ring-primary-500 scale-110' : 'hover:scale-105'}`}
                            style={{ backgroundColor: color.hex }}
                            onClick={() => handleColorChange(color.hex)}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-2 pb-4 px-4">
                  <Button 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 w-full" 
                    onClick={handleProceedToCheckout}
                  >
                    <CreditCard className="mr-2 h-4 w-4" /> Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ARViewer;
