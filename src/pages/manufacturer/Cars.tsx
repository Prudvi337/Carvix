import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Car as CarIcon, Plus, Search, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { carDataService, CarModel } from "@/services/carData";
import { authService } from "@/services/auth";
import { useToast } from "@/hooks/use-toast";

const ManufacturerCars = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [cars, setCars] = useState<CarModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  authService.restoreProfileFromLocalStorage();

  useEffect(() => {
    // Check if user is a manufacturer
    const userType = localStorage.getItem("userType");
    if (userType !== "manufacturer") {
      navigate("/");
      return;
    }

    loadCars();
  }, [navigate]);

  const loadCars = async () => {
    try {
      setIsLoading(true);
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const manufacturerCars = await carDataService.getCarsByManufacturer(user.uid);
      setCars(manufacturerCars);
    } catch (error) {
      console.error('Error loading cars:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load cars. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCars = cars.filter(car => 
    car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleDeleteCar = async (carId: string) => {
    try {
      await carDataService.deleteCar(carId);
      setCars(cars.filter(car => car.id !== carId));
      toast({
        title: "Car Deleted",
        description: "Car has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting car:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete car. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary-500" />
              <h2 className="text-xl font-semibold mb-2">Loading Cars</h2>
              <p className="text-muted-foreground">Please wait while we load your car inventory...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Car Models</h1>
            <p className="text-gray-600 mt-2">Manage your car inventory and models</p>
          </div>
          <Button 
            onClick={() => navigate("/manufacturer/cars/new")}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Car
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cars by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <Card key={car.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                <img 
                  src={car.images[0] || "/placeholder.svg"} 
                  alt={car.name}
                  className="w-full h-full object-cover"
                />
                <Badge className={`absolute top-2 right-2 ${getStatusColor(car.status)}`}>
                  {car.status}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{car.name}</span>
                  <CarIcon className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>{car.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base Price:</span>
                  <span className="font-medium">${car.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fuel Type:</span>
                  <span className="font-medium">{car.specifications.fuelType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Engine:</span>
                  <span className="font-medium">{car.specifications.engine}</span>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate(`/manufacturer/cars/${car.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate(`/manufacturer/cars/${car.id}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteCar(car.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <CarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No cars found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try adjusting your search criteria" : "Start by adding your first car model"}
              </p>
              <Button 
                onClick={() => navigate("/manufacturer/cars/new")}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Car
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ManufacturerCars;
