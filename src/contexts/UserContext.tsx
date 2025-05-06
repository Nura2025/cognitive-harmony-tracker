
import { useNavigate } from "react-router-dom";
import parseJwt from "@/utils/helpers/parseJwt";
import React, { createContext, useCallback, useContext, useState } from "react";
import { isTokenExpired } from "@/utils/tokenExpiration";

// Define the type for user data
interface UserData {
  id: string;
  email: string;
  name?: string;
  user_role?: string;
  exp?: number;
  [key: string]: any;
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
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  // Use useCallback to ensure the function reference stays stable
  const refreshUserData = useCallback(() => {
    try {
      const token = localStorage.getItem("neurocog_token");
      if (!token) {
        setUserData(null);
        return;
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        localStorage.removeItem("neurocog_token");
        setUserData(null);
        return;
      }

      const parsedToken = parseJwt(token);
      if (parsedToken) {
        const userId = parsedToken.user_id || parsedToken.sub || parsedToken.id;

        setUserData({
          id: userId,
          email: parsedToken.email || '',
          name: parsedToken.name,
          user_role: parsedToken.user_role,
          exp: parsedToken.exp,
          ...parsedToken,
        });
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
      // Don't set userData to null on error to prevent potential logout loops
    }
  }, []);

  return (
    <UserContext.Provider value={{ userData, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook for using this context
export const useUser = () => useContext(UserContext);

export default UserContext;
