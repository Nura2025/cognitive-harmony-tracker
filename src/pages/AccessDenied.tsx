
import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield, AlertCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import AuthService from '@/services/auth';

const AccessDenied = () => {
  const navigate = useNavigate();
  const isClinician = AuthService.isClinicianUser();
  const isPatient = AuthService.isPatientUser();
  
  const goToDashboard = () => {
    if (isClinician) {
      navigate('/dashboard');
    } else if (isPatient) {
      // This would need to be updated with the patient dashboard route
      navigate('/patient-dashboard');
    } else {
      navigate('/');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0A2342] to-[#121212] px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-6 text-white">Access Denied</h1>
        
        <div className="bg-black/50 p-6 rounded-lg mb-6">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-5 w-5 mr-2 text-red-400" />
            <p className="text-red-400">You don't have permission to access this page</p>
          </div>
          
          <p className="text-gray-400 mb-6">
            Your user account doesn't have the required permissions to view this content.
            Please contact your administrator if you believe this is an error.
          </p>
          
          <Button 
            onClick={goToDashboard}
            className="w-full py-6 text-base font-medium bg-[#5EF38C] text-[#0A2342] hover:bg-[#4DD77C]"
          >
            Back to Dashboard
          </Button>
        </div>
        
        <p className="text-gray-500 text-sm">
          Need help? Contact support@neurocog.com
        </p>
      </div>
    </div>
  );
};

export default AccessDenied;
