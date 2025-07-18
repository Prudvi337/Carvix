import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Search, Filter, SlidersHorizontal, ChevronRight, X, Loader2 } from "lucide-react";
import { carDataService, CarModel } from "@/services/carData";

const CarCard = ({ car }: { car: CarModel }) => (
  <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 animate-zoom-in">
    <div className="relative">
      <img 
        src={car.images[0] || "/placeholder.svg"} 
        alt={car.name} 
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-sm font-medium text-primary-600">
        {car.manufacturerName}
      </div>
    </div>
    <CardContent className="p-5">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-800">{car.name}</h3>
        <p className="text-primary-600 font-semibold">${car.basePrice.toLocaleString()}</p>
      </div>
      <div className="flex justify-between text-sm text-gray-500 mb-4">
        <span>{car.category}</span>
        <span>{car.specifications.fuelType}</span>
      </div>
      <Button className="w-full bg-primary-500 hover:bg-primary-600">
        <Link to={`/customize/${car.id}`} className="flex items-center w-full justify-center">
          Customize <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </CardContent>
  </Card>
);

const CatalogPage = () => {
  const [priceRange, setPriceRange] = useState<number[]>([15000, 50000]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [cars, setCars] = useState<CarModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [brands, setBrands] = useState<string[]>([]);
  const [bodyTypes, setBodyTypes] = useState<string[]>([]);
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);

  // Load cars and filter options
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const allCars = await carDataService.getAllCars();
        console.log('Loaded cars from Firestore:', allCars);
        setCars(allCars);
        
        // Extract filter options from car data
        const uniqueBrands = [...new Set(allCars.map(car => car.manufacturerName))];
        const uniqueBodyTypes = [...new Set(allCars.map(car => car.category))];
        const uniqueFuelTypes = [...new Set(allCars.map(car => car.specifications.fuelType))];
        
        setBrands(uniqueBrands);
        setBodyTypes(uniqueBodyTypes);
        setFuelTypes(uniqueFuelTypes);
      } catch (error) {
        console.error('Error loading cars:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter cars based on selected filters
  const filteredCars = cars.filter(car => {
    // Search term filter
    if (searchTerm && !car.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Price range filter
    if (car.basePrice < priceRange[0] || car.basePrice > priceRange[1]) {
      return false;
    }
    
    // Brand filter
    if (selectedBrands.length > 0 && !selectedBrands.includes(car.manufacturerName)) {
      return false;
    }
    
    // Body type filter
    if (selectedBodyTypes.length > 0 && !selectedBodyTypes.includes(car.category)) {
      return false;
    }
    
    // Fuel type filter
    if (selectedFuelTypes.length > 0 && !selectedFuelTypes.includes(car.specifications.fuelType)) {
      return false;
    }
    
    return true;
  });

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand) 
        : [...prev, brand]
    );
  };

  const toggleBodyType = (type: string) => {
    setSelectedBodyTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const toggleFuelType = (type: string) => {
    setSelectedFuelTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setPriceRange([15000, 50000]);
    setSelectedBrands([]);
    setSelectedBodyTypes([]);
    setSelectedFuelTypes([]);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary-500" />
              <h2 className="text-xl font-semibold mb-2">Loading Catalog</h2>
              <p className="text-muted-foreground">Please wait while we load the car catalog...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-to-b from-primary-100 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Car Catalog</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our extensive collection of vehicles and find the perfect match for your needs
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Desktop Filters Sidebar */}
            <div className="hidden md:block w-64 flex-shrink-0 animate-slide-up [animation-delay:200ms]">
              <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center">
                    <Filter className="mr-2 h-5 w-5 text-primary-500" /> Filters
                  </h2>
                  <Button 
                    variant="ghost" 
                    className="text-sm text-primary-600 hover:text-primary-800 p-0 h-auto"
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </Button>
                </div>
                
                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-3 text-gray-700">Price Range</h3>
                  <div className="mb-2">
                    <Slider
                      value={priceRange}
                      min={10000}
                      max={100000}
                      step={1000}
                      onValueChange={setPriceRange}
                      className="my-6"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0].toLocaleString()}</span>
                    <span>${priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Brand Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-3 text-gray-700">Brand</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center">
                        <Checkbox 
                          id={`brand-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
                          className="text-primary-500 focus:ring-primary-500"
                        />
                        <Label 
                          htmlFor={`brand-${brand}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Body Type Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-3 text-gray-700">Body Type</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {bodyTypes.map((type) => (
                      <div key={type} className="flex items-center">
                        <Checkbox 
                          id={`body-${type}`}
                          checked={selectedBodyTypes.includes(type)}
                          onCheckedChange={() => toggleBodyType(type)}
                          className="text-primary-500 focus:ring-primary-500"
                        />
                        <Label 
                          htmlFor={`body-${type}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Fuel Type Filter */}
                <div className="mb-2">
                  <h3 className="text-sm font-semibold mb-3 text-gray-700">Fuel Type</h3>
                  <div className="space-y-2">
                    {fuelTypes.map((type) => (
                      <div key={type} className="flex items-center">
                        <Checkbox 
                          id={`fuel-${type}`}
                          checked={selectedFuelTypes.includes(type)}
                          onCheckedChange={() => toggleFuelType(type)}
                          className="text-primary-500 focus:ring-primary-500"
                        />
                        <Label 
                          htmlFor={`fuel-${type}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 animate-slide-up [animation-delay:400ms]">
              {/* Search and Mobile Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex items-center flex-1 relative">
                  <Input
                    placeholder="Search cars..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200"
                  />
                  <Search className="absolute left-3 text-gray-400 h-5 w-5" />
                </div>
                
                <Button
                  variant="outline"
                  className="md:hidden flex items-center justify-center border-gray-200"
                  onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                >
                  <SlidersHorizontal className="mr-2 h-5 w-5" />
                  Filters {selectedBrands.length + selectedBodyTypes.length + selectedFuelTypes.length > 0 && 
                    `(${selectedBrands.length + selectedBodyTypes.length + selectedFuelTypes.length})`}
                </Button>
              </div>
              
              {/* Results */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.length > 0 ? (
                  filteredCars.map(car => (
                    <CarCard key={car.id} car={car} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-16">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-semibold text-gray-700 mb-2">No cars found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your filters or search term</p>
                    <Button onClick={clearAllFilters}>Clear All Filters</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl p-5 overflow-y-auto animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Filters</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Filter content - same as desktop sidebar */}
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Price Range</h3>
              <div className="mb-2">
                <Slider
                  value={priceRange}
                  min={10000}
                  max={100000}
                  step={1000}
                  onValueChange={setPriceRange}
                  className="my-6"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>${priceRange[0].toLocaleString()}</span>
                <span>${priceRange[1].toLocaleString()}</span>
              </div>
            </div>
            
            {/* Brand Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Brand</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center">
                    <Checkbox 
                      id={`mobile-brand-${brand}`}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={() => toggleBrand(brand)}
                    />
                    <Label 
                      htmlFor={`mobile-brand-${brand}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {brand}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* More filters... */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                className="w-full"
                onClick={clearAllFilters}
              >
                Clear All
              </Button>
              <Button 
                className="w-full bg-primary-500 hover:bg-primary-600"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CatalogPage;
