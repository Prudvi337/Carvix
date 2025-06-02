
import { ReactNode } from "react";
import { ShieldCheck, Plus, Globe, Brush } from "lucide-react";

interface FeatureProps {
  title: string;
  description: string;
  icon: ReactNode;
  delay?: number;
}

const Feature = ({ title, description, icon, delay = 0 }: FeatureProps) => (
  <div className="cyber-card p-6 hover:-translate-y-1 transition-all animate-zoom-in" style={{animationDelay: `${delay}ms`}}>
    <div className="w-14 h-14 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-lg flex items-center justify-center text-primary-500 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const ValueProposition = () => {
  const features = [
    {
      title: "Interactive 3D",
      description: "Explore every detail with our interactive 3D models that give you a complete view of your dream car.",
      icon: <Globe className="h-6 w-6 text-primary-500" />,
    },
    {
      title: "Augmented Reality",
      description: "Place the car in your driveway with our AR technology and see how it fits in your real environment.",
      icon: <Plus className="h-6 w-6 text-primary-500" />,
    },
    {
      title: "Multi-Brand Access",
      description: "Choose from a wide variety of top car brands, all available on one seamless platform.",
      icon: <ShieldCheck className="h-6 w-6 text-primary-500" />,
    },
    {
      title: "Easy Customization",
      description: "Personalize every aspect of your vehicle with our intuitive customization tools.",
      icon: <Brush className="h-6 w-6 text-primary-500" />,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MCA4MCI+PHBhdGggZD0iTTAgMGg4MHY4MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBoODB2ODBIMHptNzkgNzlIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxem0wLTJIMXYtMWg3OHYxeiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-20"></div>
    
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="neon-text">Next Generation</span> <span className="text-white">Car Shopping</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experience the future of car customization with powerful tools that bring your dream vehicle to life.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Feature
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              delay={index * 150}
            />
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>
    </section>
  );
};

export default ValueProposition;
