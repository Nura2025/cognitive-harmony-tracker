import parseJwt from "@/utils/helpers/parseJwt";
import axios from "axios";
import { toast } from "sonner";
import { API_BASE } from "./config";
import SessionManager from "./session-manager";

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

    const token = response.data.access_token;
    if (token) {
      const decoded = parseJwt(token);
      // ✅ Check if role exists and is 'doctor'
      if (!decoded?.user_role || decoded.user_role !== "doctor") {
        throw new Error("Access denied. Only doctors can log in.");
      }

      localStorage.setItem("neurocog_token", token);

      const userEmail = decoded.email || data.email;
      const userInfo = { email: userEmail };
      localStorage.setItem("neurocog_user", JSON.stringify(userInfo));

      SessionManager.resetTimer();

      return {
        token,
        user: userInfo,
      };
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Register as patient function
const registerAsPatient = async (
  data: RegisterPatientData
): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_BASE}/register/patient`, data);

    // Store the token in localStorage
    if (response.data.token) {
      localStorage.setItem("neurocog_token", response.data.token);
      localStorage.setItem("neurocog_user", JSON.stringify(response.data.user));

      // Initialize session management
      SessionManager.resetTimer();
    }

    return response.data;
  } catch (error: any) {
    console.error("Patient registration error:", error);
    const errorMessage =
      error.response?.data?.message || "Registration failed. Please try again.";
    toast.error(errorMessage);
    throw error;
  }
};

// Register as clinician function
const registerAsClinician = async (
  data: RegisterClinicianData
): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_BASE}/register/clinician`, data);

    // Store the token in localStorage
    if (response.data.token) {
      localStorage.setItem("neurocog_token", response.data.token);
      localStorage.setItem("neurocog_user", JSON.stringify(response.data.user));

      // Initialize session management
      SessionManager.resetTimer();
    }

    return response.data;
  } catch (error: any) {
    console.error("Clinician registration error:", error);
    const errorMessage =
      error.response?.data?.message || "Registration failed. Please try again.";
    toast.error(errorMessage);
    throw error;
  }
};

// Logout function
const logout = () => {
  // Remove auth related items from localStorage
  localStorage.removeItem("neurocog_token");
  localStorage.removeItem("neurocog_user");

  // Clear any session data or cookies if needed
  document.cookie.split(";").forEach((cookie) => {
    document.cookie = cookie
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
};

// Get current user function
const getCurrentUser = () => {
  const userJson = localStorage.getItem("neurocog_user");
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
  return !!localStorage.getItem("neurocog_token");
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
