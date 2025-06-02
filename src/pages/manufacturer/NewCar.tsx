
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, Car, Save, ArrowLeft } from "lucide-react";

const NewCar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    specifications: {
      engine: "",
      transmission: "",
      fuelType: "",
      seating: "",
      topSpeed: "",
      acceleration: ""
    },
    features: "",
    images: [] as File[],
    model3D: null as File | null
  });

  useEffect(() => {
    // Check if user is a manufacturer
    const userType = localStorage.getItem("userType");
    if (userType !== "manufacturer") {
      navigate("/");
      return;
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("spec_")) {
      const specName = name.replace("spec_", "");
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          [specName]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData({ ...formData, images: [...formData.images, ...files] });
    }
  };

  const handle3DModelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, model3D: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Car Added Successfully",
        description: "Your new car model has been added to the catalog.",
      });
      
      navigate("/manufacturer/cars");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add car. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate("/manufacturer/cars")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cars
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New Car Model</h1>
            <p className="text-gray-600 mt-2">Create a new car model for your catalog</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>Enter the basic details of your car model</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Car Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Tesla Model S"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="hatchback">Hatchback</SelectItem>
                      <SelectItem value="coupe">Coupe</SelectItem>
                      <SelectItem value="convertible">Convertible</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="85000"
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your car model..."
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
              <CardDescription>Technical specifications of the car</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="spec_engine">Engine</Label>
                  <Input
                    id="spec_engine"
                    name="spec_engine"
                    placeholder="e.g., V8 Turbo"
                    value={formData.specifications.engine}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spec_transmission">Transmission</Label>
                  <Input
                    id="spec_transmission"
                    name="spec_transmission"
                    placeholder="e.g., Automatic"
                    value={formData.specifications.transmission}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spec_fuelType">Fuel Type</Label>
                  <Input
                    id="spec_fuelType"
                    name="spec_fuelType"
                    placeholder="e.g., Electric"
                    value={formData.specifications.fuelType}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spec_seating">Seating Capacity</Label>
                  <Input
                    id="spec_seating"
                    name="spec_seating"
                    placeholder="e.g., 5"
                    value={formData.specifications.seating}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spec_topSpeed">Top Speed (mph)</Label>
                  <Input
                    id="spec_topSpeed"
                    name="spec_topSpeed"
                    placeholder="e.g., 155"
                    value={formData.specifications.topSpeed}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spec_acceleration">0-60 mph (seconds)</Label>
                  <Input
                    id="spec_acceleration"
                    name="spec_acceleration"
                    placeholder="e.g., 3.2"
                    value={formData.specifications.acceleration}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Media Upload
              </CardTitle>
              <CardDescription>Upload images and 3D models for your car</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="images">Car Images</Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <p className="text-sm text-muted-foreground">
                  Upload multiple images showing different angles of the car
                </p>
                {formData.images.length > 0 && (
                  <p className="text-sm text-green-600">
                    {formData.images.length} image(s) selected
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model3D">3D Model</Label>
                <Input
                  id="model3D"
                  type="file"
                  accept=".glb,.gltf,.obj,.fbx"
                  onChange={handle3DModelUpload}
                />
                <p className="text-sm text-muted-foreground">
                  Upload a 3D model file (.glb, .gltf, .obj, .fbx) for AR visualization
                </p>
                {formData.model3D && (
                  <p className="text-sm text-green-600">
                    3D model selected: {formData.model3D.name}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>List the key features of this car model</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea
                  id="features"
                  name="features"
                  placeholder="Advanced autopilot&#10;Premium sound system&#10;Heated seats&#10;Wireless charging"
                  rows={6}
                  value={formData.features}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
            >
              {isLoading ? (
                "Adding Car..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Add Car Model
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate("/manufacturer/cars")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NewCar;
