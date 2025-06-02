
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00TTE2IDM0YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNCIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
    
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="mb-6">
              <img 
                src="/images/slogo.png" 
                alt="Carvix Logo" 
                className="max-h-16" 
              />
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              The most advanced car customization platform with 3D visualization and augmented reality capabilities. Experience the future of car shopping today.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-primary-400 hover:text-primary-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-primary-400 hover:text-primary-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-primary-400 hover:text-primary-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-primary-400 hover:text-primary-300">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-gray-700 pb-2">Explore</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/catalog" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 group-hover:scale-125 transition-transform"></span>
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link to="/ar" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 group-hover:scale-125 transition-transform"></span>
                  AR Experience
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 group-hover:scale-125 transition-transform"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 group-hover:scale-125 transition-transform"></span>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-gray-700 pb-2">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/legal" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 group-hover:scale-125 transition-transform"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 group-hover:scale-125 transition-transform"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 group-hover:scale-125 transition-transform"></span>
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-gray-700 pb-2">Contact</h3>
            <ul className="space-y-4">
              <li className="text-gray-400 flex items-start group">
                <Mail className="h-5 w-5 mr-3 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="group-hover:text-primary-400 transition-colors">info@carvix.com</span>
              </li>
              <li className="text-gray-400 flex items-start group">
                <Phone className="h-5 w-5 mr-3 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="group-hover:text-primary-400 transition-colors">+1 (555) 123-4567</span>
              </li>
              <li className="text-gray-400 flex items-start group">
                <MapPin className="h-5 w-5 mr-3 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="group-hover:text-primary-400 transition-colors">123 Innovation Drive, San Francisco, CA 94105</span>
              </li>
              <li>
                <Link to="/contact" className="text-primary-400 hover:text-primary-300 transition-colors font-medium">
                  Contact Form →
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-12 text-center text-gray-500">
          <p className="text-sm">© {currentYear} Carvix. All rights reserved. Designed with <span className="text-primary-400">♥</span> for car enthusiasts everywhere.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
