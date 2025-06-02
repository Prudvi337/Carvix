import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Search, Filter, SlidersHorizontal, ChevronRight, X } from "lucide-react";

// Mock data for cars
const carMockData = [
  { id: 1, name: "Audi A4", brand: "Audi", price: 39000, image: "https://placehold.co/300x200/FFFFFF/333333?text=Audi+A4", bodyType: "Sedan", fuelType: "Gasoline" },
  { id: 2, name: "BMW 3 Series", brand: "BMW", price: 41000, image: "https://placehold.co/300x200/FFFFFF/333333?text=BMW+3+Series", bodyType: "Sedan", fuelType: "Hybrid" },
  { id: 3, name: "Mercedes C-Class", brand: "Mercedes", price: 42000, image: "https://placehold.co/300x200/FFFFFF/333333?text=Mercedes+C-Class", bodyType: "Sedan", fuelType: "Diesel" },
  { id: 4, name: "Tesla Model 3", brand: "Tesla", price: 45000, image: "https://placehold.co/300x200/FFFFFF/333333?text=Tesla+Model+3", bodyType: "Sedan", fuelType: "Electric" },
  { id: 5, name: "Toyota RAV4", brand: "Toyota", price: 30000, image: "https://placehold.co/300x200/FFFFFF/333333?text=Toyota+RAV4", bodyType: "SUV", fuelType: "Hybrid" },
  { id: 6, name: "Honda CR-V", brand: "Honda", price: 28000, image: "https://placehold.co/300x200/FFFFFF/333333?text=Honda+CR-V", bodyType: "SUV", fuelType: "Gasoline" },
  { id: 7, name: "Ford Mustang", brand: "Ford", price: 38000, image: "https://placehold.co/300x200/FFFFFF/333333?text=Ford+Mustang", bodyType: "Coupe", fuelType: "Gasoline" },
  { id: 8, name: "Volvo XC60", brand: "Volvo", price: 43000, image: "https://placehold.co/300x200/FFFFFF/333333?text=Volvo+XC60", bodyType: "SUV", fuelType: "Hybrid" },
];

// Filter options
const brands = ["Audi", "BMW", "Mercedes", "Tesla", "Toyota", "Honda", "Ford", "Volvo"];
const bodyTypes = ["Sedan", "SUV", "Coupe", "Hatchback", "Truck", "Van"];
const fuelTypes = ["Gasoline", "Diesel", "Electric", "Hybrid"];

const CarCard = ({ car }: { car: typeof carMockData[0] }) => (
  <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 animate-zoom-in">
    <div className="relative">
      <img 
        src={car.image} 
        alt={car.name} 
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-sm font-medium text-primary-600">
        {car.brand}
      </div>
    </div>
    <CardContent className="p-5">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-800">{car.name}</h3>
        <p className="text-primary-600 font-semibold">${car.price.toLocaleString()}</p>
      </div>
      <div className="flex justify-between text-sm text-gray-500 mb-4">
        <span>{car.bodyType}</span>
        <span>{car.fuelType}</span>
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

  // Filter cars based on selected filters
  const filteredCars = carMockData.filter(car => {
    // Search term filter
    if (searchTerm && !car.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Price range filter
    if (car.price < priceRange[0] || car.price > priceRange[1]) {
      return false;
    }
    
    // Brand filter
    if (selectedBrands.length > 0 && !selectedBrands.includes(car.brand)) {
      return false;
    }
    
    // Body type filter
    if (selectedBodyTypes.length > 0 && !selectedBodyTypes.includes(car.bodyType)) {
      return false;
    }
    
    // Fuel type filter
    if (selectedFuelTypes.length > 0 && !selectedFuelTypes.includes(car.fuelType)) {
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
