
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Package, TrendingUp, Users, Plus, Bell } from "lucide-react";

const ManufacturerDashboard = () => {
  const navigate = useNavigate();
  const [manufacturerName, setManufacturerName] = useState("");
  const [stats, setStats] = useState({
    totalCars: 12,
    pendingOrders: 8,
    monthlyRevenue: 245000,
    activeCustomers: 156
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
  }, [navigate]);

  const recentOrders = [
    { id: "ORD-001", customer: "John Doe", car: "Tesla Model S", status: "pending", amount: "$85,000" },
    { id: "ORD-002", customer: "Jane Smith", car: "BMW i4", status: "in_production", amount: "$65,000" },
    { id: "ORD-003", customer: "Mike Johnson", car: "Audi e-tron", status: "ready", amount: "$75,000" },
    { id: "ORD-004", customer: "Sarah Wilson", car: "Mercedes EQS", status: "delivered", amount: "$95,000" },
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {manufacturerName}!</h1>
            <p className="text-gray-600 mt-2">Here's what's happening with your business today.</p>
          </div>
          <Button 
            onClick={() => navigate("/manufacturer/cars/new")}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Car
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCars}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">+4 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCustomers}</div>
              <p className="text-xs text-muted-foreground">+8 from last month</p>
            </CardContent>
          </Card>
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
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate("/manufacturer/orders")}
              >
                View All Orders
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks to manage your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/manufacturer/cars/new")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Car Model
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/manufacturer/orders")}
              >
                <Package className="h-4 w-4 mr-2" />
                Process Pending Orders
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/manufacturer/analytics")}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics Report
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/manufacturer/cars")}
              >
                <Car className="h-4 w-4 mr-2" />
                Manage Car Inventory
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ManufacturerDashboard;
