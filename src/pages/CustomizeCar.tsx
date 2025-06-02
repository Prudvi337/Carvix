
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import CarModel3D from "@/components/CarModel3D";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Paintbrush, CircleCheck, Palette, Cog, Package, CreditCard, Share2, Save, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for car options
const colorOptions = [
  { id: "color1", name: "Midnight Black", hex: "#000000", price: 0 },
  { id: "color2", name: "Arctic White", hex: "#FFFFFF", price: 0 },
  { id: "color3", name: "Cyber Blue", hex: "#0ea5e9", price: 800 },
  { id: "color4", name: "Quantum Purple", hex: "#8b5cf6", price: 800 },
  { id: "color5", name: "Sunset Orange", hex: "#f97316", price: 1200 },
];

const wheelOptions = [
  { id: "wheel1", name: "Standard 18\"", image: "/placeholder.svg", price: 0 },
  { id: "wheel2", name: "Sport 19\"", image: "/placeholder.svg", price: 1500 },
  { id: "wheel3", name: "Performance 20\"", image: "/placeholder.svg", price: 2500 },
];

const interiorOptions = [
  { id: "interior1", name: "Standard Black", image: "/placeholder.svg", price: 0 },
  { id: "interior2", name: "Premium White", image: "/placeholder.svg", price: 1200 },
  { id: "interior3", name: "Luxury Wood Trim", image: "/placeholder.svg", price: 2000 },
];

const packageOptions = [
  { id: "package1", name: "Base Package", features: ["Standard Audio", "Manual Seats", "Basic Safety"], price: 0 },
  { id: "package2", name: "Premium Package", features: ["Premium Audio", "Heated Seats", "Advanced Safety"], price: 4500 },
  { id: "package3", name: "Ultimate Package", features: ["Premium Audio", "Ventilated Seats", "Full Self-Driving"], price: 8000 },
];

// Mock car base data
const carBaseData = {
  id: "model-x",
  name: "Model X",
  basePrice: 45000,
  image: "/placeholder.svg",
  description: "Electric performance sedan with cutting-edge technology and impressive range."
};

const CustomizeCar = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for customization options
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [selectedWheel, setSelectedWheel] = useState(wheelOptions[0]);
  const [selectedInterior, setSelectedInterior] = useState(interiorOptions[0]);
  const [selectedPackage, setSelectedPackage] = useState(packageOptions[0]);

  // Calculate total price
  const totalPrice = carBaseData.basePrice + 
    selectedColor.price + 
    selectedWheel.price + 
    selectedInterior.price + 
    selectedPackage.price;

  const buildId = "custom-" + carId + "-" + Date.now();

  // Handlers
  const handleSaveBuild = () => {
    toast({
      title: "Build Saved",
      description: "Your custom build has been saved.",
      duration: 3000,
    });
  };

  const handleShareBuild = () => {
    toast({
      title: "Link Copied",
      description: "Build link has been copied to clipboard.",
      duration: 3000,
    });
  };

  const handleViewInAR = () => {
    navigate(`/ar/${buildId}`);
  };

  const handleProceedToCheckout = () => {
    // Save current build to session/local storage
    const buildConfig = {
      carId,
      buildId,
      basePrice: carBaseData.basePrice,
      color: selectedColor,
      wheel: selectedWheel, 
      interior: selectedInterior,
      package: selectedPackage,
      totalPrice: totalPrice
    };
    
    localStorage.setItem('currentBuild', JSON.stringify(buildConfig));
    navigate('/checkout');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Model Viewer */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden bg-black/5 backdrop-blur-sm border-primary-500/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center justify-between">
                  <span>{carBaseData.name} Customizer</span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleSaveBuild} className="flex items-center gap-1">
                      <Save className="h-4 w-4" />
                      <span className="hidden sm:inline">Save</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShareBuild} className="flex items-center gap-1">
                      <Share2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Share</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleViewInAR} className="flex items-center gap-1 text-primary-500">
                      <Smartphone className="h-4 w-4" />
                      <span className="hidden sm:inline">View in AR</span>
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Customize your dream car exactly how you want it
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-0 min-h-[400px] bg-gradient-to-b from-gray-900 to-black">
                <CarModel3D 
                  className="h-[400px] w-[900px]" 
                  selectedColor={selectedColor}
                  selectedWheel={selectedWheel}
                  selectedInterior={selectedInterior}
                />
                </CardContent>
              <CardFooter className="bg-black/10 p-4">
                <div className="text-sm text-muted-foreground">
                  Use mouse to rotate. Scroll to zoom in/out.
                </div>
              </CardFooter>
            </Card>
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
                  <TabsContent value="color" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Exterior Color</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {colorOptions.map((color) => (
                          <div
                            key={color.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${selectedColor.id === color.id ? 'ring-2 ring-primary-500' : 'hover:border-primary-300'}`}
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
                              {selectedColor.id === color.id && (
                                <CircleCheck className="h-5 w-5 text-primary-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="wheels" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Wheels</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {wheelOptions.map((wheel) => (
                          <div
                            key={wheel.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${selectedWheel.id === wheel.id ? 'ring-2 ring-primary-500' : 'hover:border-primary-300'}`}
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
                              {selectedWheel.id === wheel.id && (
                                <CircleCheck className="h-5 w-5 text-primary-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="interior" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Interior</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {interiorOptions.map((interior) => (
                          <div
                            key={interior.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${selectedInterior.id === interior.id ? 'ring-2 ring-primary-500' : 'hover:border-primary-300'}`}
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
                              {selectedInterior.id === interior.id && (
                                <CircleCheck className="h-5 w-5 text-primary-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="packages" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Packages</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {packageOptions.map((pkg) => (
                          <div
                            key={pkg.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${selectedPackage.id === pkg.id ? 'ring-2 ring-primary-500' : 'hover:border-primary-300'}`}
                            onClick={() => setSelectedPackage(pkg)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-700" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{pkg.name}</p>
                                <ul className="text-sm text-muted-foreground mt-1 list-disc pl-5">
                                  {pkg.features.map((feature, idx) => (
                                    <li key={idx}>{feature}</li>
                                  ))}
                                </ul>
                                <p className="text-sm font-medium mt-2">
                                  {pkg.price === 0 ? 'Included' : `+$${pkg.price.toLocaleString()}`}
                                </p>
                              </div>
                              {selectedPackage.id === pkg.id && (
                                <CircleCheck className="h-5 w-5 text-primary-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex-col space-y-4">
                <div className="w-full flex justify-between items-center">
                  <span className="text-lg font-bold">Total Price:</span>
                  <span className="text-xl font-bold text-primary-500">${totalPrice.toLocaleString()}</span>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600" 
                  size="lg"
                  onClick={handleProceedToCheckout}
                >
                  <CreditCard className="mr-2 h-5 w-5" /> Proceed to Checkout
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
