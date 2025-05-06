import { useNavigate } from "react-router-dom";

import parseJwt from "@/utils/helpers/parseJwt";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Define the type for user data
interface UserData {
  id: string;
  email: string;
  name?: string;
  user_role?: string;
  exp?: number; // <-- add this
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
    const token = localStorage.getItem("neurocog_token");
    if (!token) {
      setUserData(null);
      return;
    }

    const parsedToken = parseJwt(token);
    if (parsedToken) {
      const userId = parsedToken.user_id || parsedToken.sub || parsedToken.id;

      setUserData({
        id: userId,
        email: parsedToken.email,
        name: parsedToken.name,
        user_role: parsedToken.user_role,
        exp: parsedToken.exp, // <-- store it
        ...parsedToken,
      });

      // Optional: log remaining time in seconds
      const expiresIn = parsedToken.exp * 1000 - Date.now();
      console.log(`Token expires in ${Math.floor(expiresIn / 1000)} seconds`);
    }
  }, []);

  // Load user data on mount, but only once
  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  useEffect(() => {
    if (!userData?.exp) return;

    const timeUntilExpiry = userData.exp * 1000 - Date.now();

    if (timeUntilExpiry <= 0) {
      setUserData(null);
      localStorage.removeItem("neurocog_token");
      navigate("/login"); // or wherever you want
      return;
    }

    const timeout = setTimeout(() => {
      setUserData(null);
      localStorage.removeItem("neurocog_token");
      alert("Your session has expired.");
      navigate("/login"); // or /dashboard or /
    }, timeUntilExpiry);

    return () => clearTimeout(timeout);
  }, [userData?.exp, navigate]);

  return (
    <UserContext.Provider value={{ userData, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook for using this context
export const useUser = () => useContext(UserContext);

export default UserContext;
