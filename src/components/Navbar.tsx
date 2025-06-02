
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X, User, Car, Heart, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [savedCars, setSavedCars] = useState(0);
  const [cartItems, setCartItems] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'manufacturer'>('customer');
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check if user is logged in and get user type
    const checkLoginStatus = () => {
      const isUserLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const currentUserType = localStorage.getItem("userType") as 'customer' | 'manufacturer' || 'customer';
      setIsLoggedIn(isUserLoggedIn);
      setUserType(currentUserType);
    };

    // Get saved cars and cart items counts from localStorage (only for customers)
    const getSavedItems = () => {
      if (isLoggedIn && userType === 'customer') {
        const savedCarsData = localStorage.getItem("savedCars");
        const cartItemsData = localStorage.getItem("cartItems");
        
        setSavedCars(savedCarsData ? JSON.parse(savedCarsData).length : 0);
        setCartItems(cartItemsData ? JSON.parse(cartItemsData).length : 0);
      } else {
        setSavedCars(0);
        setCartItems(0);
      }
    };

    checkLoginStatus();
    getSavedItems();

    // Setup event listeners for real-time updates
    window.addEventListener("storage", getSavedItems);
    window.addEventListener("savedCarsUpdated", getSavedItems);
    window.addEventListener("cartItemsUpdated", getSavedItems);
    window.addEventListener("loginStatusChanged", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", getSavedItems);
      window.removeEventListener("savedCarsUpdated", getSavedItems);
      window.removeEventListener("cartItemsUpdated", getSavedItems);
      window.removeEventListener("loginStatusChanged", checkLoginStatus);
    };
  }, [isLoggedIn, userType]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("userType");
    localStorage.removeItem("manufacturerName");
    setIsLoggedIn(false);
    setUserType('customer');
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event("loginStatusChanged"));
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md' : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
       <div className="flex justify-between items-center">
  <Link to="/" className="flex items-center space-x-2">
    <img
      src="/images/logo.png" 
      alt="Carvix"
      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null;
        target.style.display = 'none';
        (target.nextSibling as HTMLElement).style.display = 'inline';
      }}
      className="h-8 w-auto"
    />
    <span
      className="hidden text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 text-transparent bg-clip-text"
    >
      Carvix
    </span>
  </Link>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {userType === 'manufacturer' ? (
              // Manufacturer Navigation
              <>
                <Link to="/manufacturer/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 font-medium transition-colors relative group py-2">
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></span>
                </Link>
                <Link to="/manufacturer/cars" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 font-medium transition-colors relative group py-2">
                  My Cars
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></span>
                </Link>
                <Link to="/manufacturer/orders" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 font-medium transition-colors relative group py-2">
                  Orders
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></span>
                </Link>
                <Link to="/manufacturer/analytics" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 font-medium transition-colors relative group py-2">
                  Analytics
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></span>
                </Link>
              </>
            ) : (
              // Customer Navigation
              <>
                <Link to="/search" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 font-medium transition-colors relative group py-2">
                  Browse Cars
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></span>
                </Link>
                <Link to="/about" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 font-medium transition-colors relative group py-2">
                  About
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></span>
                </Link>
                <Link to="/contact" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 font-medium transition-colors relative group py-2">
                  Contact
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></span>
                </Link>
                <Link to="/faq" className="text-gray-700 dark:text-gray-200 hover:text-primary-500 font-medium transition-colors relative group py-2">
                  FAQ
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></span>
                </Link>
              </>
            )}
            
            <div className="flex items-center space-x-2">
              {isLoggedIn && userType === 'customer' && (
                <>
                  <Link to="/saved-cars" className="relative p-1.5 text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors">
                    <Heart className="h-5 w-5" />
                    {savedCars > 0 && (
                      <Badge className="absolute -top-1.5 -right-1.5 min-w-[18px] h-4.5 flex items-center justify-center">
                        {savedCars}
                      </Badge>
                    )}
                  </Link>
                  
                  <Link to="/checkout" className="relative p-1.5 text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItems > 0 && (
                      <Badge className="absolute -top-1.5 -right-1.5 min-w-[18px] h-4.5 flex items-center justify-center">
                        {cartItems}
                      </Badge>
                    )}
                  </Link>
                </>
              )}
              
              {!isLoggedIn ? (
                <Link to="/login">
                  <Button className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white flex items-center gap-2">
                    <User className="h-4 w-4" /> Login
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <User className="h-4 w-4" /> Logout
                </Button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {isLoggedIn && userType === 'customer' && (
              <Link to="/checkout" className="relative p-1.5 mr-3 text-gray-700 dark:text-gray-300">
                <ShoppingCart className="h-5 w-5" />
                {cartItems > 0 && (
                  <Badge className="absolute -top-1.5 -right-1.5 min-w-[18px] h-4.5 flex items-center justify-center">
                    {cartItems}
                  </Badge>
                )}
              </Link>
            )}
            
            <Button variant="ghost" onClick={toggleMenu} className="text-gray-700">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden border-t border-gray-100 dark:border-gray-800 mt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="py-4">
                <div className="flex flex-col space-y-2">
                  {userType === 'manufacturer' ? (
                    // Manufacturer Mobile Navigation
                    <>
                      <Link 
                        to="/manufacturer/dashboard" 
                        className="text-gray-700 dark:text-gray-300 hover:text-primary-500 font-medium transition-colors px-2 py-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg"
                        onClick={toggleMenu}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/manufacturer/cars" 
                        className="text-gray-700 dark:text-gray-300 hover:text-primary-500 font-medium transition-colors px-2 py-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg"
                        onClick={toggleMenu}
                      >
                        My Cars
                      </Link>
                      <Link 
                        to="/manufacturer/orders" 
                        className="text-gray-700 dark:text-gray-300 hover:text-primary-500 font-medium transition-colors px-2 py-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg"
                        onClick={toggleMenu}
                      >
                        Orders
                      </Link>
                    </>
                  ) : (
                    // Customer Mobile Navigation
                    <>
                      <Link 
                        to="/search" 
                        className="text-gray-700 dark:text-gray-300 hover:text-primary-500 font-medium transition-colors px-2 py-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg"
                        onClick={toggleMenu}
                      >
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4" />
                          Browse Cars
                        </div>
                      </Link>
                      
                      {isLoggedIn && (
                        <Link 
                          to="/saved-cars" 
                          className="text-gray-700 dark:text-gray-300 hover:text-primary-500 font-medium transition-colors px-2 py-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg"
                          onClick={toggleMenu}
                        >
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            Saved Cars
                            {savedCars > 0 && (
                              <Badge className="ml-auto">{savedCars}</Badge>
                            )}
                          </div>
                        </Link>
                      )}
                      
                      <Link 
                        to="/about" 
                        className="text-gray-700 dark:text-gray-300 hover:text-primary-500 font-medium transition-colors px-2 py-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg"
                        onClick={toggleMenu}
                      >
                        About
                      </Link>
                      <Link 
                        to="/contact" 
                        className="text-gray-700 dark:text-gray-300 hover:text-primary-500 font-medium transition-colors px-2 py-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg"
                        onClick={toggleMenu}
                      >
                        Contact
                      </Link>
                      <Link 
                        to="/faq" 
                        className="text-gray-700 dark:text-gray-300 hover:text-primary-500 font-medium transition-colors px-2 py-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg"
                        onClick={toggleMenu}
                      >
                        FAQ
                      </Link>
                    </>
                  )}
                  
                  <div className="pt-2 flex flex-col space-y-2">
                    {!isLoggedIn ? (
                      <>
                        <Link to="/login" onClick={toggleMenu}>
                          <Button 
                            className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white w-full flex items-center justify-center gap-2"
                          >
                            <User className="h-4 w-4" /> Login
                          </Button>
                        </Link>
                        <Link to="/signup" onClick={toggleMenu}>
                          <Button 
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                          >
                            Sign Up
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <Button 
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => {
                          handleLogout();
                          toggleMenu();
                        }}
                      >
                        Logout
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
