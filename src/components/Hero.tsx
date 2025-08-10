
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CarModel3D from "./CarModel3D";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import ModelLoader from "./ModelLoader";

const Hero = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <ModelLoader onLoadingComplete={() => setIsLoading(false)} />}
      <section className="min-h-[85vh] flex items-center relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
        <div 
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00TTE2IDM0YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNCIvPjwvZz48L2c+PC9zdmc+')] opacity-10"
      ></div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-slide-up">
            <div className="inline-block bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <span className="font-semibold">The Future of Car Shopping</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 neon-text">
              Customize Your <span className="text-white">Dream Car</span> in 3D
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
              Experience the future of car shopping with interactive 3D visualization and augmented reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="cyber-button group">
                <Link to="/catalog" className="flex items-center">
                  Start Customizing 
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" className="border-primary-500/50 text-primary-500 hover:text-white hover:bg-primary-500/10 transition-colors">
                <Link to="/about" className="flex items-center">
                  Learn More
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary-500 rounded-full opacity-10 blur-3xl animate-pulse [animation-delay:2s]"></div>
            
            <div className="relative bg-black/30 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-xl animate-glow">
              <CarModel3D 
                className="h-[400px]" 
                selectedColor={null}
                customColor={null}
              />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg rounded-xl px-6 py-3 text-white">
                <p className="font-semibold flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                  Interactive 3D View
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Updated background decoration elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-12 right-12 w-32 h-32 bg-secondary-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-32 right-8 w-16 h-16 bg-primary-300/30 rounded-full blur-xl"></div>
    </section>
    </>
  );
};

export default Hero;
