
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, Trash2, Car, ShoppingCart } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useToast, removeFromSavedCars, addToCart, isInCart } from "@/hooks/use-toast";

// Mock car data
const carDatabase = [
  {
    id: "1",
    name: "Velocity X3",
    price: 45999,
    image: "/placeholder.svg",
    color: "#3b82f6",
    category: "sedan"
  },
  {
    id: "2",
    name: "Horizon SUV",
    price: 52800,
    image: "/placeholder.svg",
    color: "#ef4444",
    category: "suv"
  },
  {
    id: "3",
    name: "Luxury Phantom",
    price: 82750,
    image: "/placeholder.svg",
    color: "#a855f7",
    category: "luxury"
  },
  {
    id: "4",
    name: "City Cruiser",
    price: 32999,
    image: "/placeholder.svg",
    color: "#14b8a6",
    category: "hatchback"
  },
  {
    id: "5",
    name: "Family Voyager",
    price: 42500,
    image: "/placeholder.svg",
    color: "#22c55e",
    category: "suv"
  },
  {
    id: "6",
    name: "Sport EVO",
    price: 67200,
    image: "/placeholder.svg",
    color: "#f59e0b",
    category: "sport"
  }
];

const SavedCars = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedCars, setSavedCars] = useState<typeof carDatabase>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const isUserLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(isUserLoggedIn);
      
      if (!isUserLoggedIn) {
        setTimeout(() => {
          navigate("/login");
          toast({
            title: "Login Required",
            description: "Please log in to view your saved cars.",
            variant: "destructive",
          });
        }, 1000);
      }
    };

    const loadSavedCars = () => {
      const savedCarIds = JSON.parse(localStorage.getItem("savedCars") || "[]");
      const savedCarData = carDatabase.filter(car => savedCarIds.includes(car.id));
      setSavedCars(savedCarData);
      setIsLoading(false);
    };

    checkLoginStatus();
    
    if (isLoggedIn) {
      // Simulate API fetch
      setTimeout(loadSavedCars, 800);
    }

    // Listen for updates to saved cars
    const handleSavedCarsUpdate = () => loadSavedCars();
    window.addEventListener("savedCarsUpdated", handleSavedCarsUpdate);
    
    // Listen for login status changes
    const handleLoginStatusChange = () => checkLoginStatus();
    window.addEventListener("loginStatusChanged", handleLoginStatusChange);

    return () => {
      window.removeEventListener("savedCarsUpdated", handleSavedCarsUpdate);
      window.removeEventListener("loginStatusChanged", handleLoginStatusChange);
    };
  }, [navigate, toast, isLoggedIn]);

  const handleRemove = (id: string) => {
    removeFromSavedCars(id);
  };

  const handleAddToCart = (id: string) => {
    addToCart(id);
  };

  const handleClearAll = () => {
    const savedCarIds = JSON.parse(localStorage.getItem("savedCars") || "[]");
    
    if (savedCarIds.length > 0) {
      localStorage.setItem("savedCars", JSON.stringify([]));
      
      // Dispatch event to notify navbar
      window.dispatchEvent(new Event("savedCarsUpdated"));
      
      setSavedCars([]);
      
      toast({
        title: "All cars removed",
        description: "Your saved cars list has been cleared.",
      });
    }
  };

  const handleViewCar = (id: string) => {
    navigate(`/customize/${id}`);
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Saved Cars', path: '/saved-cars' }
  ];

  if (!isLoggedIn) {
    return (
      <Layout>
        <AnimatedPage animation="fade">
          <div className="container mx-auto px-4 py-32 text-center">
            <h1 className="text-3xl font-bold mb-4">Redirecting to login...</h1>
            <p>You need to be logged in to view this page.</p>
          </div>
        </AnimatedPage>
      </Layout>
    );
  }

  return (
    <Layout>
      <AnimatedPage animation="fade">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} />
          
          <div className="flex flex-col md:flex-row items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Saved Cars</h1>
              <p className="text-muted-foreground">
                {isLoading ? "Loading your saved cars..." : 
                  savedCars.length === 0 ? 
                  "You haven't saved any cars yet." : 
                  `You have ${savedCars.length} saved ${savedCars.length === 1 ? 'car' : 'cars'}.`}
              </p>
            </div>
            
            {savedCars.length > 0 && (
              <Button 
                variant="outline"
                className="mt-4 md:mt-0"
                onClick={handleClearAll}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear All
              </Button>
            )}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <CardContent className="p-4">
                    <div className="h-6 w-3/4 bg-gray-200 animate-pulse mb-2"></div>
                    <div className="h-8 w-1/2 bg-gray-200 animate-pulse"></div>
                  </CardContent>
                  <Separator />
                  <CardFooter className="p-4 flex justify-between">
                    <div className="h-9 w-1/3 bg-gray-200 animate-pulse"></div>
                    <div className="h-9 w-1/3 bg-gray-200 animate-pulse"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : savedCars.length === 0 ? (
            <Card className="text-center py-12 px-4">
              <div className="flex flex-col items-center justify-center">
                <Heart className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">No Saved Cars</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  You haven't saved any cars to your list yet. Browse our catalog and click the heart icon to save cars you're interested in.
                </p>
                <Button 
                  onClick={() => navigate('/search')}
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
                >
                  <Car className="mr-2 h-4 w-4" /> Browse Cars
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCars.map(car => (
                <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-100 relative">
                    <img 
                      src={car.image} 
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                      {car.category}
                    </div>
                    <div 
                      className="absolute top-2 left-2 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-md cursor-pointer"
                      onClick={() => handleRemove(car.id)}
                    >
                      <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold">{car.name}</h3>
                    <p className="text-2xl font-bold mt-1">${car.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-muted-foreground">Color:</span>
                      <div 
                        className="w-5 h-5 rounded-full border"
                        style={{ backgroundColor: car.color }}
                      ></div>
                    </div>
                  </CardContent>
                  <Separator />
                  <CardFooter className="p-4 flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={() => handleRemove(car.id)}
                      className="flex items-center"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Remove
                    </Button>
                    <Button
                      variant={isInCart(car.id) ? "secondary" : "default"}
                      onClick={() => isInCart(car.id) ? void 0 : handleAddToCart(car.id)}
                      disabled={isInCart(car.id)}
                      className={isInCart(car.id) ? "" : "bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"}
                    >
                      {isInCart(car.id) ? (
                        <>
                          <ShoppingCart className="mr-2 h-4 w-4" /> In Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </AnimatedPage>
    </Layout>
  );
};

export default SavedCars;
