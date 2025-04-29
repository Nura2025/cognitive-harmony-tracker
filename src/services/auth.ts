
import axios from "axios";
import { API_BASE } from "./config";
import { toast } from "sonner";

interface AuthResponse {
  user?: any;
  token?: string;
  access_token?: string;
  token_type?: string;
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
    // Handle both response formats: {token, user} or {access_token, token_type}
    if (response.data.access_token) {
      localStorage.setItem('neurocog_token', response.data.access_token);
      
      // Since user data is not returned by the API, we'll store minimal user info
      const userEmail = data.email;
      const userInfo = { email: userEmail };
      localStorage.setItem('neurocog_user', JSON.stringify(userInfo));
      
      return {
        token: response.data.access_token,
        user: userInfo
      };
    } else if (response.data.token) {
      // Handle the original format if it's ever returned
      localStorage.setItem('neurocog_token', response.data.token);
      localStorage.setItem('neurocog_user', JSON.stringify(response.data.user));
      return response.data;
    }
    
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error);
    const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
    toast.error(errorMessage);
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
  localStorage.removeItem('neurocog_token');
  localStorage.removeItem('neurocog_user');
  window.location.href = '/login';
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
  isAuthenticated,
};

export default AuthService;
