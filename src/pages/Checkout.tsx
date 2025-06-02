
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Truck, ShieldCheck, CheckCircle } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState<string>("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    deliveryDate: ""
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });

  // Get build information from local storage
  const buildData = JSON.parse(localStorage.getItem('currentBuild') || '{}');
  const { totalPrice = 49999 } = buildData;

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleDeliveryInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (nextStep: string) => {
    setActiveStep(nextStep);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "Order Placed Successfully",
        description: "You will receive a confirmation email shortly.",
      });
      
      // Store order details in local storage for the confirmation page
      const orderDetails = {
        orderId: "ORD-" + Date.now(),
        customerName: `${personalInfo.firstName} ${personalInfo.lastName}`,
        email: personalInfo.email,
        deliveryAddress: `${deliveryInfo.address}, ${deliveryInfo.city}, ${deliveryInfo.state} ${deliveryInfo.zipCode}`,
        estimatedDelivery: "May 25, 2025",
        totalAmount: totalPrice,
        buildDetails: buildData
      };
      
      localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
      navigate('/confirmation');
    }, 2000);
  };

  const handleBack = () => {
    const carId = buildData?.carId || '1';
    navigate(`/customize/${carId}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-gray-600">Complete your purchase</p>
          </div>
          <Button variant="outline" onClick={handleBack} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Customization
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-primary-500/20">
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>Complete all steps to place your order</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeStep} onValueChange={setActiveStep}>
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="personal" className="data-[state=active]:text-primary">
                      Personal Info
                    </TabsTrigger>
                    <TabsTrigger value="delivery" className="data-[state=active]:text-primary">
                      Delivery
                    </TabsTrigger>
                    <TabsTrigger value="payment" className="data-[state=active]:text-primary">
                      Payment
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            placeholder="Enter your first name"
                            value={personalInfo.firstName}
                            onChange={handlePersonalInfoChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            placeholder="Enter your last name"
                            value={personalInfo.lastName}
                            onChange={handlePersonalInfoChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={personalInfo.email}
                          onChange={handlePersonalInfoChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="(123) 456-7890"
                          value={personalInfo.phone}
                          onChange={handlePersonalInfoChange}
                          required
                        />
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          onClick={() => handleNextStep("delivery")}
                          disabled={!personalInfo.firstName || !personalInfo.lastName || !personalInfo.email}
                          className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
                        >
                          Continue to Delivery
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="delivery">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input
                          id="address"
                          name="address"
                          placeholder="123 Main St"
                          value={deliveryInfo.address}
                          onChange={handleDeliveryInfoChange}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            placeholder="City"
                            value={deliveryInfo.city}
                            onChange={handleDeliveryInfoChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            name="state"
                            placeholder="State"
                            value={deliveryInfo.state}
                            onChange={handleDeliveryInfoChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          placeholder="12345"
                          value={deliveryInfo.zipCode}
                          onChange={handleDeliveryInfoChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="deliveryDate">Preferred Delivery Date</Label>
                        <Input
                          id="deliveryDate"
                          name="deliveryDate"
                          type="date"
                          value={deliveryInfo.deliveryDate}
                          onChange={handleDeliveryInfoChange}
                        />
                      </div>
                      
                      <div className="pt-4 flex justify-between">
                        <Button 
                          variant="outline" 
                          onClick={() => handleNextStep("personal")}
                        >
                          Back
                        </Button>
                        <Button 
                          onClick={() => handleNextStep("payment")}
                          disabled={!deliveryInfo.address || !deliveryInfo.city || !deliveryInfo.state || !deliveryInfo.zipCode}
                          className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
                        >
                          Continue to Payment
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="payment">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentInfo.cardNumber}
                          onChange={handlePaymentInfoChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          placeholder="John Doe"
                          value={paymentInfo.cardName}
                          onChange={handlePaymentInfoChange}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={paymentInfo.expiryDate}
                            onChange={handlePaymentInfoChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                            value={paymentInfo.cvv}
                            onChange={handlePaymentInfoChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="pt-4 flex justify-between">
                        <Button 
                          variant="outline" 
                          onClick={() => handleNextStep("delivery")}
                          type="button"
                        >
                          Back
                        </Button>
                        <Button 
                          type="submit"
                          disabled={isSubmitting || !paymentInfo.cardNumber || !paymentInfo.cardName || !paymentInfo.expiryDate || !paymentInfo.cvv}
                          className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
                        >
                          {isSubmitting ? "Processing..." : "Place Order"}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="border-primary-500/20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="text-primary-500 h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-bold">{buildData.carId ? `Model ${buildData.carId.toUpperCase()}` : "Custom Vehicle"}</h3>
                      <p className="text-sm text-gray-600">Customized Build</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Base Price:</span>
                      <span>${buildData.basePrice?.toLocaleString() || "45,000"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Options & Customization:</span>
                      <span>${((buildData.totalPrice || 49999) - (buildData.basePrice || 45000)).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Delivery Fee:</span>
                      <span>$1,200</span>
                    </div>
                    <div className="flex items-center justify-between font-bold border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                      <span>Total:</span>
                      <span className="text-primary-500">${(totalPrice + 1200).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-primary-500" />
                    <span>Estimated delivery: 8-12 weeks</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ShieldCheck className="h-4 w-4 text-primary-500" />
                    <span>5-year comprehensive warranty included</span>
                  </div>
                </div>
                
                <div className="p-4 bg-primary-50 dark:bg-primary-950/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Satisfaction Guaranteed</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        30-day return policy with full refund if you're not completely satisfied with your vehicle.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
