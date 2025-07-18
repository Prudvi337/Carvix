import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import CarModel3D from "@/components/CarModel3D";
import AIDesignAssistant from "@/components/AIDesignAssistant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Paintbrush, CircleCheck, Palette, Cog, Package, CreditCard, Share2, Save, Smartphone, Brain, Download, Eye, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth";
import { cloudStorage, CarBuild } from "@/services/cloudStorage";
import { carDataService, CarModel, CarColor, CarWheel, CarInterior, CarPackage } from "@/services/carData";

const CustomizeCar = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for car data and customization options
  const [carData, setCarData] = useState<CarModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<CarColor | null>(null);
  const [selectedWheel, setSelectedWheel] = useState<CarWheel | null>(null);
  const [selectedInterior, setSelectedInterior] = useState<CarInterior | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<CarPackage | null>(null);
  const [detectedMaterials, setDetectedMaterials] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(true);

  // Load car data on component mount
  useEffect(() => {
    const loadCarData = async () => {
      if (!carId) {
        toast({
          title: "Error",
          description: "No car ID provided",
          variant: "destructive",
        });
        navigate("/catalog");
        return;
      }

      try {
        setIsLoading(true);
        const car = await carDataService.getCarById(carId);
        
        if (!car) {
          toast({
            title: "Car Not Found",
            description: "The requested car model could not be found",
            variant: "destructive",
          });
          navigate("/catalog");
          return;
        }

        setCarData(car);
        
        // Set default selections
        if (car.customizationOptions.colors.length > 0) {
          setSelectedColor(car.customizationOptions.colors[0]);
        }
        if (car.customizationOptions.wheels.length > 0) {
          setSelectedWheel(car.customizationOptions.wheels[0]);
        }
        if (car.customizationOptions.interiors.length > 0) {
          setSelectedInterior(car.customizationOptions.interiors[0]);
        }
        if (car.customizationOptions.packages.length > 0) {
          setSelectedPackage(car.customizationOptions.packages[0]);
        }
      } catch (error) {
        console.error('Error loading car data:', error);
        toast({
          title: "Error",
          description: "Failed to load car data",
          variant: "destructive",
        });
        navigate("/catalog");
      } finally {
        setIsLoading(false);
      }
    };

    loadCarData();
  }, [carId, navigate, toast]);

  // Calculate total price
  const totalPrice = carData ? 
    carData.basePrice + 
    (selectedColor?.price || 0) + 
    (selectedWheel?.price || 0) + 
    (selectedInterior?.price || 0) + 
    (selectedPackage?.price || 0) : 0;

  const buildId = "custom-" + carId + "-" + Date.now();

  // Handle AI suggestion application
  const handleApplyAISuggestion = (suggestion: any) => {
    switch (suggestion.type) {
      case 'color':
        const colorOption = carData?.customizationOptions.colors.find(c => c.hex === suggestion.hex);
        if (colorOption) {
          setSelectedColor(colorOption);
          toast({
            title: "Color Applied",
            description: `Applied ${suggestion.title} based on AI recommendation`,
            duration: 3000,
          });
        }
        break;
      case 'wheel':
        const wheelOption = carData?.customizationOptions.wheels.find(w => w.id === suggestion.id.split('-')[1]);
        if (wheelOption) {
          setSelectedWheel(wheelOption);
          toast({
            title: "Wheels Applied",
            description: `Applied ${suggestion.title} based on AI recommendation`,
            duration: 3000,
          });
        }
        break;
      case 'interior':
        const interiorOption = carData?.customizationOptions.interiors.find(i => i.id === suggestion.id.split('-')[1]);
        if (interiorOption) {
          setSelectedInterior(interiorOption);
          toast({
            title: "Interior Applied",
            description: `Applied ${suggestion.title} based on AI recommendation`,
            duration: 3000,
          });
        }
        break;
      case 'package':
        const packageOption = carData?.customizationOptions.packages.find(p => p.id === suggestion.id.split('-')[1]);
        if (packageOption) {
          setSelectedPackage(packageOption);
          toast({
            title: "Package Applied",
            description: `Applied ${suggestion.title} based on AI recommendation`,
            duration: 3000,
          });
        }
        break;
    }
  };

  // Handlers
  const handleSaveBuild = async () => {
    if (!authService.isAuthenticated()) {
      toast({
        title: "Login Required",
        description: "Please log in to save your build to the cloud.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsSaving(true);
    try {
      const buildData: Omit<CarBuild, 'id' | 'userId' | 'metadata'> = {
        carId: carId || '',
        carName: carData?.name || '',
        basePrice: carData?.basePrice || 0,
        totalPrice: totalPrice,
        customizations: {
          color: selectedColor,
          wheel: selectedWheel,
          interior: selectedInterior,
          package: selectedPackage,
        },
        specifications: {
          range: "320 miles",
          topSpeed: "155 mph",
          acceleration: "3.1 seconds 0-60 mph",
          power: "670 hp"
        }
      };

      const savedBuildId = await cloudStorage.saveBuild(buildData);
      
      toast({
        title: "Build Saved to Cloud",
        description: "Your custom build has been saved and is accessible from any device.",
        duration: 3000,
      });

      // Navigate to build detail page
      navigate(`/build/${savedBuildId}`);
    } catch (error) {
      console.error('Save build error:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save build. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareBuild = async () => {
    if (!authService.isAuthenticated()) {
      toast({
        title: "Login Required",
        description: "Please log in to share your build.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      // Create a temporary build for sharing
      const buildData: Omit<CarBuild, 'id' | 'userId' | 'metadata'> = {
        carId: carId || '',
        carName: carData?.name || '',
        basePrice: carData?.basePrice || 0,
        totalPrice: totalPrice,
        customizations: {
          color: selectedColor,
          wheel: selectedWheel,
          interior: selectedInterior,
          package: selectedPackage,
        },
        specifications: {
          range: "320 miles",
          topSpeed: "155 mph",
          acceleration: "3.1 seconds 0-60 mph",
          power: "670 hp"
        }
      };

      const savedBuildId = await cloudStorage.saveBuild(buildData);
      await cloudStorage.shareBuild(savedBuildId, "Check out my custom car build!", ["custom", "electric", "performance"]);
      
      // Copy share link to clipboard
      const shareUrl = `${window.location.origin}/build/${savedBuildId}`;
      await navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: "Build Shared",
        description: "Build link has been copied to clipboard and is now public.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Share build error:', error);
      toast({
        title: "Share Failed",
        description: "Failed to share build. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleViewInAR = () => {
    navigate(`/ar/${buildId}`);
  };

  const handleExportManufacturingSpecs = async () => {
    if (!authService.isAuthenticated()) {
      toast({
        title: "Login Required",
        description: "Please log in to export manufacturing specifications.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      // First save the build
      const buildData: Omit<CarBuild, 'id' | 'userId' | 'metadata'> = {
        carId: carId || '',
        carName: carData?.name || '',
        basePrice: carData?.basePrice || 0,
        totalPrice: totalPrice,
        customizations: {
          color: selectedColor,
          wheel: selectedWheel,
          interior: selectedInterior,
          package: selectedPackage,
        },
        specifications: {
          range: "320 miles",
          topSpeed: "155 mph",
          acceleration: "3.1 seconds 0-60 mph",
          power: "670 hp"
        }
      };

      const savedBuildId = await cloudStorage.saveBuild(buildData);
      
      // Generate manufacturing specifications
      const manufacturingSpecs = await cloudStorage.generateManufacturingSpecs(savedBuildId);
      
      // Create downloadable JSON file
      const dataStr = JSON.stringify(manufacturingSpecs, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `manufacturing-specs-${savedBuildId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Manufacturing Specs Exported",
        description: "Production-ready specifications have been downloaded.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export manufacturing specifications.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleProceedToCheckout = () => {
    // Save current build to session/local storage
    const buildConfig = {
      carId,
      buildId,
      basePrice: carData?.basePrice || 0,
      color: selectedColor,
      wheel: selectedWheel, 
      interior: selectedInterior,
      package: selectedPackage,
      totalPrice: totalPrice
    };
    
    localStorage.setItem('currentBuild', JSON.stringify(buildConfig));
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary-500" />
              <h2 className="text-xl font-semibold mb-2">Loading Car Data</h2>
              <p className="text-muted-foreground">Please wait while we load the car customization options...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!carData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Car Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested car model could not be found.</p>
            <Button onClick={() => navigate("/catalog")}>
              Back to Catalog
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Model Viewer */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden bg-black/5 backdrop-blur-sm border-primary-500/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center justify-between">
                  <span>{carData?.name} Customizer</span>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowAIAssistant(!showAIAssistant)}
                      className="flex items-center gap-1"
                    >
                      <Brain className="h-4 w-4" />
                      <span className="hidden sm:inline">AI Assistant</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleSaveBuild} 
                      disabled={isSaving}
                      className="flex items-center gap-1"
                    >
                      <Save className="h-4 w-4" />
                      <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleShareBuild} 
                      className="flex items-center gap-1"
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Share</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleViewInAR} 
                      className="flex items-center gap-1 text-primary-500"
                    >
                      <Smartphone className="h-4 w-4" />
                      <span className="hidden sm:inline">View in AR</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleExportManufacturingSpecs} 
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Export</span>
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Customize your dream car exactly how you want it with AI-powered suggestions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <CarModel3D 
                  className="h-[400px] w-full" 
                  selectedColor={selectedColor}
                  selectedWheel={selectedWheel}
                  selectedInterior={selectedInterior}
                  modelPath={carData.model3D}
                  onMaterialDetected={setDetectedMaterials}
                />
              </CardContent>
              <CardFooter className="bg-black/10 p-4">
                <div className="text-sm text-muted-foreground">
                  Use mouse to rotate. Scroll to zoom in/out. AI detected {detectedMaterials.length} paintable materials.
                </div>
              </CardFooter>
            </Card>

            {/* AI Design Assistant */}
            {showAIAssistant && (
              <div className="mt-6">
                <AIDesignAssistant
                  currentSelections={{
                    color: selectedColor,
                    wheel: selectedWheel,
                    interior: selectedInterior,
                    package: selectedPackage,
                  }}
                  onApplySuggestion={handleApplyAISuggestion}
                  userPreferences={authService.getCurrentUserProfile()?.preferences.favoriteColors || []}
                />
              </div>
            )}
          </div>

          {/* Customization Options */}
          <div className="lg:col-span-1">
            <Card className="backdrop-blur-sm border-primary-500/20">
              <CardHeader>
                <CardTitle>Customize Your Vehicle</CardTitle>
                <CardDescription>Select options below to personalize</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="color">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="color" className="flex flex-col items-center gap-1 py-2">
                      <Palette className="h-4 w-4" />
                      <span className="text-xs">Color</span>
                    </TabsTrigger>
                    <TabsTrigger value="wheels" className="flex flex-col items-center gap-1 py-2">
                      <Cog className="h-4 w-4" />
                      <span className="text-xs">Wheels</span>
                    </TabsTrigger>
                    <TabsTrigger value="interior" className="flex flex-col items-center gap-1 py-2">
                      <Paintbrush className="h-4 w-4" />
                      <span className="text-xs">Interior</span>
                    </TabsTrigger>
                    <TabsTrigger value="packages" className="flex flex-col items-center gap-1 py-2">
                      <Package className="h-4 w-4" />
                      <span className="text-xs">Packages</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="color">
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Exterior Color</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {carData?.customizationOptions.colors.map((color) => (
                          <div
                            key={color.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${selectedColor?.id === color.id ? 'ring-2 ring-primary-500' : 'hover:border-primary-300'}`}
                            onClick={() => setSelectedColor(color)}
                          >
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-8 h-8 rounded-full border"
                                style={{ backgroundColor: color.hex }}
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{color.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {color.price === 0 ? 'Included' : `+$${color.price.toLocaleString()}`}
                                </p>
                              </div>
                              {selectedColor?.id === color.id && (
                                <CircleCheck className="h-5 w-5 text-primary-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="wheels">
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Wheels</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {carData?.customizationOptions.wheels.map((wheel) => (
                          <div
                            key={wheel.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${selectedWheel?.id === wheel.id ? 'ring-2 ring-primary-500' : 'hover:border-primary-300'}`}
                            onClick={() => setSelectedWheel(wheel)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Cog className="h-6 w-6 text-gray-700" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{wheel.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {wheel.price === 0 ? 'Included' : `+$${wheel.price.toLocaleString()}`}
                                </p>
                              </div>
                              {selectedWheel?.id === wheel.id && (
                                <CircleCheck className="h-5 w-5 text-primary-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="interior">
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Interior</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {carData?.customizationOptions.interiors.map((interior) => (
                          <div
                            key={interior.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${selectedInterior?.id === interior.id ? 'ring-2 ring-primary-500' : 'hover:border-primary-300'}`}
                            onClick={() => setSelectedInterior(interior)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Paintbrush className="h-6 w-6 text-gray-700" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{interior.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {interior.price === 0 ? 'Included' : `+$${interior.price.toLocaleString()}`}
                                </p>
                              </div>
                              {selectedInterior?.id === interior.id && (
                                <CircleCheck className="h-5 w-5 text-primary-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="packages">
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Packages</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {carData?.customizationOptions.packages.map((pkg) => (
                          <div
                            key={pkg.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${selectedPackage?.id === pkg.id ? 'ring-2 ring-primary-500' : 'hover:border-primary-300'}`}
                            onClick={() => setSelectedPackage(pkg)}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">{pkg.name}</p>
                                <p className="text-sm font-medium text-primary-600">
                                  {pkg.price === 0 ? 'Included' : `+$${pkg.price.toLocaleString()}`}
                                </p>
                              </div>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {pkg.features.map((feature, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <CircleCheck className="h-3 w-3 text-green-500" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                              {selectedPackage?.id === pkg.id && (
                                <div className="flex items-center gap-2 text-primary-500">
                                  <CircleCheck className="h-4 w-4" />
                                  <span className="text-sm font-medium">Selected</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Price Summary */}
            <Card className="mt-6 backdrop-blur-sm border-primary-500/20">
              <CardHeader>
                <CardTitle>Price Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Base Price</span>
                  <span>${carData?.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Color Upgrade</span>
                  <span>+${selectedColor?.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Wheel Upgrade</span>
                  <span>+${selectedWheel?.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Interior Upgrade</span>
                  <span>+${selectedInterior?.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Package Upgrade</span>
                  <span>+${selectedPackage?.price.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Price</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleProceedToCheckout}
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomizeCar;
