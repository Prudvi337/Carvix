
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Car, Gauge, Star, Award, HeartHandshake, Wrench, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AboutPage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary-100 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 text-primary-600 leading-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Redefining Your Car Experience
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              At Carvix, we're not just changing how you buy a car —
              <span className="text-primary-500 font-semibold"> we're transforming how you experience it.</span>
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-primary-600">Our Vision & Journey</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Carvix was born from a simple yet revolutionary idea: car shopping should be 
                an immersive, transparent, and empowering experience. Founded in 2023 by a team 
                of automotive enthusiasts and technology innovators, we set out to bridge the gap 
                between traditional dealerships and the digital future.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our platform combines cutting-edge 3D visualization with intuitive customization tools 
                that place you in complete control. We've partnered with leading manufacturers to create 
                the most detailed digital representations of vehicles ever developed, allowing you to explore 
                every aspect of your potential purchase from the comfort of your home.
              </p>
            </motion.div>

            <motion.div 
              className="rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="bg-gradient-to-br from-primary-300 to-primary-600 h-80 flex items-center justify-center p-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 shadow-xl">
                  <div className="text-white text-4xl font-bold mb-3">Carvix</div>
                  <div className="text-white/80 text-xl">Future of car shopping</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mission Statement Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="inline-block mb-6 p-3 bg-primary-50 rounded-full"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="h-8 w-8 text-primary-500" />
            </motion.div>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6 text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Our Mission
            </motion.h2>
            
            <motion.p
              className="text-xl text-gray-700 mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              To create a car buying journey that is as extraordinary as the vehicles themselves. 
              We believe in empowering customers through technology, transparency, and thoughtful 
              design, making the path to your perfect car an experience to remember, not a process to endure.
            </motion.p>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                  <Car className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Selection</h3>
                <p className="text-gray-600">Curated inventory of premium vehicles from trusted manufacturers worldwide.</p>
              </div>

              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                  <Gauge className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Performance</h3>
                <p className="text-gray-600">Every vehicle is performance-tested to ensure exceptional driving experiences.</p>
              </div>

              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Excellence</h3>
                <p className="text-gray-600">Uncompromising standards in selection, service, and customer satisfaction.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16 text-gray-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Core Values
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-none shadow-xl hover:shadow-2xl transition-shadow h-full bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 text-primary-600">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Innovation</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We constantly push the boundaries of what's possible in automotive retail, 
                    harnessing cutting-edge technologies like augmented reality, 3D visualization, 
                    and AI-powered recommendations to create experiences that delight and inspire.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border-none shadow-xl hover:shadow-2xl transition-shadow h-full bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 text-primary-600">
                    <Award className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Transparency</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We believe in clear information and honest pricing throughout your journey. 
                    Our detailed vehicle specifications, upfront pricing, and comprehensive history 
                    reports empower you to make informed decisions with absolute confidence and peace of mind.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="border-none shadow-xl hover:shadow-2xl transition-shadow h-full bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 text-primary-600">
                    <HeartHandshake className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Customer Focus</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Every feature we develop, every partnership we forge, and every decision 
                    we make starts with a simple question: "How does this benefit our customers?"
                    We're committed to creating experiences that place your needs and preferences
                    at the heart of everything we do.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-primary-600">Our Technology</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                At the heart of Carvix lies our proprietary 3D rendering engine that creates photorealistic 
                digital twins of every vehicle in our inventory. Each model is meticulously crafted with 
                thousands of customizable elements, allowing you to visualize your dream car down to the smallest detail.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Our augmented reality features let you place vehicles in your own driveway, adjust lighting 
                conditions to match different times of day, and even take virtual test drives through 
                various terrain types. It's not just about seeing a car—it's about experiencing it.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white">
                <Link to="/catalog" className="flex items-center">
                  Explore Our Technology <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              className="order-1 lg:order-2 grid grid-cols-2 gap-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-300 rounded-2xl flex items-center justify-center shadow-lg">
                <Wrench className="h-16 w-16 text-blue-600" />
              </div>
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-purple-300 rounded-2xl flex items-center justify-center shadow-lg">
                <Car className="h-16 w-16 text-purple-600" />
              </div>
              <div className="aspect-square bg-gradient-to-br from-amber-100 to-amber-300 rounded-2xl flex items-center justify-center shadow-lg">
                <Gauge className="h-16 w-16 text-amber-600" />
              </div>
              <div className="aspect-square bg-gradient-to-br from-green-100 to-green-300 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-16 w-16 text-green-600" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to revolutionize your car shopping experience?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-3xl mx-auto opacity-90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of satisfied customers who've discovered the perfect vehicle 
            through Carvix's immersive platform.
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button size="lg" variant="outline" className="border-primary-500/50 text-primary-500 hover:text-white hover:bg-primary-500/10 transition-colors">
              <Link to="/catalog" className="flex items-center">
                Browse Cars <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-500/50 text-primary-500 hover:text-white hover:bg-primary-500/10 transition-colors">
              <Link to="/contact" className="flex items-center">
                Contact Us <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
