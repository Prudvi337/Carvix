import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { authService } from "@/services/auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Legal from "./pages/Legal";
import Catalog from "./pages/Catalog";
import CarSearch from "./pages/CarSearch";
import CustomizeCar from "./pages/CustomizeCar";
import ARViewer from "./pages/ARViewer";
import BuildDetail from "./pages/BuildDetail";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import SavedCars from "./pages/SavedCars";
import ManufacturerDashboard from "./pages/manufacturer/Dashboard";
import ManufacturerCars from "./pages/manufacturer/Cars";
import NewCar from "./pages/manufacturer/NewCar";
import ManufacturerOrders from "./pages/manufacturer/Orders";
import ManufacturerAnalytics from "./pages/manufacturer/Analytics";
import CarDetail from "./pages/manufacturer/CarDetail";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  useEffect(() => {
    // Initialize auth service and restore profile from localStorage
    authService.init();
    authService.restoreProfileFromLocalStorage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/search" element={<CarSearch />} />
                  <Route path="/customize/:carId" element={<CustomizeCar />} />
                  <Route path="/ar/:buildId" element={<ARViewer />} />
                  <Route path="/build/:buildId" element={<BuildDetail />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/confirmation" element={<OrderConfirmation />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/saved-cars" element={<SavedCars />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/legal" element={<Legal />} />
                  
                  {/* Manufacturer Routes */}
                  <Route path="/manufacturer/dashboard" element={<ManufacturerDashboard />} />
                  <Route path="/manufacturer/cars" element={<ManufacturerCars />} />
                  <Route path="/manufacturer/cars/new" element={<NewCar />} />
                  <Route path="/manufacturer/orders" element={<ManufacturerOrders />} />
                  <Route path="/manufacturer/analytics" element={<ManufacturerAnalytics />} />
                  <Route path="/manufacturer/cars/:carId" element={<CarDetail />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
