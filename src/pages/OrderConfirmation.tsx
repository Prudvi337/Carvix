import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home, Truck, Calendar, Phone, Mail, MapPin, Share2 } from "lucide-react";
import { orderService, Order } from "@/services/orderService";

interface OrderDetails {
  orderId: string;
  customerName: string;
  email: string;
  deliveryAddress: string;
  estimatedDelivery: string;
  totalAmount: number;
  buildDetails?: any;
}

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (!orderId) {
      setError('No order ID provided.');
      setIsLoading(false);
      return;
    }
    orderService.getOrderById(orderId)
      .then(order => {
        if (order) {
          setOrderDetails(order);
        } else {
          setError('Order not found.');
        }
        setIsLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch order.');
        setIsLoading(false);
      });
  }, [searchParams]);

  const handleBackToHome = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Card className="max-w-lg w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-red-500">Error</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-6">{error}</p>
              <Button onClick={handleBackToHome}>Return to Homepage</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!orderDetails) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Card className="max-w-lg w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-red-500">No Order Found</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-6">We couldn't find any recent order details. You may need to complete a purchase first.</p>
              <Button onClick={handleBackToHome}>Return to Homepage</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="text-primary-500 h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 max-w-md">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
          </div>

          <Card className="border-primary-500/20 mb-8">
            <CardHeader className="bg-primary-50/50 dark:bg-primary-950/20">
              <CardTitle className="flex items-center">
                <span className="text-xl">Order Summary</span>
                <span className="ml-auto text-sm font-normal text-muted-foreground">Order #{orderDetails.id}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Confirmation sent to:</span>
                  </div>
                  <p className="font-medium">{orderDetails.email}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Order Date:</span>
                  </div>
                  <p className="font-medium">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                <h3 className="text-lg font-medium mb-4">Vehicle Details</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-lg flex items-center justify-center text-primary-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                        <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                        <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold">
                        {orderDetails.buildDetails?.carId ? `Model ${orderDetails.buildDetails.carId.toUpperCase()}` : "Custom Vehicle"}
                      </h4>
                      <p className="text-sm text-muted-foreground">Premium Electric Vehicle</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="font-bold">${orderDetails.totalAmount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total Price</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Truck className="h-5 w-5" /> Delivery Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <span className="text-muted-foreground text-sm">Delivery Address:</span>
                        <p className="font-medium">{orderDetails.deliveryAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <span className="text-muted-foreground text-sm">Estimated Delivery:</span>
                        <p className="font-medium">{orderDetails.estimatedDelivery}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Phone className="h-5 w-5" /> Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-muted-foreground text-sm">Name:</span>
                      <p className="font-medium">{orderDetails.customerName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">Email:</span>
                      <p className="font-medium">{orderDetails.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-gray-900/50 flex flex-wrap gap-3">
              <Button variant="outline" className="flex items-center gap-2" onClick={handleBackToHome}>
                <Home className="h-4 w-4" /> Return to Home
              </Button>
              <Button className="flex items-center gap-2" variant="outline">
                <Share2 className="h-4 w-4" /> Share Purchase
              </Button>
            </CardFooter>
          </Card>
          
          <div className="bg-primary-50 dark:bg-primary-950/20 p-6 rounded-lg text-center">
            <h3 className="font-medium text-lg mb-2">What's Next?</h3>
            <p className="text-muted-foreground mb-4">
              We're preparing your vehicle for delivery. You'll receive email updates about your order status.
              Our customer service team will contact you to schedule the exact delivery date and time.
            </p>
            <p className="text-sm text-muted-foreground">
              If you have any questions, contact us at <span className="text-primary-500">support@carvix.com</span>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
