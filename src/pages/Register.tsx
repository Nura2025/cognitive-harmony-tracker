
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
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
  
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all required fields");
      return false;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }
    
    if (!specialty || !licenseNumber) {
      toast.error("Please provide your specialty and license number");
      return false;
    }
    
    return true;
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      navigate('/');
    } catch (error) {
      // Error is handled in AuthService
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/40 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">NeuroCog Clinic</h1>
          <p className="text-muted-foreground">Cognitive assessment platform</p>
        </div>
        
        <Card className="border-2 border-primary/20 shadow-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Clinician Registration</CardTitle>
            <CardDescription>
              Register to access the cognitive assessment platform
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleRegistration}>
            <CardContent className="space-y-4">
              <div className="relative">
                <div className="absolute left-3 top-3 text-muted-foreground">
                  <User className="h-4 w-4" />
                </div>
                <Input
                  className="pl-10"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
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
              
              <div className="relative">
                <div className="absolute left-3 top-3 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  className="pl-10"
                  placeholder="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Medical Specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  required
                  disabled={loading}
                />
                <Input
                  placeholder="License Number"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  required
                  disabled={loading}
                />
                <Input
                  placeholder="Clinic Name (Optional)"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <Button 
                className="w-full font-medium" 
                type="submit" 
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Clinician Account"}
              </Button>
            </CardContent>
          </form>
          
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-primary font-medium hover:underline"
              >
                Sign In
              </Link>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              By registering, you agree to our Terms of Service and Privacy Policy.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
