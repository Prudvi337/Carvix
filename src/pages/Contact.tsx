
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin,Clock, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you shortly.",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }, 1000);
  };

  return (
    <Layout>
      <div className="bg-gradient-to-b from-primary-100 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-600">Contact Us</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Have questions? We're here to help you with any inquiries about our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="animate-slide-up [animation-delay:200ms]">
              <Card className="border-none shadow-lg h-full">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 text-primary-600">Send Us a Message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        required
                        className="border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Your Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please provide details about your inquiry..."
                        required
                        className="min-h-32 border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-primary-500 hover:bg-primary-600"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="animate-slide-up [animation-delay:400ms]">
              <div className="grid grid-cols-1 gap-8">
                <Card className="border-none shadow-lg">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6 text-primary-600">Contact Information</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <MapPin className="text-primary-500 mr-4 h-6 w-6 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold text-lg">Address</h3>
                          <p className="text-gray-600">123 Innovation Drive, Tech Park</p>
                          <p className="text-gray-600">San Francisco, CA 94105</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Phone className="text-primary-500 mr-4 h-6 w-6 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold text-lg">Phone</h3>
                          <p className="text-gray-600">+1 (555) 123-4567</p>
                          <p className="text-gray-600">+1 (555) 765-4321</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Mail className="text-primary-500 mr-4 h-6 w-6 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold text-lg">Email</h3>
                          <p className="text-gray-600">info@carvix.com</p>
                          <p className="text-gray-600">support@carvix.com</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-none shadow-lg bg-primary-500 text-white">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-4">Follow Us</h2>
                    <p className="mb-6">Stay connected with us on social media for the latest updates and features.</p>
                    <div className="flex space-x-4">
                      <a href="#" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                         <Facebook className="h-5 w-5" />
                      </a>
                      <a href="#" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <Twitter className="h-5 w-5" />
                      </a>
                      <a href="#" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <Instagram className="h-5 w-5" />
                      </a>
                      <a href="#" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <Linkedin className="h-5 w-5" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
