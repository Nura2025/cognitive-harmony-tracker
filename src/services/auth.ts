
import axios from "axios";
import { API_BASE } from "./config";
import { toast } from "sonner";
import SessionManager from "./session-manager";

interface AuthResponse {
  user?: any;
  token?: string;
  access_token?: string;
  token_type?: string;
  user_id?: string; // Added user_id field
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterPatientData {
  name: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  gender?: string;
  medicalHistory?: string;
}

interface RegisterClinicianData {
  name: string;
  email: string;
  password: string;
  specialty?: string;
  licenseNumber?: string;
  clinicName?: string;
}

// Login function
const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_BASE}/login`, data);
    
    // Store the token in localStorage
    // Handle both response formats: {token, user, user_id} or {access_token, token_type, user_id}
    if (response.data.access_token) {
      localStorage.setItem('neurocog_token', response.data.access_token);
      
      // Extract user ID from the response if available, otherwise use email as identifier
      const userId = response.data.user_id || response.data.id || `user_${Date.now()}`;
      localStorage.setItem('neurocog_user_id', userId);
      
      // Store user info including ID
      const userInfo = { 
        email: data.email,
        id: userId
      };
      localStorage.setItem('neurocog_user', JSON.stringify(userInfo));
      
      // Initialize session management
      SessionManager.resetTimer();
      
      return {
        token: response.data.access_token,
        user: userInfo,
        user_id: userId
      };
    } else if (response.data.token) {
      // Handle the original format if it's ever returned
      localStorage.setItem('neurocog_token', response.data.token);
      
      // Extract user ID and store it
      const userId = response.data.user_id || 
                     (response.data.user && response.data.user.id) || 
                     `user_${Date.now()}`;
      localStorage.setItem('neurocog_user_id', userId);
      
      // Ensure user object has the ID
      const userInfo = response.data.user || { email: data.email };
      if (!userInfo.id) userInfo.id = userId;
      
      localStorage.setItem('neurocog_user', JSON.stringify(userInfo));
      
      // Initialize session management
      SessionManager.resetTimer();
      
      return {
        ...response.data,
        user_id: userId
      };
    }
    
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error);
    throw error;
  }
};

// Register as patient function
const registerAsPatient = async (data: RegisterPatientData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_BASE}/register/patient`, data);
    
    // Store the token in localStorage
    if (response.data.token) {
      localStorage.setItem('neurocog_token', response.data.token);
      localStorage.setItem('neurocog_user', JSON.stringify(response.data.user));
      
      // Initialize session management
      SessionManager.resetTimer();
    }
    
    return response.data;
  } catch (error: any) {
    console.error("Patient registration error:", error);
    const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
    toast.error(errorMessage);
    throw error;
  }
};

// Register as clinician function
const registerAsClinician = async (data: RegisterClinicianData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_BASE}/register/clinician`, data);
    
    // Store the token in localStorage
    if (response.data.token) {
      localStorage.setItem('neurocog_token', response.data.token);
      localStorage.setItem('neurocog_user', JSON.stringify(response.data.user));
      
      // Initialize session management
      SessionManager.resetTimer();
    }
    
    return response.data;
  } catch (error: any) {
    console.error("Clinician registration error:", error);
    const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
    toast.error(errorMessage);
    throw error;
  }
};

// Logout function
const logout = () => {
  // Remove auth related items from localStorage
  localStorage.removeItem('neurocog_token');
  localStorage.removeItem('neurocog_user');
  localStorage.removeItem('neurocog_user_id');
  
  // Clear any session data or cookies if needed
  document.cookie.split(';').forEach(cookie => {
    document.cookie = cookie
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
  });
};

// Get current user function
const getCurrentUser = () => {
  const userJson = localStorage.getItem('neurocog_user');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (e) {
    console.error("Error parsing user data", e);
    return null;
  }
};

// Get current user ID
const getCurrentUserId = (): string | null => {
  return localStorage.getItem('neurocog_user_id');
};

// Check if user is authenticated
const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('neurocog_token');
};

// Auth Service object
const AuthService = {
  login,
  registerAsPatient,
  registerAsClinician,
  logout,
  getCurrentUser,
  getCurrentUserId,
  isAuthenticated,
};

export default AuthService;
