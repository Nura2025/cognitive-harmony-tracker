
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AuthService from '@/services/auth';
import parseJwt from '@/utils/helpers/parseJwt';

// Define the type for user data
interface UserData {
  id: string;
  email: string;
  name?: string;
  user_role?: string;
  [key: string]: any; // Allow for other properties from the JWT
}

// Define the context shape
interface UserContextType {
  userData: UserData | null;
  refreshUserData: () => void;
}

// Create the context with default value
const UserContext = createContext<UserContextType>({
  userData: null,
  refreshUserData: () => {},
});

// Create a provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  
  // Use useCallback to ensure the function reference stays stable
  const refreshUserData = useCallback(() => {
    const token = localStorage.getItem('neurocog_token');
    if (!token) {
      setUserData(null);
      return;
    }
    
    const parsedToken = parseJwt(token);
    if (parsedToken) {
      // Ensure we have a consistent user ID from the JWT
      const userId = parsedToken.user_id || parsedToken.sub || parsedToken.id;
      
      setUserData({
        id: userId,
        email: parsedToken.email,
        name: parsedToken.name,
        user_role: parsedToken.user_role,
        ...parsedToken
      });
    } else {
      setUserData(null);
    }
  }, []);

  // Load user data on mount, but only once
  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  return (
    <UserContext.Provider value={{ userData, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook for using this context
export const useUser = () => useContext(UserContext);

export default UserContext;
