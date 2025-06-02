
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Car, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-lg"
        >
          <div className="relative mx-auto w-32 h-32">
            <div className="absolute inset-0 flex items-center justify-center">
              <img src="/images/ilogo.png"alt="Logo" className="h-18 w-18 object-contain"/>
            </div>
          </div>
          
          <h1 className="text-6xl sm:text-8xl font-extrabold text-gray-900 dark:text-gray-100">404</h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 dark:text-gray-300">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on the right road.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <Button 
              asChild
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </Button>
            <Button 
              asChild
              className="w-full sm:w-auto bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
            >
              <Link to="/search">
                <Car className="mr-2 h-4 w-4" /> Browse Cars
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NotFound;
