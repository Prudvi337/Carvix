import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { carDataService, CarModel } from "@/services/carData";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, ArrowLeft, Edit2, X } from "lucide-react";

const CarDetail = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [car, setCar] = useState<CarModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [isManufacturer, setIsManufacturer] = useState(false);

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    setIsManufacturer(userType === "manufacturer");
    fetchCar();
    // eslint-disable-next-line
  }, [carId]);

  const fetchCar = async () => {
    setIsLoading(true);
    try {
      if (!carId) return;
      const carData = await carDataService.getCarById(carId);
      setCar(carData);
      setEditData(carData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load car details.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSave = async () => {
    if (!carId) return;
    try {
      setIsLoading(true);
      await carDataService.updateCar(carId, editData);
      toast({ title: "Car updated successfully!" });
      setIsEditing(false);
      fetchCar();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update car.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary-500" />
        </div>
      </Layout>
    );
  }

  if (!car) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Car Not Found</h2>
              <Button onClick={() => navigate(-1)}>Go Back</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isEditing ? (
                <Edit2 className="h-5 w-5" />
              ) : (
                <span role="img" aria-label="car">🚗</span>
              )}
              {isEditing ? "Edit Car" : car.name}
            </CardTitle>
            <CardDescription>
              {car.category} &bull; {car.manufacturerName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <img
                  src={car.images[0] || "/placeholder.svg"}
                  alt={car.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <div className="flex gap-2 overflow-x-auto">
                  {car.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Car image ${idx + 1}`}
                      className="w-20 h-14 object-cover rounded border"
                    />
                  ))}
                </div>
              </div>
              <div>
                {isEditing ? (
                  <>
                    <div className="mb-4">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={editData.name}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        name="category"
                        value={editData.category}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="basePrice">Base Price</Label>
                      <Input
                        id="basePrice"
                        name="basePrice"
                        type="number"
                        value={editData.basePrice}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={editData.description}
                        onChange={handleEditChange}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-2">{car.name}</h2>
                    <p className="mb-2">Category: {car.category}</p>
                    <p className="mb-2">Base Price: ${car.basePrice.toLocaleString()}</p>
                    <p className="mb-2">{car.description}</p>
                  </>
                )}
                <div className="mt-6 flex gap-2">
                  {isManufacturer && !isEditing && (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit2 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  )}
                  {isEditing && (
                    <>
                      <Button onClick={handleSave} disabled={isLoading}>
                        <Save className="h-4 w-4 mr-1" /> Save
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        <X className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-2">Specifications</h3>
              <ul className="grid grid-cols-2 gap-2">
                <li>Engine: {car.specifications.engine}</li>
                <li>Transmission: {car.specifications.transmission}</li>
                <li>Fuel Type: {car.specifications.fuelType}</li>
                <li>Seating: {car.specifications.seating}</li>
                <li>Top Speed: {car.specifications.topSpeed}</li>
                <li>Acceleration: {car.specifications.acceleration}</li>
              </ul>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-2">Customization Options</h3>
              {/* Colors */}
              {car.customizationOptions.colors && car.customizationOptions.colors.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Colors</h4>
                  <div className="flex gap-3 flex-wrap">
                    {car.customizationOptions.colors.map((color) => (
                      <div key={color.id} className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full border" style={{ backgroundColor: color.hex }}></div>
                        <span className="text-xs mt-1">{color.name}</span>
                        <span className="text-xs text-gray-500">${color.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Wheels */}
              {car.customizationOptions.wheels && car.customizationOptions.wheels.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Wheels</h4>
                  <div className="flex gap-3 flex-wrap">
                    {car.customizationOptions.wheels.map((wheel) => (
                      <div key={wheel.id} className="border rounded p-2 flex flex-col items-center w-32">
                        <img src={wheel.image} alt={wheel.name} className="w-16 h-16 object-cover mb-1" />
                        <span className="text-xs font-medium">{wheel.name}</span>
                        <span className="text-xs">{wheel.size} {wheel.style}</span>
                        <span className="text-xs text-gray-500">${wheel.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Interiors */}
              {car.customizationOptions.interiors && car.customizationOptions.interiors.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Interiors</h4>
                  <div className="flex gap-3 flex-wrap">
                    {car.customizationOptions.interiors.map((interior) => (
                      <div key={interior.id} className="border rounded p-2 flex flex-col items-center w-32">
                        <img src={interior.image} alt={interior.name} className="w-16 h-16 object-cover mb-1" />
                        <span className="text-xs font-medium">{interior.name}</span>
                        <span className="text-xs">{interior.material} {interior.color}</span>
                        <span className="text-xs text-gray-500">${interior.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Packages */}
              {car.customizationOptions.packages && car.customizationOptions.packages.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Feature Packages</h4>
                  <ul className="list-disc pl-5">
                    {car.customizationOptions.packages.map((pkg) => (
                      <li key={pkg.id} className="mb-2">
                        <span className="font-medium">{pkg.name}</span> - ${pkg.price}
                        <div className="text-xs text-gray-600">{pkg.description}</div>
                        <ul className="list-square pl-4 text-xs text-gray-700">
                          {pkg.features.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CarDetail; 