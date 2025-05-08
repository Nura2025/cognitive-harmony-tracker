import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail, User, Building, Stethoscope, CreditCard, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import AuthService from '@/services/auth';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields");
      toast.error("Please fill in all required fields");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return false;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      toast.error("Password must be at least 8 characters long");
      return false;
    }
    
    if (!specialty || !licenseNumber) {
      setError("Please provide your specialty and license number");
      toast.error("Please provide your specialty and license number");
      return false;
    }
    
    return true;
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await AuthService.registerAsClinician({
        name,
        email,
        password,
        specialty,
        licenseNumber,
        clinicName
      });
      
      toast.success("Registration successful!");
      navigate('/dashboard');
    } catch (error: any) {
      // Extract error message
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Registration failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A2342] to-[#121212] px-4 py-8">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center">
          <img
            src="/lovable-uploads/41067270-5c65-44fb-8d3b-89fc90445214.png"
            alt="NURA Logo"
            className="h-12 w-auto"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button
              variant="outline"
              className="border-[#5EF38C] text-[#5EF38C] hover:bg-[#5EF38C]/20"
            >
              Sign In
            </Button>
          </Link>
          <Link to="/">
            <Button className="bg-[#5EF38C] text-[#0A2342] hover:bg-[#4DD77C]">
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      <div className="w-full max-w-md mt-20">
        <div className="flex flex-col items-center mb-6">
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
          <h1 className="text-3xl font-bold mb-1 text-[#5EF38C] pixel-font">Nura</h1>
          <p className="text-gray-300 text-sm">Cognitive assessment platform</p>
        </div>
        
        <div className="bg-gradient-to-br from-[#5EF38C]/20 to-[#0A2342] p-1 rounded-lg pixel-border overflow-hidden">
          <div className="bg-black p-8 rounded-lg h-full">
            <div className="space-y-1 text-center mb-6">
              <h2 className="text-2xl font-semibold text-white">Clinician Registration</h2>
              <p className="text-gray-400">
                Register to access the cognitive assessment platform
              </p>
            </div>
            
            <form onSubmit={handleRegistration} className="space-y-5">
              {error && (
                <div className="p-3 text-sm bg-red-500/20 border border-red-500/30 text-red-400 rounded-md">
                  {error}
                </div>
              )}
            
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-500">
                  <User className="h-4 w-4" />
                </div>
                <Input
                  className="pl-10 bg-[#222] border border-[#444] text-white focus:border-[#5EF38C]"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-500">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  className="pl-10 bg-[#222] border border-[#444] text-white focus:border-[#5EF38C]"
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
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  className="pl-10 pr-10 bg-[#222] border border-[#444] text-white focus:border-[#5EF38C]"
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
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-500">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  className="pl-10 bg-[#222] border border-[#444] text-white focus:border-[#5EF38C]"
                  placeholder="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-500">
                  <Stethoscope className="h-4 w-4" />
                </div>
                <Input
                  className="pl-10 bg-[#222] border border-[#444] text-white focus:border-[#5EF38C]"
                  placeholder="Medical Specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-500">
                  <CreditCard className="h-4 w-4" />
                </div>
                <Input
                  className="pl-10 bg-[#222] border border-[#444] text-white focus:border-[#5EF38C]"
                  placeholder="License Number"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-500">
                  <Building className="h-4 w-4" />
                </div>
                <Input
                  className="pl-10 bg-[#222] border border-[#444] text-white focus:border-[#5EF38C]"
                  placeholder="Clinic Name (Optional)"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <Button 
                className="w-full font-medium mt-4 bg-[#5EF38C] text-[#0A2342] hover:bg-[#4DD77C] py-6" 
                type="submit" 
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Clinician Account"}
              </Button>
              
              <div className="text-center text-sm pt-2">
                <span className="text-gray-400">Already have an account?</span>{" "}
                <Link 
                  to="/login" 
                  className="text-[#5EF38C] font-medium hover:underline"
                >
                  Sign In
                </Link>
              </div>
              <div className="text-center text-xs text-gray-500">
                By registering, you agree to our Terms of Service and Privacy Policy.
              </div>
              
              <div className="pt-2 flex justify-center">
                <Button 
                  variant="ghost" 
                  className="text-gray-400 hover:text-[#5EF38C] hover:bg-transparent" 
                  onClick={() => navigate('/')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Landing Page
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="text-center mt-6 text-sm text-gray-400">
          © 2025 Nura. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Register;
