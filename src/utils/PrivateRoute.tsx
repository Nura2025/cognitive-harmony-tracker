
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '@/services/auth';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireClinician?: boolean;
  requirePatient?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  requireClinician = false, 
  requirePatient = false 
}) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const isClinician = AuthService.isClinicianUser();
  const isPatient = AuthService.isPatientUser();
  
  // Not authenticated at all
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Require clinician but user is not a clinician
  if (requireClinician && !isClinician) {
    // Redirect to appropriate view based on role or error page
    return isPatient 
      ? <Navigate to="/patient-dashboard" replace />
      : <Navigate to="/access-denied" replace />;
  }
  
  // Require patient but user is not a patient
  if (requirePatient && !isPatient) {
    // Redirect to appropriate view based on role or error page
    return isClinician 
      ? <Navigate to="/dashboard" replace />
      : <Navigate to="/access-denied" replace />;
  }
  
  return <>{children}</>;
};

export default PrivateRoute;
