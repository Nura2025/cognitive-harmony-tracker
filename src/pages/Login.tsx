
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import AuthService from '@/services/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setLoading(true);
    
    try {
      await AuthService.login({ email, password });
      toast.success("Login successful!");
      navigate('/');
    } catch (error) {
      // Error is handled in AuthService
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/40 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">NeuroCog Clinic</h1>
          <p className="text-muted-foreground">Cognitive assessment platform</p>
        </div>
        
        <Card className="border-2 border-primary/20 shadow-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="relative">
                <div className="absolute left-3 top-3 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  className="pl-10"
                  placeholder="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="relative">
                <div className="absolute left-3 top-3 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  className="pl-10 pr-10"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              <Button 
                className="w-full font-medium" 
                type="submit" 
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </CardContent>
          </form>
          
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="text-primary font-medium hover:underline"
              >
                Register
              </Link>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              Secure access to patient cognitive assessment data
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
