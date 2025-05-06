
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '@/utils/tokenExpiration';
import { useUser } from '@/contexts/UserContext';
import { toast } from "@/hooks/use-toast";

const SessionTimeoutHandler = () => {
  const navigate = useNavigate();
  const { refreshUserData } = useUser();
  
  useEffect(() => {
    const checkToken = () => {
      try {
        const token = localStorage.getItem('neurocog_token');
        
        if (!token || isTokenExpired(token)) {
          localStorage.removeItem('neurocog_token');
          toast({
            title: "Session expired",
            description: "Your session has expired. Please log in again.",
          });
          navigate('/login');
        } else {
          // Token is valid, refresh user data
          refreshUserData();
        }
      } catch (error) {
        console.error("Error checking token:", error);
      }
    };

    // Check token immediately
    checkToken();
    
    // Set up interval to check token periodically
    const intervalId = setInterval(checkToken, 60000); // Check every minute
    
    return () => {
      clearInterval(intervalId);
    };
  }, [navigate, refreshUserData]);
  
  return null; // This component doesn't render anything
};

export default SessionTimeoutHandler;
