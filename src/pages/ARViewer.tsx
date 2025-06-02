import { useEffect, useState, useRef } from "react";
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
  Check
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
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState("#3b82f6");
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [readyToPlace, setReadyToPlace] = useState(false);
  const [carPlaced, setCarPlaced] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Extract car ID from build ID
  const carId = buildId?.split('-')[0] || '1';

  // Get car info
  const carInfo = CAR_MODELS[carId as keyof typeof CAR_MODELS] || CAR_MODELS["1"];

  useEffect(() => {
    // Initialize the AR experience
    const timer = setTimeout(() => {
      setIsLoading(false);
      requestCameraPermission();
    }, 2000);
    
    // Set initial color
    setCurrentColor(carInfo.color);
    
    return () => clearTimeout(timer);
  }, [carInfo.color]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      // This would be a real camera permission request in a production app
      // For this demo, we'll simulate a successful permission grant after a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setCameraPermission(true);
      toast({
        title: "Camera Access Granted",
        description: "AR viewer is ready to use.",
        duration: 3000,
      });
    } catch (error) {
      setCameraPermission(false);
      toast({
        title: "Camera Access Denied",
        description: "Please enable camera access to use AR features.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        toast({
          title: "Fullscreen Error",
          description: "Could not enable fullscreen mode.",
          variant: "destructive",
        });
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 45) % 360);
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    setShowColorPicker(false);
    
    toast({
      title: "Color Updated",
      description: "Car color has been changed successfully.",
      duration: 1500,
    });
  };

  const handleScreenCapture = () => {
    // In a real app, this would capture the current AR view
    toast({
      title: "Screenshot Captured",
      description: "Image saved to your gallery.",
    });
  };

  const handleBackToCustomization = () => {
    navigate(`/customize/${carId}`);
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const handleShareClick = () => {
    setShowShareDialog(true);
  };

  const handlePlaceCar = () => {
    if (readyToPlace) {
      setCarPlaced(true);
      toast({
        title: "Car Placed",
        description: "Your car has been placed in the environment.",
      });
    } else {
      setReadyToPlace(true);
      toast({
        title: "Position Ready",
        description: "Tap on the screen to place your car.",
      });
    }
  };

  const handleCopyShareLink = () => {
    // In a real app, this would copy a shareable link
    navigator.clipboard.writeText(`https://carvix.com/share/ar/${buildId}`);
    toast({
      title: "Link Copied",
      description: "Share link copied to clipboard.",
    });
    setShowShareDialog(false);
  };

  return (
    <Layout hideNavbar={true} hideFooter={true}>
      <div 
        ref={containerRef}
        className="fixed inset-0 bg-black"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {isLoading ? (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-white text-lg">Loading AR Experience...</p>
              <p className="text-gray-400 text-sm mt-2">Please wait while we prepare your virtual experience</p>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {/* AR View Placeholder - This would be replaced with a real AR library */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black">
                {cameraPermission === false && (
                  <div className="absolute inset-0 flex items-center justify-center flex-col p-6">
                    <Smartphone className="h-16 w-16 text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Camera Access Required</h2>
                    <p className="text-gray-300 text-center max-w-md mb-6">
                      To use the AR viewer, please enable camera access in your browser settings and reload the page.
                    </p>
                    <Button onClick={requestCameraPermission}>
                      Try Again
                    </Button>
                  </div>
                )}
                
                {cameraPermission === true && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      {/* Simulated camera feed with car overlay */}
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MCA4MCI+PHBhdGggZD0iTTAgMGg4MHY4MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBoODB2ODBIMHptNzkgNzlIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxeiIgZmlsbD0iIzMzMyIgZmlsbC1vcGFjaXR5PSIuMSIvPjwvc3ZnPg==')]"></div>
                      
                      {/* AR Car model - In real implementation, this would be an AR model */}
                      {carPlaced ? (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10" style={{
                          transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`
                        }}>
                          <div className="w-80 h-40 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg shadow-primary-500/20 animate-float">
                            <div className="w-full h-full relative">
                              {/* Car body */}
                              <div 
                                className="absolute w-3/4 h-2/5 rounded-t-2xl top-[30%] left-[12.5%] transition-colors duration-300"
                                style={{ backgroundColor: `${currentColor}BB` }}
                              ></div>
                              {/* Car windows */}
                              <div className="absolute w-4/5 h-1/5 bg-gray-700/70 rounded-t-lg bottom-[20%] left-[10%]"></div>
                              {/* Car wheels */}
                              <div className="absolute w-1/6 h-1/5 bg-black/70 rounded-full bottom-[15%] left-[15%]"></div>
                              <div className="absolute w-1/6 h-1/5 bg-black/70 rounded-full bottom-[15%] right-[15%]"></div>
                              {/* Car headlight */}
                              <div className="absolute w-1/12 h-1/12 bg-yellow-300/70 rounded-full top-[40%] right-[15%] animate-pulse"></div>
                              <div className="absolute w-1/12 h-1/12 bg-yellow-300/70 rounded-full top-[40%] left-[15%] animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-80 h-40 bg-primary-500/20 backdrop-blur-sm rounded-xl border border-primary-500/30 shadow-lg shadow-primary-500/20 animate-pulse">
                            <div className="flex items-center justify-center h-full">
                              <p className="text-white/80 text-center">
                                {readyToPlace 
                                  ? "Tap anywhere to place your car" 
                                  : "Press the Place button to position your car"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {readyToPlace && !carPlaced && (
                        <div 
                          className="absolute inset-0 cursor-pointer"
                          onClick={() => setCarPlaced(true)}
                        ></div>
                      )}
                      
                      {/* Guide lines */}
                      {!carPlaced && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute bottom-1/4 left-0 right-0 border-t border-dashed border-white/30"></div>
                          <div className="absolute bottom-0 left-1/3 top-0 border-l border-dashed border-white/30"></div>
                          <div className="absolute bottom-0 right-1/3 top-0 border-l border-dashed border-white/30"></div>
                        </div>
                      )}
                      
                      {/* Targeting recticle */}
                      {readyToPlace && !carPlaced && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                          <div className="w-32 h-32 border-2 border-primary-500/80 rounded-full flex items-center justify-center animate-pulse">
                            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Top controls */}
              <div className="absolute top-4 left-0 right-0 flex justify-between px-4 z-10">
                <Button variant="outline" size="sm" onClick={handleBackToCustomization} className="bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowInfo(!showInfo)} 
                    className="bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleFullscreen} 
                    className="bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70"
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Bottom controls */}
              <div className="absolute bottom-8 left-0 right-0 px-4 z-10">
                <Card className="bg-black/70 backdrop-blur-md border-white/10">
                  <CardHeader className="py-2 px-4">
                    <CardTitle className="text-white text-lg flex justify-between items-center">
                      <span>AR Preview: {carInfo.name}</span>
                      <span className="text-sm text-primary-400">${carInfo.price.toLocaleString()}</span>
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
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="w-10 h-10 rounded-full bg-black/50 border-white/20 text-white hover:bg-black/70"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                      >
                        <Palette className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="w-10 h-10 rounded-full bg-black/50 border-white/20 text-white hover:bg-black/70"
                        onClick={handleScreenCapture}
                      >
                        <Camera className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="w-10 h-10 rounded-full bg-black/50 border-white/20 text-white hover:bg-black/70"
                        onClick={handleShareClick}
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    {showColorPicker && (
                      <div className="mt-3 p-3 bg-black/80 rounded-lg border border-gray-700">
                        <div className="text-white/90 text-xs mb-2">Choose a color:</div>
                        <div className="grid grid-cols-4 gap-2">
                          {AVAILABLE_COLORS.map((color) => (
                            <button
                              key={color.value}
                              className={`w-full h-8 rounded transition-all ${currentColor === color.value ? 'ring-2 ring-primary-500 scale-110' : 'hover:scale-105'}`}
                              style={{ backgroundColor: color.value }}
                              onClick={() => handleColorChange(color.value)}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="py-3 px-4 flex justify-between">
                    <Button
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={handlePlaceCar}
                      disabled={carPlaced}
                    >
                      {carPlaced ? (
                        <>
                          <Check className="mr-2 h-4 w-4" /> Placed
                        </>
                      ) : (
                        <>
                          {readyToPlace ? "Tap to Place" : "Place Car"}
                        </>
                      )}
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600" 
                      onClick={handleProceedToCheckout}
                    >
                      <CreditCard className="mr-2 h-4 w-4" /> Proceed to Checkout
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              {/* Car info panel */}
              {showInfo && (
                <div className="absolute top-16 right-4 z-20 w-64 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 p-4 animate-fade-in">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-white font-bold">{carInfo.name}</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10"
                      onClick={() => setShowInfo(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">Price:</span>
                      <span className="text-white font-medium">${carInfo.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Range:</span>
                      <span className="text-white font-medium">420 miles</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">0-60 mph:</span>
                      <span className="text-white font-medium">3.2 seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Top Speed:</span>
                      <span className="text-white font-medium">155 mph</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Drivetrain:</span>
                      <span className="text-white font-medium">AWD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Warranty:</span>
                      <span className="text-white font-medium">5 years</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this AR Experience</DialogTitle>
            <DialogDescription>
              Share your custom {carInfo.name} AR view with friends and family.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <div className="grid flex-1 gap-2">
              <div className="flex items-center justify-center p-4 border border-input bg-background rounded-md">
                <span className="text-sm break-all">https://carvix.com/share/ar/{buildId}</span>
              </div>
            </div>
            <Button 
              onClick={handleCopyShareLink}
              className="bg-primary-500 hover:bg-primary-600"
            >
              Copy
            </Button>
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <Button variant="outline" className="w-10 h-10 p-0 rounded-full" title="Share to Facebook">
              <span className="sr-only">Facebook</span>
              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </Button>
            <Button variant="outline" className="w-10 h-10 p-0 rounded-full" title="Share to Twitter">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </Button>
            <Button variant="outline" className="w-10 h-10 p-0 rounded-full" title="Share via Email">
              <span className="sr-only">Email</span>
              <svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </Button>
            <Button variant="outline" className="w-10 h-10 p-0 rounded-full" title="Share via WhatsApp">
              <span className="sr-only">WhatsApp</span>
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogDescription>
              Anyone with the link can view this AR experience.
            </DialogDescription>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ARViewer;
