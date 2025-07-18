import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, Chrome, Github, Building2, Info, Copy, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { authService } from "@/services/auth";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showManufacturerCredentials, setShowManufacturerCredentials] = useState(false);
  const [copiedCredential, setCopiedCredential] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  useEffect(() => {
    // Initialize auth service
    authService.init();
    
    // Check if user is already logged in
    if (authService.isAuthenticated()) {
      const userProfile = authService.getCurrentUserProfile();
      if (userProfile?.userType === 'manufacturer') {
        navigate("/manufacturer/dashboard");
      } else {
        navigate("/catalog");
      }
    }
  }, [navigate]);

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

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCredential(type);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
    setTimeout(() => setCopiedCredential(null), 2000);
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    
    try {
      const userProfile = await authService.signInWithGoogle();
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userProfile.displayName}!`,
      });
      
      if (userProfile.userType === 'manufacturer') {
        navigate("/manufacturer/dashboard");
      } else {
        navigate("/catalog");
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      toast({
        variant: "destructive",
        title: "Google Login Error",
        description: error.message || "Failed to login with Google. Please try again.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsGithubLoading(true);
    
    try {
      const userProfile = await authService.signInWithGithub();
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userProfile.displayName}!`,
      });
      
      if (userProfile.userType === 'manufacturer') {
        navigate("/manufacturer/dashboard");
      } else {
        navigate("/catalog");
      }
    } catch (error: any) {
      console.error('GitHub login error:', error);
      toast({
        variant: "destructive",
        title: "GitHub Login Error",
        description: error.message || "Failed to login with GitHub. Please try again.",
      });
    } finally {
      setIsGithubLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userProfile = await authService.signInWithEmail(formData.email, formData.password);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userProfile.displayName}!`,
      });
      
      if (userProfile.userType === 'manufacturer') {
        navigate("/manufacturer/dashboard");
      } else {
        navigate("/catalog");
      }
    } catch (error: any) {
      console.error('Email login error:', error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const manufacturerCredentials = authService.getManufacturerCredentials();

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Welcome to Carvix
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sign in to your account to continue
            </p>
          </div>

          {/* Manufacturer Credentials Section */}
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
                Manufacturer Access
              </CardTitle>
              <CardDescription>
                Use these credentials to access the manufacturer portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Collapsible open={showManufacturerCredentials} onOpenChange={setShowManufacturerCredentials}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Info className="h-4 w-4 mr-2" />
                    {showManufacturerCredentials ? "Hide" : "Show"} Manufacturer Credentials
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <p className="font-medium mb-2">Available Manufacturer Accounts:</p>
                    <p className="text-xs">Click to copy credentials</p>
                  </div>
                  {manufacturerCredentials.map((credential, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {credential.name}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(credential.email, "Email")}
                            className="h-6 w-6 p-0"
                          >
                            {copiedCredential === "Email" ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(credential.password, "Password")}
                            className="h-6 w-6 p-0"
                          >
                            {copiedCredential === "Password" ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs space-y-1">
                        <p className="font-medium">Email: {credential.email}</p>
                        <p className="font-medium">Password: {credential.password}</p>
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          {/* Login Form */}
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="rememberMe" className="text-sm">
                    Remember me
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                    className="w-full"
                  >
                    {isGoogleLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                    ) : (
                      <Chrome className="h-4 w-4 mr-2" />
                    )}
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGithubLogin}
                    disabled={isGithubLoading}
                    className="w-full"
                  >
                    {isGithubLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                    ) : (
                      <Github className="h-4 w-4 mr-2" />
                    )}
                    GitHub
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="text-center text-sm">
                <Link
                  to="/forgot-password"
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
