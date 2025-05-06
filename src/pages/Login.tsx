
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AppLogo from '@/components/auth/AppLogo';
import AuthCard from '@/components/auth/AuthCard';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A2342] to-[#121212] px-4">
      <div className="w-full max-w-md">
        <AppLogo className="mb-8" />
        
        <AuthCard>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold text-white">Sign In</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <LoginForm onRegisterClick={handleRegisterClick} />
          </CardContent>
          
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
        </AuthCard>
        
        <div className="text-center mt-6 text-sm text-gray-400">
          © 2025 NURA Games. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
