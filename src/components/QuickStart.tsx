
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Car, Layers, UserCircle } from "lucide-react";

const QuickStart = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-gray-900 to-black text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-slide-up neon-text">Ready to Get Started?</h2>
          <p className="text-xl mb-12 text-gray-300 animate-slide-up [animation-delay:200ms]">
            Choose your path to start exploring the future of car customization
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl transform hover:-translate-y-1 transition-all animate-zoom-in hover:shadow-lg hover:shadow-primary-500/10">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-primary-500/10 rounded-full flex items-center justify-center mb-6">
                <Car className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Browse Cars</h3>
              <p className="text-gray-400 mb-6">Explore our extensive catalog of vehicles with detailed specifications</p>
              <Link to="/catalog" className="mt-auto">
                <Button variant="outline" size="lg" className="border-primary-500/50 text-primary-400 hover:bg-primary-500/10 hover:text-white w-full">
                  View Catalog
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl transform hover:-translate-y-1 transition-all animate-zoom-in [animation-delay:200ms] hover:shadow-lg hover:shadow-primary-500/10">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-primary-500/10 rounded-full flex items-center justify-center mb-6">
                <Layers className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Explore in AR</h3>
              <p className="text-gray-400 mb-6">Place cars in your environment with our cutting-edge AR technology</p>
              <Link to="/ar" className="mt-auto">
                <Button variant="outline" size="lg" className="border-primary-500/50 text-primary-400 hover:bg-primary-500/10 hover:text-white w-full">
                  Try AR
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl transform hover:-translate-y-1 transition-all animate-zoom-in [animation-delay:400ms] hover:shadow-lg hover:shadow-primary-500/10">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-primary-500/10 rounded-full flex items-center justify-center mb-6">
                <UserCircle className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Login to Save</h3>
              <p className="text-gray-400 mb-6">Create an account to save your customizations for later reference</p>
              <Link to="/login" className="mt-auto">
                <Button variant="outline" size="lg" className="border-primary-500/50 text-primary-400 hover:bg-primary-500/10 hover:text-white w-full">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Grid lines overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#0ea5e910_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
    </section>
  );
};

export default QuickStart;
