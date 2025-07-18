import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Package, TrendingUp, Users, Plus, Bell, BookOpen, Settings, HelpCircle, CheckCircle, ArrowRight, Star, Target, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth";
import { carDataService } from "@/services/carData";

const ManufacturerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [manufacturerName, setManufacturerName] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [stats, setStats] = useState({
    totalCars: 0,
    pendingOrders: 0,
    monthlyRevenue: 0,
    activeCustomers: 0
  });

  useEffect(() => {
    // Check if user is a manufacturer
    const userType = localStorage.getItem("userType");
    if (userType !== "manufacturer") {
      navigate("/");
      return;
    }

    const name = localStorage.getItem("manufacturerName") || "Manufacturer";
    setManufacturerName(name);
    
    // Check if this is the first time (no cars in database)
    checkFirstTimeUser();
    loadStats();
  }, [navigate]);

  const checkFirstTimeUser = async () => {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        const cars = await carDataService.getCarsByManufacturer(user.uid);
        setIsFirstTime(cars.length === 0);
      }
    } catch (error) {
      console.error('Error checking first time user:', error);
    }
  };

  const loadStats = async () => {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        const cars = await carDataService.getCarsByManufacturer(user.uid);
        setStats({
          totalCars: cars.length,
          pendingOrders: 0, // Will be updated when order service is implemented
          monthlyRevenue: 0, // Will be calculated from real orders
          activeCustomers: 0 // Will be calculated from real customer data
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Empty arrays for real data
  const recentOrders: any[] = [];
  const quickActions = [
    {
      title: "Add New Car Model",
      description: "Upload 3D models and specifications",
      icon: Plus,
      action: () => navigate("/manufacturer/cars/new"),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Manage Inventory",
      description: "View and edit your car models",
      icon: Car,
      action: () => navigate("/manufacturer/cars"),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Process Orders",
      description: "Handle customer orders and requests",
      icon: Package,
      action: () => navigate("/manufacturer/orders"),
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "View Analytics",
      description: "Track performance and insights",
      icon: TrendingUp,
      action: () => navigate("/manufacturer/analytics"),
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "in_production": return "bg-blue-100 text-blue-800";
      case "ready": return "bg-green-100 text-green-800";
      case "delivered": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const onboardingSteps = [
    {
      title: "Upload Your First Car",
      description: "Add a 3D model and specifications",
      completed: stats.totalCars > 0,
      action: () => navigate("/manufacturer/cars/new")
    },
    {
      title: "Set Up Customization Options",
      description: "Configure colors, wheels, and packages",
      completed: false,
      action: () => navigate("/manufacturer/cars")
    },
    {
      title: "Review Orders",
      description: "Check incoming customer orders",
      completed: stats.pendingOrders > 0,
      action: () => navigate("/manufacturer/orders")
    },
    {
      title: "Configure Analytics",
      description: "Set up tracking and reporting",
      completed: false,
      action: () => navigate("/manufacturer/analytics")
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {manufacturerName}! 👋</h1>
            <p className="text-gray-600 mt-2">Here's what's happening with your business today.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/manufacturer/cars/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Car
            </Button>
            <Button variant="outline">
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
            </Button>
          </div>
        </div>

        {/* First Time User Onboarding */}
        {isFirstTime && (
          <Card className="mb-8 border-2 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <Star className="h-5 w-5" />
                Welcome to Carvix Manufacturer Portal!
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                Let's get you started with your first car model. Follow these steps to set up your inventory.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {onboardingSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg bg-white dark:bg-gray-800">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{step.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                    </div>
                    {!step.completed && (
                      <Button size="sm" onClick={step.action}>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCars}</div>
              <p className="text-xs text-muted-foreground">Cars in your catalog</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Orders awaiting processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Revenue this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCustomers}</div>
              <p className="text-xs text-muted-foreground">Customers this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={action.action}>
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Orders
              </CardTitle>
              <CardDescription>Latest orders that need your attention</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{order.id}</span>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                        <p className="text-sm font-medium">{order.car}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{order.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Orders Yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    When customers place orders, they'll appear here for you to process.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/manufacturer/cars/new")}
                  >
                    Add Your First Car
                  </Button>
                </div>
              )}
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate("/manufacturer/orders")}
              >
                View All Orders
              </Button>
            </CardContent>
          </Card>

          {/* Getting Started Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Getting Started Guide
              </CardTitle>
              <CardDescription>Essential resources for manufacturers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <Target className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium">Upload 3D Models</h4>
                    <p className="text-sm text-gray-600">Learn how to prepare and upload your car models</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <Zap className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium">Customization Setup</h4>
                    <p className="text-sm text-gray-600">Configure colors, wheels, and feature packages</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <Settings className="h-5 w-5 text-purple-600" />
                  <div>
                    <h4 className="font-medium">Order Management</h4>
                    <p className="text-sm text-gray-600">Process customer orders and track production</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View Complete Guide
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ManufacturerDashboard;
