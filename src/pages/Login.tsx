
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, rememberMe: checked });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    
    try {
      // Simulate Google OAuth process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if manufacturer credentials
      const isManufacturer = Math.random() > 0.7; // 30% chance for demo
      
      if (isManufacturer) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userType", "manufacturer");
        localStorage.setItem("manufacturerName", "Example Motors");
        
        toast({
          title: "Manufacturer Login Successful",
          description: "Welcome to the manufacturer portal!",
        });
        navigate("/manufacturer/dashboard");
      } else {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userType", "customer");
        
        // Initialize empty arrays for saved cars and cart
        if (!localStorage.getItem("savedCars")) {
          localStorage.setItem("savedCars", JSON.stringify([]));
        }
        if (!localStorage.getItem("cartItems")) {
          localStorage.setItem("cartItems", JSON.stringify([]));
        }
        
        // Dispatch event to notify navbar
        window.dispatchEvent(new Event("loginStatusChanged"));
        
        toast({
          title: "Login Successful",
          description: "Welcome back to Carvix!",
        });
        navigate("/catalog");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Google Login Error",
        description: "Failed to login with Google. Please try again.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check for manufacturer credentials
      const isManufacturerLogin = formData.email.includes("manufacturer") || formData.email.includes("admin");
      
      if (formData.email && formData.password.length >= 6) {
        localStorage.setItem("isLoggedIn", "true");
        
        if (isManufacturerLogin) {
          localStorage.setItem("userType", "manufacturer");
          localStorage.setItem("manufacturerName", "Example Motors");
          
          toast({
            title: "Manufacturer Login Successful",
            description: "Welcome to the manufacturer portal!",
          });
          navigate("/manufacturer/dashboard");
        } else {
          localStorage.setItem("userType", "customer");
          
          // Initialize empty arrays for saved cars and cart
          if (!localStorage.getItem("savedCars")) {
            localStorage.setItem("savedCars", JSON.stringify([]));
          }
          if (!localStorage.getItem("cartItems")) {
            localStorage.setItem("cartItems", JSON.stringify([]));
          }
          
          // Dispatch event to notify navbar
          window.dispatchEvent(new Event("loginStatusChanged"));
          
          toast({
            title: "Login Successful",
            description: "Welcome back to Carvix!",
          });
          navigate("/catalog");
        }
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-md mx-auto py-12">
        <Card className="backdrop-blur-sm bg-white/90 shadow-lg border-primary-200/50">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                "Signing in with Google..."
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-primary-500 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                  />
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1.5 h-7 w-7 p-0"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember-me" 
                  checked={formData.rememberMe} 
                  onCheckedChange={handleCheckboxChange} 
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600" 
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm w-full">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary-500 hover:underline">
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
