
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import AuthService from '@/services/auth';

interface LoginFormProps {
  onRegisterClick: () => void;
}

const LoginForm = ({ onRegisterClick }: LoginFormProps) => {
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
    <form onSubmit={handleLogin}>
      <div className="space-y-5">
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
          onClick={onRegisterClick}
        >
          Create an account
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
