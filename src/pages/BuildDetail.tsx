
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import CarModel3D from "@/components/CarModel3D";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, CreditCard, Download, ArrowLeft, Share2, Smartphone, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock build data
const mockBuildData = {
  id: "custom-x-12345",
  model: "Model X",
  created: new Date().toLocaleDateString(),
  price: 52500,
  options: {
    color: { name: "Cyber Blue", price: 800, hex: "#0ea5e9" },
    wheels: { name: "Sport 19\"", price: 1500 },
    interior: { name: "Premium White", price: 1200 },
    package: { name: "Premium Package", price: 4500, features: ["Premium Audio", "Heated Seats", "Advanced Safety"] }
  },
  specs: {
    range: "320 miles",
    topSpeed: "155 mph",
    acceleration: "3.1 seconds 0-60 mph",
    power: "670 hp"
  }
};

const BuildDetail = () => {
  const { buildId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [buildData, setBuildData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch for build data
    setTimeout(() => {
      // In a real app, we'd fetch this data from an API using the buildId
      setBuildData({...mockBuildData, id: buildId});
      setIsLoading(false);
    }, 1000);
  }, [buildId]);

  const handleShare = () => {
    toast({
      title: "Link Copied",
      description: "Build link has been copied to clipboard.",
      duration: 3000,
    });
  };

  const handleDownloadSpec = () => {
    toast({
      title: "Specifications Downloaded",
      description: "Your build specifications PDF has been downloaded.",
      duration: 3000,
    });
  };

  const handleCheckout = () => {
    // Store build data in localStorage
    localStorage.setItem('currentBuild', JSON.stringify({
      buildId,
      carId: "x",
      totalPrice: buildData.price,
      basePrice: buildData.price - 8000, // Subtract options for base price
      ...buildData.options
    }));
    
    navigate('/checkout');
  };

  const handleContinueEditing = () => {
    navigate(`/customize/${buildId?.split('-')[1] || 'x'}`);
  };

  const handleViewInAR = () => {
    navigate(`/ar/${buildId}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!buildData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-bold mb-2">Build Not Found</h2>
              <p className="mb-6 text-muted-foreground">
                The build you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate('/catalog')}>
                Browse Cars
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleShare} className="flex items-center gap-1">
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button variant="outline" onClick={handleDownloadSpec} className="flex items-center gap-1">
              <Download className="h-4 w-4" /> Download Specs
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-6 overflow-hidden bg-black/5 backdrop-blur-sm border-primary-500/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {buildData.model} Build
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 min-h-[400px] bg-gradient-to-b from-gray-900 to-black">
                <CarModel3D className="w-full h-full" />
              </CardContent>
              <CardFooter className="bg-black/10 p-4 justify-between">
                <div className="text-sm text-muted-foreground">
                  Build #{buildData.id}
                </div>
                <div className="text-sm">
                  Created on {buildData.created}
                </div>
              </CardFooter>
            </Card>

            <Card className="border-primary-500/20">
              <CardHeader>
                <CardTitle>Build Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="options">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="options">Selected Options</TabsTrigger>
                    <TabsTrigger value="specs">Specifications</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="options" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Exterior Color</h3>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded-full border" 
                            style={{ backgroundColor: buildData.options.color.hex }}
                          ></div>
                          <span>{buildData.options.color.name}</span>
                          <span className="ml-auto text-sm text-muted-foreground">
                            +${buildData.options.color.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Wheels</h3>
                        <div className="flex items-center justify-between">
                          <span>{buildData.options.wheels.name}</span>
                          <span className="text-sm text-muted-foreground">
                            +${buildData.options.wheels.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Interior</h3>
                        <div className="flex items-center justify-between">
                          <span>{buildData.options.interior.name}</span>
                          <span className="text-sm text-muted-foreground">
                            +${buildData.options.interior.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium">Package</h3>
                        <div>
                          <div className="flex items-center justify-between">
                            <span>{buildData.options.package.name}</span>
                            <span className="text-sm text-muted-foreground">
                              +${buildData.options.package.price.toLocaleString()}
                            </span>
                          </div>
                          <ul className="text-sm text-muted-foreground mt-2 list-disc pl-5">
                            {buildData.options.package.features.map((feature: string, idx: number) => (
                              <li key={idx}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="specs" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <h3 className="font-medium mb-1">Range</h3>
                        <p className="text-2xl font-bold">{buildData.specs.range}</p>
                        <p className="text-sm text-muted-foreground">EPA estimated</p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <h3 className="font-medium mb-1">Top Speed</h3>
                        <p className="text-2xl font-bold">{buildData.specs.topSpeed}</p>
                        <p className="text-sm text-muted-foreground">With Sport package</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <h3 className="font-medium mb-1">Acceleration</h3>
                        <p className="text-2xl font-bold">{buildData.specs.acceleration}</p>
                        <p className="text-sm text-muted-foreground">With performance boost</p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <h3 className="font-medium mb-1">Power Output</h3>
                        <p className="text-2xl font-bold">{buildData.specs.power}</p>
                        <p className="text-sm text-muted-foreground">Dual motor configuration</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="border-primary-500/20 sticky top-20">
              <CardHeader className="bg-primary-50/50 dark:bg-primary-950/20">
                <CardTitle className="flex justify-between items-center">
                  <span>Price Summary</span>
                  <span className="text-primary-500">${buildData.price.toLocaleString()}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Base Vehicle</span>
                    <span>${(buildData.price - 8000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Color</span>
                    <span>+${buildData.options.color.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Wheels</span>
                    <span>+${buildData.options.wheels.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Interior</span>
                    <span>+${buildData.options.interior.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Package</span>
                    <span>+${buildData.options.package.price.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center font-bold">
                    <span>Total Price</span>
                    <span>${buildData.price.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>All options subject to availability</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Price includes all tax & fees</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3 px-6 pb-6 pt-0">
                <Button 
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600" 
                  onClick={handleCheckout}
                >
                  <CreditCard className="mr-2 h-4 w-4" /> Proceed to Checkout
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleContinueEditing}
                >
                  <Pencil className="mr-2 h-4 w-4" /> Continue Editing
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleViewInAR}
                >
                  <Smartphone className="mr-2 h-4 w-4" /> View in AR
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BuildDetail;
