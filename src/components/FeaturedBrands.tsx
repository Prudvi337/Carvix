
import { Link } from "react-router-dom";

interface BrandProps {
  name: string;
  logoText: string; // In a real app, we'd use an image, but for this demo we'll use text
  delay?: number;
}

const Brand = ({ name, logoText, delay = 0 }: BrandProps) => (
  <Link to={`/catalog?brand=${name.toLowerCase()}`} className="block">
    <div className="h-28 border border-gray-100 rounded-lg bg-white flex items-center justify-center hover:shadow-md transition-all group animate-zoom-in" style={{animationDelay: `${delay}ms`}}>
      <span className="text-2xl font-bold text-gray-700 group-hover:text-primary-500 transition-colors">
        {logoText}
      </span>
    </div>
    <p className="mt-3 text-center text-gray-700">{name}</p>
  </Link>
);

const FeaturedBrands = () => {
  const brands = [
    { name: "Audi", logoText: "AUDI" },
    { name: "BMW", logoText: "BMW" },
    { name: "Mercedes", logoText: "MB" },
    { name: "Tesla", logoText: "TESLA" },
    { name: "Toyota", logoText: "TOYOTA" },
    { name: "Honda", logoText: "HONDA" },
    { name: "Ford", logoText: "FORD" },
    { name: "Volvo", logoText: "VOLVO" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Featured Brands</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through our extensive catalog of top car manufacturers and find the perfect match for your needs.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {brands.map((brand, index) => (
            <Brand key={index} name={brand.name} logoText={brand.logoText} delay={index * 100} />
          ))}
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto mt-16 px-4">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 md:p-12 shadow-lg text-white text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Looking for another brand?</h3>
          <p className="text-lg mb-6 text-white/90">
            We're constantly expanding our catalog with new manufacturers and models.
          </p>
          <Link 
            to="/catalog" 
            className="inline-block bg-white text-primary-600 hover:bg-primary-50 px-8 py-3 rounded-lg font-medium transition-colors"
          >
            View Full Catalog
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBrands;
