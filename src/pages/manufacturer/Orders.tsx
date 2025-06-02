
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Package, Search, Clock, CheckCircle, Truck, Eye } from "lucide-react";

const ManufacturerOrders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      customer: "John Doe",
      email: "john@example.com",
      car: "Tesla Model S",
      customizations: ["Red Paint", "Premium Interior"],
      amount: 85000,
      status: "pending",
      orderDate: "2024-01-15",
      deliveryDate: "2024-02-15",
      priority: "high"
    },
    {
      id: "ORD-002", 
      customer: "Jane Smith",
      email: "jane@example.com",
      car: "BMW i4",
      customizations: ["Blue Paint", "Sport Package"],
      amount: 65000,
      status: "in_production",
      orderDate: "2024-01-10",
      deliveryDate: "2024-02-10",
      priority: "medium"
    },
    {
      id: "ORD-003",
      customer: "Mike Johnson", 
      email: "mike@example.com",
      car: "Audi e-tron",
      customizations: ["Black Paint", "Premium Sound"],
      amount: 75000,
      status: "ready",
      orderDate: "2024-01-05",
      deliveryDate: "2024-02-05",
      priority: "medium"
    },
    {
      id: "ORD-004",
      customer: "Sarah Wilson",
      email: "sarah@example.com", 
      car: "Mercedes EQS",
      customizations: ["White Paint", "Luxury Package"],
      amount: 95000,
      status: "delivered",
      orderDate: "2024-01-01",
      deliveryDate: "2024-02-01",
      priority: "low"
    }
  ]);

  useEffect(() => {
    // Check if user is a manufacturer
    const userType = localStorage.getItem("userType");
    if (userType !== "manufacturer") {
      navigate("/");
      return;
    }
  }, [navigate]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.car.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "in_production": return <Package className="h-4 w-4" />;
      case "ready": return <CheckCircle className="h-4 w-4" />;
      case "delivered": return <Truck className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "in_production": return "bg-blue-100 text-blue-800";
      case "ready": return "bg-green-100 text-green-800";
      case "delivered": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-orange-100 text-orange-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    toast({
      title: "Order Updated",
      description: `Order ${orderId} status changed to ${newStatus.replace('_', ' ')}`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Order Management</h1>
            <p className="text-gray-600 mt-2">Track and manage all customer orders</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders by ID, customer, or car..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_production">In Production</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h3 className="font-bold text-lg">{order.id}</h3>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status.replace('_', ' ')}</span>
                    </Badge>
                    <Badge className={getPriorityColor(order.priority)}>
                      {order.priority} priority
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/manufacturer/orders/${order.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Customer Information</h4>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-sm text-gray-600">{order.email}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Order Details</h4>
                    <p className="text-sm text-gray-600">Car: {order.car}</p>
                    <p className="text-sm text-gray-600">Amount: ${order.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Order Date: {order.orderDate}</p>
                    <p className="text-sm text-gray-600">Expected Delivery: {order.deliveryDate}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Customizations</h4>
                    <div className="space-y-1">
                      {order.customizations.map((custom, index) => (
                        <Badge key={index} variant="secondary" className="mr-1 mb-1">
                          {custom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {order.status !== "delivered" && (
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    {order.status === "pending" && (
                      <Button 
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, "in_production")}
                      >
                        Start Production
                      </Button>
                    )}
                    {order.status === "in_production" && (
                      <Button 
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, "ready")}
                      >
                        Mark as Ready
                      </Button>
                    )}
                    {order.status === "ready" && (
                      <Button 
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, "delivered")}
                      >
                        Mark as Delivered
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all" 
                  ? "Try adjusting your search criteria" 
                  : "No orders have been placed yet"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ManufacturerOrders;
