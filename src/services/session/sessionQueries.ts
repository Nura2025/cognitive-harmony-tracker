
import axios from "axios";
import { API_BASE } from "../config";
import { generateMockSessions } from "./mockData";

/**
 * Get all sessions for a specific user
 */
export const getUserSessions = (userId: string) => {
  console.log(`Fetching sessions for user ${userId}`);
  
  // Check if we're in development or API_BASE is not configured
  if (process.env.NODE_ENV === "development" || !API_BASE) {
    console.log("Using mock session data (Development mode or API not configured)");
    return Promise.resolve(generateMockSessions(userId));
  }
  
  // Use the actual API endpoint
  return axios.get(`${API_BASE}/sessions/${userId}`)
    .then(response => {
      console.log("API returned sessions:", response.data);
      return response;
    })
    .catch(error => {
      console.error("Error fetching user sessions from API:", error);
      throw error;
    });
};

/**
 * Get a specific session for a user
 */
export const getUserSession = (userId: string, sessionId: string) => {
  console.log(`Fetching specific session ${sessionId} for user ${userId}`);
  
  // Check if we're in development or API_BASE is not configured
  if (process.env.NODE_ENV === "development" || !API_BASE) {
    console.log("Using mock session data for specific session (Development mode or API not configured)");
    const sessions = generateMockSessions(userId, 1);
    // Make sure the mock session has the specified ID
    sessions.data[0].session_id = sessionId;
    return Promise.resolve({ data: sessions.data[0] });
  }
  
  // Use the actual API endpoint
  return axios.get(`${API_BASE}/sessions/${userId}/${sessionId}`)
    .then(response => {
      console.log("API returned specific session:", response.data);
      return response;
    })
    .catch(error => {
      console.error(`Error fetching session ${sessionId} from API:`, error);
      throw error;
    });
};
