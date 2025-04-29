
import axios from "axios";
import { API_BASE } from "../config";
import { generateMockSessions } from "./mockData";

/**
 * Get all sessions for a specific user
 */
export const getUserSessions = (userId: string) => {
  console.log(`Fetching sessions for user ${userId}`);
  
  // Use the actual API endpoint
  return axios.get(`${API_BASE}/sessions/${userId}`)
    .then(response => {
      console.log("API returned sessions:", response.data);
      return response;
    })
    .catch(error => {
      console.error("Error fetching user sessions from API:", error);
      // Only use mock data as fallback for development
      if (process.env.NODE_ENV === "development") {
        console.warn("Using fallback mock data due to API error");
        return Promise.resolve(generateMockSessions(userId));
      }
      throw error;
    });
};

/**
 * Get a specific session for a user
 */
export const getUserSession = (userId: string, sessionId: string) => {
  console.log(`Fetching specific session ${sessionId} for user ${userId}`);
  
  // Use the actual API endpoint
  return axios.get(`${API_BASE}/sessions/${userId}/${sessionId}`)
    .then(response => {
      console.log("API returned specific session:", response.data);
      return response;
    })
    .catch(error => {
      console.error(`Error fetching session ${sessionId} from API:`, error);
      // Only use mock data as fallback for development
      if (process.env.NODE_ENV === "development") {
        console.warn("Using fallback mock data due to API error");
        const sessions = generateMockSessions(userId, 1);
        sessions.data[0].session_id = sessionId;
        return Promise.resolve({ data: sessions.data[0] });
      }
      throw error;
    });
};
