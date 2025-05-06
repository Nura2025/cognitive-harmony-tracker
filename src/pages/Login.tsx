
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import AuthService from '@/services/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset any previous errors
    setError('');
    
    if (!email || !password) {
      setError("Please enter both email and password");
      toast.error("Please enter both email and password");
      return;
    }
    
    setLoading(true);
    
    try {
      const authResponse = await AuthService.login({ email, password });
      
      // Extract user/clinician ID
      const userId = authResponse.user_id || 
                   (authResponse.user && authResponse.user.id) || 
                   null;
      
      // Extract user type/role
      const userType = authResponse.user_type || 
                      (authResponse.user && authResponse.user.type) || 
                      null;
      
      if (userId) {
        console.log(`Logged in as ${userType} with ID:`, userId);
      } else {
        console.warn("No user ID found in the response");
      }
      
      toast.success("Login successful!");
      
      // Redirect based on user role
      if (AuthService.isClinicianUser()) {
        navigate('/dashboard');
      } else if (AuthService.isPatientUser()) {
        // This would need to be updated with the patient dashboard route
        // For now, we'll redirect to a placeholder route
        navigate('/dashboard');
      } else {
        // If role can't be determined, go to dashboard as a fallback
        navigate('/dashboard');
      }
    } catch (error: any) {
      // Extract error message from the error object
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Invalid email or password. Please try again.";
      
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A2342] to-[#121212] px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#5EF38C]/20 rounded-xl flex items-center justify-center mb-4">
            <svg 
              className="w-10 h-10 text-[#5EF38C]" 
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
          <h1 className="text-3xl font-bold mb-1 text-[#5EF38C] pixel-font">NURA Games</h1>
          <p className="text-gray-300 text-sm">Cognitive assessment platform</p>
        </div>
        
        <Card className="bg-gradient-to-br from-[#5EF38C]/20 to-[#0A2342] p-1 rounded-lg pixel-border overflow-hidden">
          <div className="bg-black p-6 rounded-lg h-full">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-semibold text-white">Sign In</CardTitle>
              <CardDescription className="text-gray-400">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-5">
                {error && (
                  <div className="p-3 text-sm bg-red-500/20 border border-red-500/30 text-red-400 rounded-md">
                    {error}
                  </div>
                )}
                
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-500">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    className="pl-10 h-12 text-base bg-[#222] border border-[#444] text-white focus:border-[#5EF38C]"
                    placeholder="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-500">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    className="pl-10 pr-10 h-12 text-base bg-[#222] border border-[#444] text-white focus:border-[#5EF38C]"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                <Button 
                  className="w-full py-6 text-base font-medium bg-[#5EF38C] text-[#0A2342] hover:bg-[#4DD77C]" 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
                
                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-[#444]"></div>
                  <div className="px-4 text-xs text-gray-400">OR</div>
                  <div className="flex-1 border-t border-[#444]"></div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full border border-[#5EF38C] text-[#5EF38C] hover:bg-[#5EF38C]/20 py-6" 
                  type="button"
                  disabled={loading}
                  onClick={() => navigate('/register')}
                >
                  Create an account
                </Button>
              </CardContent>
            </form>
            
            <CardFooter className="flex flex-col space-y-4 pt-0">
              <div className="text-center text-xs text-gray-400">
                Secure access to patient cognitive assessment data
              </div>
              
              <Button 
                variant="ghost" 
                className="mt-2 text-gray-400 hover:text-[#5EF38C] hover:bg-transparent" 
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Landing Page
              </Button>
            </CardFooter>
          </div>
        </Card>
        
        <div className="text-center mt-6 text-sm text-gray-400">
          © 2025 NURA Games. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
