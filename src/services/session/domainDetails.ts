
import axios from "axios";
import { API_BASE } from "../config";
import { getMockDomainDetails } from "./mockDetails";

/**
 * Get domain-specific component details for a session
 */
export const getSessionDomainDetails = async (sessionId: string, domain: string) => {
  console.log(`Fetching ${domain} details for session ${sessionId}`);
  
  try {
    // For development/testing when API might not be available
    if (process.env.NODE_ENV === "development" || !API_BASE) {
      console.log(`Using mock data for ${domain} details (Development mode or API not configured)`);
      
      // Get mock data from the domain-specific mock generator
      const mockData = getMockDomainDetails(sessionId, domain);
      
      // Add a delay to simulate API response time
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockData), 500);
      });
    }
    
    // If we're not in development mode and API_BASE is configured, use the actual API endpoint
    console.log(`Calling API: ${API_BASE}/api/cognitive/component-details/${sessionId}?domain=${domain}`);
    const response = await axios.get(`${API_BASE}/api/cognitive/component-details/${sessionId}?domain=${domain}`);
    console.log(`API returned ${domain} details:`, response.data);
    return response.data;
    
  } catch (error) {
    console.error(`Error fetching ${domain} details from API:`, error);
    throw error;
  }
};
