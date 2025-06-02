import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X } from "lucide-react";

// Example car data - in a real app, this would come from an API
const carData = [
  {
    id: "1",
    name: "Velocity X3",
    price: 45999,
    range: "320 miles",
    acceleration: "3.1s 0-60 mph",
    topSpeed: "155 mph",
    safetyRating: 5,
    features: [
      "Premium Audio",
      "Heated Seats",
      "Panoramic Sunroof",
      "Adaptive Cruise Control",
      "Lane Keeping Assist"
    ]
  },
  {
    id: "2",
    name: "Eco Explorer",
    price: 38500,
    range: "280 miles",
    acceleration: "3.5s 0-60 mph",
    topSpeed: "140 mph",
    safetyRating: 4.5,
    features: [
      "Premium Audio",
      "Heated Seats",
      "Panoramic Sunroof",
      "Adaptive Cruise Control"
    ]
  },
  {
    id: "3",
    name: "Luxury Phantom",
    price: 82750,
    range: "355 miles",
    acceleration: "2.7s 0-60 mph",
    topSpeed: "175 mph",
    safetyRating: 5,
    features: [
      "Premium Audio",
      "Heated & Cooled Seats",
      "Panoramic Sunroof",
      "Adaptive Cruise Control",
      "Lane Keeping Assist",
      "Autonomous Driving",
      "Massage Seats"
    ]
  }
];

const CarComparison = () => {
  const [selectedCars, setSelectedCars] = useState<string[]>(["1", "2"]);

  const handleCarSelection = (carId: string) => {
    if (selectedCars.includes(carId)) {
      // Don't allow deselecting if only one car is selected
      if (selectedCars.length > 1) {
        setSelectedCars(selectedCars.filter(id => id !== carId));
      }
    } else {
      // Don't allow more than 3 cars to be compared at once
      if (selectedCars.length < 3) {
        setSelectedCars([...selectedCars, carId]);
      }
    }
  };

  // Get the cars to compare
  const carsToCompare = carData.filter(car => selectedCars.includes(car.id));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Car Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Select up to 3 cars to compare:</h3>
          <div className="flex flex-wrap gap-2">
            {carData.map(car => (
              <Button
                key={car.id}
                variant={selectedCars.includes(car.id) ? "default" : "outline"}
                onClick={() => handleCarSelection(car.id)}
                className="mb-2"
              >
                {car.name}
              </Button>
            ))}
          </div>
        </div>

        {carsToCompare.length > 0 && (
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>
            
            <TabsContent value="specs" className="pt-2">
              <div className="grid grid-cols-4 gap-4">
                <div className="font-medium">Specification</div>
                {carsToCompare.map(car => (
                  <div key={car.id} className="font-medium text-center">{car.name}</div>
                ))}
                
                <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-md">Price</div>
                {carsToCompare.map(car => (
                  <div key={car.id} className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-md text-center">
                    ${car.price.toLocaleString()}
                  </div>
                ))}
                
                <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-md">Range</div>
                {carsToCompare.map(car => (
                  <div key={car.id} className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-md text-center">
                    {car.range}
                  </div>
                ))}
                
                <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-md">Safety Rating</div>
                {carsToCompare.map(car => (
                  <div key={car.id} className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-md text-center">
                    {car.safetyRating}/5
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="pt-2">
              <div className="grid grid-cols-4 gap-4">
                <div className="font-medium">Performance</div>
                {carsToCompare.map(car => (
                  <div key={car.id} className="font-medium text-center">{car.name}</div>
                ))}
                
                <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-md">Acceleration</div>
                {carsToCompare.map(car => (
                  <div key={car.id} className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-md text-center">
                    {car.acceleration}
                  </div>
                ))}
                
                <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-md">Top Speed</div>
                {carsToCompare.map(car => (
                  <div key={car.id} className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-md text-center">
                    {car.topSpeed}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="pt-2">
              <div className="grid grid-cols-4 gap-4">
                <div className="font-medium">Features</div>
                {carsToCompare.map(car => (
                  <div key={car.id} className="font-medium text-center">{car.name}</div>
                ))}
                
                {Array.from(new Set(carData.flatMap(car => car.features))).map(feature => (
                  <React.Fragment key={feature}>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-md">{feature}</div>
                    {carsToCompare.map(car => (
                      <div key={`${car.id}-${feature}`} className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-md flex justify-center">
                        {car.features.includes(feature) ? (
                          <Check className="text-green-500" />
                        ) : (
                          <X className="text-red-500" />
                        )}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default CarComparison;
