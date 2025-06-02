
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Car, Plus, Search, Edit, Trash2, Eye } from "lucide-react";

const ManufacturerCars = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [cars, setCars] = useState([
    {
      id: "1",
      name: "Tesla Model S",
      category: "Luxury Sedan",
      price: 85000,
      status: "active",
      orders: 15,
      image: "/placeholder.svg"
    },
    {
      id: "2", 
      name: "BMW i4",
      category: "Electric Sedan",
      price: 65000,
      status: "active",
      orders: 8,
      image: "/placeholder.svg"
    },
    {
      id: "3",
      name: "Audi e-tron",
      category: "Electric SUV", 
      price: 75000,
      status: "active",
      orders: 12,
      image: "/placeholder.svg"
    },
    {
      id: "4",
      name: "Mercedes EQS",
      category: "Luxury Electric",
      price: 95000,
      status: "draft",
      orders: 0,
      image: "/placeholder.svg"
    }
  ]);

  useEffect(() => {
    // Check if user is a manufacturer
    const userType = localStorage.getItem("userType");
    if (userType !== "manufacturer") {
      navigate("/");
      return;
    }
  }, [navigate]);

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

  const handleDeleteCar = (carId: string) => {
    setCars(cars.filter(car => car.id !== carId));
  };

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
                  src={car.image} 
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
                  <Car className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>{car.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="font-bold">${car.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Orders:</span>
                    <span className="font-medium">{car.orders}</span>
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
