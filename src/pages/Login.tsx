
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
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
            <svg 
              className="w-10 h-10 text-primary" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 15C8.55 15 9 14.55 9 14C9 13.45 8.55 13 8 13C7.45 13 7 13.45 7 14C7 14.55 7.45 15 8 15Z"
                fill="currentColor"
              />
              <path
                d="M12 15C12.55 15 13 14.55 13 14C13 13.45 12.55 13 12 13C11.45 13 11 13.45 11 14C11 14.55 11.45 15 12 15Z"
                fill="currentColor"
              />
              <path
                d="M16 15C16.55 15 17 14.55 17 14C17 13.45 16.55 13 16 13C15.45 13 15 13.45 15 14C15 14.55 15.45 15 16 15Z"
                fill="currentColor"
              />
              <path
                d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM5 19V5H19V19H5Z"
                fill="currentColor"
              />
              <path
                d="M12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6C10 7.10457 10.8954 8 12 8Z"
                fill="currentColor"
              />
              <path 
                d="M8 10H16M8 18H16"
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-1">NeuroCog Clinic</h1>
          <p className="text-muted-foreground text-sm">Cognitive assessment platform</p>
        </div>
        
        <Card className="border-2 border-primary/20 shadow-lg overflow-hidden">
          <div className="absolute h-2 bg-gradient-to-r from-primary/60 via-primary to-primary/60 w-full top-0 left-0 rounded-t-lg"></div>
          <CardHeader className="space-y-1 text-center pt-8">
            <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-5">
              <div className="relative">
                <div className="absolute left-3 top-3 text-muted-foreground">
                  <Mail className="h-5 w-5" />
                </div>
                <Input
                  className="pl-10 h-12 text-base"
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
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  className="pl-10 pr-10 h-12 text-base"
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
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              <Button 
                className="w-full py-6 text-base font-medium" 
                type="submit" 
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
              
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-border"></div>
                <div className="px-4 text-xs text-muted-foreground">OR</div>
                <div className="flex-1 border-t border-border"></div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                type="button"
                disabled={loading}
                onClick={() => navigate('/register')}
              >
                Create an account
              </Button>
            </CardContent>
          </form>
          
          <CardFooter className="flex flex-col space-y-2 pt-0">
            <div className="text-center text-xs text-muted-foreground">
              Secure access to patient cognitive assessment data
            </div>
          </CardFooter>
        </Card>
        
        <div className="text-center mt-6 text-sm text-muted-foreground">
          © 2025 NeuroCog Clinic. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
