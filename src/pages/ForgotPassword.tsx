
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
      
      toast({
        title: "Reset Link Sent",
        description: "Check your email for instructions to reset your password.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <Layout>
      <div className="container max-w-md mx-auto py-12">
        <Card className="backdrop-blur-sm bg-white/90 shadow-lg border-primary-200/50">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
            {!isSubmitted ? (
              <CardDescription>
                Enter your email address and we'll send you a link to reset your password
              </CardDescription>
            ) : (
              <CardDescription>
                We've sent you an email with instructions to reset your password
              </CardDescription>
            )}
          </CardHeader>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={email}
                      onChange={handleChange}
                      className="pl-10"
                    />
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600" 
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="flex items-center justify-center gap-2" 
                  onClick={handleBackToLogin}
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Login
                </Button>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-green-800">
                  We've sent a password reset link to <span className="font-semibold">{email}</span>
                </p>
                <p className="text-green-700 mt-2 text-sm">
                  Please check your inbox and spam folders
                </p>
              </div>
              <div className="text-center text-sm text-gray-600">
                <p>Didn't receive an email?</p>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary-500"
                  onClick={() => setIsSubmitted(false)}
                >
                  Try again
                </Button>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2" 
                onClick={handleBackToLogin}
              >
                <ArrowLeft className="h-4 w-4" /> Return to Login
              </Button>
            </CardContent>
          )}
          <CardFooter className="mt-0 pt-0 justify-center">
            <p className="text-center text-sm">
              Remember your password?{" "}
              <Link to="/login" className="text-primary-500 hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
