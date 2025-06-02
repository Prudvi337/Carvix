
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Search } from "lucide-react";
import ScrollToTop from "@/components/ScrollToTop";

// Example car data - in a real app, this would come from an API
const carData = [
  {
    id: "1",
    name: "Velocity X3",
    price: 45999,
    range: 320,
    acceleration: 3.1,
    topSpeed: 155,
    category: "sedan",
    image: "/placeholder.svg",
    features: ["Premium Audio", "Heated Seats", "Panoramic Sunroof"],
    colors: ["#3b82f6", "#ef4444", "#22c55e", "#171717"]
  },
  {
    id: "2",
    name: "Eco Explorer",
    price: 38500,
    range: 280,
    acceleration: 3.5,
    topSpeed: 140,
    category: "suv",
    image: "/placeholder.svg",
    features: ["Premium Audio", "Heated Seats"],
    colors: ["#3b82f6", "#171717", "#f8fafc"]
  },
  {
    id: "3",
    name: "Luxury Phantom",
    price: 82750,
    range: 355,
    acceleration: 2.7,
    topSpeed: 175,
    category: "luxury",
    image: "/placeholder.svg",
    features: ["Premium Audio", "Heated & Cooled Seats", "Panoramic Sunroof", "Massage Seats"],
    colors: ["#a855f7", "#171717", "#f8fafc", "#14b8a6"]
  },
  {
    id: "4",
    name: "City Cruiser",
    price: 32999,
    range: 250,
    acceleration: 4.2,
    topSpeed: 130,
    category: "compact",
    image: "/placeholder.svg",
    features: ["Bluetooth Audio", "Backup Camera"],
    colors: ["#3b82f6", "#ef4444", "#eab308"]
  },
  {
    id: "5",
    name: "Family Voyager",
    price: 42500,
    range: 310,
    acceleration: 3.8,
    topSpeed: 135,
    category: "suv",
    image: "/placeholder.svg",
    features: ["7 Seats", "Smart Storage", "Family Entertainment System"],
    colors: ["#22c55e", "#171717", "#f8fafc"]
  },
  {
    id: "6",
    name: "Performance GT",
    price: 76000,
    range: 290,
    acceleration: 2.5,
    topSpeed: 190,
    category: "sport",
    image: "/placeholder.svg",
    features: ["Sport Suspension", "Performance Brakes", "Track Mode"],
    colors: ["#ef4444", "#171717", "#eab308"]
  }
];

const categories = ["all", "sedan", "suv", "luxury", "compact", "sport"];
const sortOptions = ["price-asc", "price-desc", "range-desc", "acceleration-asc"];

const CarSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([30000, 85000]);
  const [rangeFilter, setRangeFilter] = useState(200);
  const [sortBy, setSortBy] = useState("price-asc");
  const [view, setView] = useState("grid");

  // Filter cars based on search query, category, and price range
  const filteredCars = carData.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || car.category === selectedCategory;
    const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
    const matchesRange = car.range >= rangeFilter;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesRange;
  });

  // Sort cars
  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "range-desc":
        return b.range - a.range;
      case "acceleration-asc":
        return a.acceleration - b.acceleration;
      default:
        return 0;
    }
  });

  const handleViewCar = (carId: string) => {
    navigate(`/customize/${carId}`);
  };

  const getSortLabel = (value: string) => {
    switch (value) {
      case "price-asc": return "Price: Low to High";
      case "price-desc": return "Price: High to Low";
      case "range-desc": return "Range: Highest First";
      case "acceleration-asc": return "Acceleration: Fastest First";
      default: return value;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar */}
          <div className="md:w-1/4 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search cars..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="capitalize"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Price Range</Label>
                    <span className="text-sm text-muted-foreground">
                      ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[30000, 85000]}
                    min={30000}
                    max={85000}
                    step={1000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="py-4"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Minimum Range</Label>
                    <span className="text-sm text-muted-foreground">
                      {rangeFilter} miles
                    </span>
                  </div>
                  <Slider
                    defaultValue={[200]}
                    min={200}
                    max={400}
                    step={10}
                    value={[rangeFilter]}
                    onValueChange={([value]) => setRangeFilter(value)}
                    className="py-4"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {sortOptions.map(option => (
                      <option key={option} value={option}>{getSortLabel(option)}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>View</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button
                    variant={view === "grid" ? "default" : "outline"}
                    onClick={() => setView("grid")}
                  >
                    Grid
                  </Button>
                  <Button
                    variant={view === "list" ? "default" : "outline"}
                    onClick={() => setView("list")}
                  >
                    List
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cars results */}
          <div className="md:w-3/4">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Find Your Perfect Car</h1>
              <p className="text-muted-foreground">
                {sortedCars.length} {sortedCars.length === 1 ? 'result' : 'results'} found
              </p>
            </div>

            <Tabs defaultValue="all" className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Cars</TabsTrigger>
                <TabsTrigger value="electric">Electric</TabsTrigger>
                <TabsTrigger value="hybrid">Hybrid</TabsTrigger>
              </TabsList>
            </Tabs>

            {sortedCars.length === 0 ? (
              <Card className="p-12 text-center">
                <h3 className="text-xl font-medium mb-2">No cars found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters to see more results</p>
                <Button onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setPriceRange([30000, 85000]);
                  setRangeFilter(200);
                }}>
                  Clear Filters
                </Button>
              </Card>
            ) : view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCars.map(car => (
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
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle>{car.name}</CardTitle>
                      <p className="text-2xl font-bold">${car.price.toLocaleString()}</p>
                    </CardHeader>
                    <CardContent className="space-y-2 pb-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Range:</span>
                          <span className="font-medium">{car.range} mi</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">0-60:</span>
                          <span className="font-medium">{car.acceleration}s</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {car.colors.slice(0, 4).map((color, idx) => (
                          <div 
                            key={idx}
                            className="w-5 h-5 rounded-full border"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        {car.colors.length > 4 && (
                          <div className="w-5 h-5 rounded-full border flex items-center justify-center text-xs">
                            +{car.colors.length - 4}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <Separator />
                    <CardFooter className="pt-3">
                      <Button 
                        onClick={() => handleViewCar(car.id)}
                        className="w-full"
                      >
                        Customize
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedCars.map(car => (
                  <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 aspect-video bg-gray-100 relative">
                        <img 
                          src={car.image} 
                          alt={car.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                          {car.category}
                        </div>
                      </div>
                      <div className="md:w-2/3 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold">{car.name}</h3>
                          <p className="text-2xl font-bold">${car.price.toLocaleString()}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                            <div className="text-sm text-muted-foreground">Range</div>
                            <div className="font-medium">{car.range} mi</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                            <div className="text-sm text-muted-foreground">0-60</div>
                            <div className="font-medium">{car.acceleration}s</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                            <div className="text-sm text-muted-foreground">Top Speed</div>
                            <div className="font-medium">{car.topSpeed} mph</div>
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="text-sm text-muted-foreground mb-1">Features:</div>
                          <div className="flex flex-wrap gap-2">
                            {car.features.map((feature, idx) => (
                              <div key={idx} className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex gap-1">
                            {car.colors.map((color, idx) => (
                              <div 
                                key={idx}
                                className="w-5 h-5 rounded-full border"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <Button onClick={() => handleViewCar(car.id)}>
                            Customize
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ScrollToTop />
    </Layout>
  );
};

export default CarSearch;
