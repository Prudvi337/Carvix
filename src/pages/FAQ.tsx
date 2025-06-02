
import Layout from "@/components/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FAQPage = () => {
  const faqs = [
    {
      question: "How does the 3D car customization work?",
      answer: "Our platform uses advanced WebGL technology to render high-quality 3D models of vehicles. You can rotate, zoom, and customize various aspects of the car including color, wheels, interior options, and more. The 3D rendering happens in real-time, giving you an immediate visual of your customization choices."
    },
    {
      question: "Can I view the customized car in my own environment?",
      answer: "Yes! Carvix offers an Augmented Reality (AR) feature that allows you to place your customized vehicle in your real-world environment. This feature works on compatible smartphones and tablets without requiring any app download. Simply tap the 'View in AR' button during the customization process."
    },
    {
      question: "Which car brands are available on Carvix?",
      answer: "We currently offer models from major manufacturers including Audi, BMW, Mercedes, Tesla, Toyota, Honda, Ford, and Volvo. We're continuously adding new brands and models to our catalog. If you don't see a specific model you're interested in, please contact us."
    },
    {
      question: "How accurate are the prices shown during customization?",
      answer: "The prices displayed during the customization process reflect the manufacturer's suggested retail price (MSRP) plus the cost of your selected options and packages. While we strive for accuracy, final pricing may vary slightly at dealerships due to local taxes, fees, and promotions."
    },
    {
      question: "Can I save my customized car configuration for later?",
      answer: "Absolutely! By creating a free Carvix account, you can save multiple car configurations to revisit or modify later. Your saved builds are accessible from any device when you log in to your account."
    },
    {
      question: "Is my personal information secure when I place an order?",
      answer: "Yes, your privacy and security are our top priorities. We use industry-standard encryption protocols to protect all personal and payment information. Our platform is fully compliant with data protection regulations, and we never share your information with third parties without your explicit consent."
    },
    {
      question: "What happens after I complete a purchase or reservation?",
      answer: "After completing a purchase or reservation, you'll receive an immediate confirmation via email. Our team will then connect you with the nearest dealership for your selected brand. The dealership will contact you within 24-48 hours to finalize details and arrange delivery or pickup of your vehicle."
    },
    {
      question: "Can I cancel or modify my order after it's placed?",
      answer: "Yes, you can cancel or modify your order within 24 hours without any penalty. For changes after 24 hours, please contact our customer support team directly, and we'll work with you and the dealership to accommodate your request whenever possible."
    }
  ];

  return (
    <Layout>
      <div className="bg-gradient-to-b from-primary-100 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-600">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Find answers to common questions about our platform and services
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 animate-slide-up [animation-delay:200ms]">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6 py-2">
                  <AccordionTrigger className="text-lg font-medium text-gray-900 hover:text-primary-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 pt-2">
                    <p className="whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          <div className="mt-12 text-center animate-slide-up [animation-delay:400ms]">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Still have questions?</h2>
            <p className="text-lg text-gray-600 mb-6">
              Our customer support team is ready to assist you with any other inquiries.
            </p>
            <Button size="lg" className="bg-primary-500 hover:bg-primary-600">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQPage;
