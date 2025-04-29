import axios from "axios";
import { API_BASE } from "./config";
import { TrendData } from "./patient";
import { format, subDays } from "date-fns";

// We'll keep the mock data generator for development or when API is not available
const generateMockSessions = (userId: string, count: number = 10): { data: TrendData[] } => {
  const sessions: TrendData[] = [];
  
  for (let i = 0; i < count; i++) {
    const date = format(subDays(new Date(), i * 5), "yyyy-MM-dd'T'HH:mm:ss");
    const baseScore = 50 + Math.floor(Math.random() * 40); // Random score between 50-90
    const sessionId = `session-${userId}-${i}`; // Generate a session ID
    
    const session: TrendData = {
      id: sessionId, 
      session_id: sessionId, // Using the same ID for both properties for consistency
      session_date: date,
      memory_score: baseScore + Math.floor(Math.random() * 20 - 10),
      attention_score: baseScore + Math.floor(Math.random() * 20 - 10),
      impulse_score: baseScore + Math.floor(Math.random() * 20 - 10),
      executive_score: baseScore + Math.floor(Math.random() * 20 - 10),
      memory_details: {
        overall_score: baseScore + Math.floor(Math.random() * 15 - 5),
        percentile: Math.floor(Math.random() * 100),
        classification: ['Excellent', 'Good', 'Average', 'Below Average', 'Impaired'][Math.floor(Math.random() * 5)],
        components: {
          working_memory: {
            score: baseScore + Math.floor(Math.random() * 10),
            components: {
              recall_span: Math.floor(Math.random() * 10) + 1,
              sequential_memory: Math.floor(Math.random() * 100),
              dual_processing: Math.floor(Math.random() * 100),
              visual_working_memory: Math.floor(Math.random() * 100)
            }
          },
          visual_memory: {
            score: baseScore + Math.floor(Math.random() * 10),
            components: {
              pattern_recognition: Math.floor(Math.random() * 100),
              spatial_recall: Math.floor(Math.random() * 100),
              object_memory: Math.floor(Math.random() * 100),
              delayed_recall: Math.floor(Math.random() * 100)
            }
          }
        },
        data_completeness: Math.floor(Math.random() * 40) + 60, // 60-100%
        tasks_used: ['Memory Matrix', 'Sequence Recall', 'Dual N-Back', 'Pattern Memory'].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 4) + 1)
      },
      attention_details: {
        overall_score: baseScore + Math.floor(Math.random() * 15 - 5),
        percentile: Math.floor(Math.random() * 100),
        classification: ['Excellent', 'Good', 'Average', 'Below Average', 'Impaired'][Math.floor(Math.random() * 5)],
        components: {
          crop_score: baseScore + Math.floor(Math.random() * 20 - 10),
          sequence_score: baseScore + Math.floor(Math.random() * 20 - 10)
        },
        data_completeness: Math.random(), // 0-1 value
        tasks_used: ['Continuous Performance', 'Visual Search', 'Divided Attention'].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1)
      },
      impulse_details: {
        overall_score: baseScore + Math.floor(Math.random() * 15 - 5),
        percentile: Math.floor(Math.random() * 100),
        classification: ['Excellent', 'Good', 'Average', 'Below Average', 'Impaired'][Math.floor(Math.random() * 5)],
        components: {
          inhibitory_control: baseScore + Math.floor(Math.random() * 20 - 10),
          response_control: baseScore + Math.floor(Math.random() * 20 - 10),
          decision_speed: baseScore + Math.floor(Math.random() * 20 - 10),
          error_adaptation: baseScore + Math.floor(Math.random() * 20 - 10)
        },
        data_completeness: Math.random(), // 0-1 value
        games_used: ['Go/No-Go', 'Flanker Task', 'Stroop Test', 'Stop Signal'].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 4) + 1)
      },
      executive_details: {
        overall_score: baseScore + Math.floor(Math.random() * 15 - 5),
        percentile: Math.floor(Math.random() * 100),
        classification: ['Excellent', 'Good', 'Average', 'Below Average', 'Impaired'][Math.floor(Math.random() * 5)],
        components: {
          memory_contribution: baseScore + Math.floor(Math.random() * 20 - 10),
          attention_contribution: baseScore + Math.floor(Math.random() * 20 - 10),
          impulse_contribution: baseScore + Math.floor(Math.random() * 20 - 10)
        },
        data_completeness: Math.random(), // 0-1 value
        profile_pattern: [
          "Balanced cognitive profile with good integration across domains",
          "Strong memory with moderate attention and impulse control",
          "Attention challenges impacting executive function",
          "Impulse control difficulties affecting overall cognitive functioning",
          "Executive function strengths with varying domain performance"
        ][Math.floor(Math.random() * 5)]
      }
    };
    
    sessions.push(session);
  }
  
  return { data: sessions };
};

const addSession = (data: any) => {
  return axios.post(`${API_BASE}/session`, data);
};

const getUserSessions = (userId: string) => {
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

const getUserSession = (userId: string, sessionId: string) => {
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

// Function to get domain-specific component details
const getSessionDomainDetails = async (sessionId: string, domain: string) => {
  console.log(`Fetching ${domain} details for session ${sessionId}`);
  
  try {
    // For development/testing when API might not be available
    if (process.env.NODE_ENV === "development" || !API_BASE) {
      console.log(`Using mock data for ${domain} details (Development mode or API not configured)`);
      
      // Generate mock data (we'll keep this part for development)
      let mockData;
      
      switch(domain) {
        case 'memory':
          mockData = {
            session_id: sessionId,
            domain: "memory",
            overall_score: 75 + Math.floor(Math.random() * 20 - 10),
            percentile: Math.floor(Math.random() * 100),
            classification: ['Excellent', 'Good', 'Average', 'Below Average', 'Impaired'][Math.floor(Math.random() * 5)],
            components: {
              working_memory: {
                score: 80 + Math.floor(Math.random() * 20 - 10),
                components: {
                  span_capacity: 70 + Math.floor(Math.random() * 30),
                  accuracy: 60 + Math.floor(Math.random() * 40), 
                  efficiency: 75 + Math.floor(Math.random() * 25),
                  processing_speed: 50 + Math.floor(Math.random() * 50)
                }
              },
              visual_memory: {
                score: 70 + Math.floor(Math.random() * 30 - 15),
                components: {
                  recognition_accuracy: 65 + Math.floor(Math.random() * 35),
                  recognition_efficiency: 60 + Math.floor(Math.random() * 40),
                  memory_load: 55 + Math.floor(Math.random() * 45)
                }
              }
            },
            data_completeness: Math.floor(Math.random() * 40) + 60, // 60-100%
            tasks_used: ['Memory Matrix', 'Sequence Recall', 'Dual N-Back', 'Pattern Memory']
              .sort(() => Math.random() - 0.5)
              .slice(0, Math.floor(Math.random() * 4) + 1)
          };
          break;
          
        case 'attention':
          mockData = {
            session_id: sessionId,
            domain: "attention",
            overall_score: 65 + Math.floor(Math.random() * 30 - 15),
            percentile: Math.floor(Math.random() * 100),
            classification: ['Excellent', 'Good', 'Average', 'Below Average', 'Impaired'][Math.floor(Math.random() * 5)],
            components: {
              sustained_attention: 60 + Math.floor(Math.random() * 40 - 20),
              selective_attention: 70 + Math.floor(Math.random() * 30 - 15),
              divided_attention: 55 + Math.floor(Math.random() * 45 - 20),
              attention_switching: 65 + Math.floor(Math.random() * 35 - 15)
            },
            data_completeness: Math.random(),
            tasks_used: ['Continuous Performance', 'Visual Search', 'Divided Attention']
              .sort(() => Math.random() - 0.5)
              .slice(0, Math.floor(Math.random() * 3) + 1)
          };
          break;
          
        case 'impulse_control':
          mockData = {
            session_id: sessionId,
            domain: "impulse_control",
            overall_score: 60 + Math.floor(Math.random() * 35 - 15),
            percentile: Math.floor(Math.random() * 100),
            classification: ['Excellent', 'Good', 'Average', 'Below Average', 'Impaired'][Math.floor(Math.random() * 5)],
            components: {
              inhibitory_control: 65 + Math.floor(Math.random() * 35 - 15),
              response_control: 55 + Math.floor(Math.random() * 45 - 20),
              decision_speed: 75 + Math.floor(Math.random() * 25 - 10),
              error_adaptation: 60 + Math.floor(Math.random() * 40 - 15)
            },
            data_completeness: Math.random(),
            games_used: ['Go/No-Go', 'Flanker Task', 'Stroop Test', 'Stop Signal']
              .sort(() => Math.random() - 0.5)
              .slice(0, Math.floor(Math.random() * 4) + 1)
          };
          break;
          
        case 'executive_function':
          mockData = {
            session_id: sessionId,
            domain: "executive_function",
            overall_score: 70 + Math.floor(Math.random() * 25 - 10),
            percentile: Math.floor(Math.random() * 100),
            classification: ['Excellent', 'Good', 'Average', 'Below Average', 'Impaired'][Math.floor(Math.random() * 5)],
            components: {
              memory_contribution: 65 + Math.floor(Math.random() * 35 - 15),
              attention_contribution: 70 + Math.floor(Math.random() * 30 - 10),
              impulse_contribution: 60 + Math.floor(Math.random() * 40 - 15)
            },
            data_completeness: Math.random(),
            profile_pattern: [
              "Balanced cognitive profile with good integration across domains",
              "Strong memory with moderate attention and impulse control",
              "Attention challenges impacting executive function",
              "Impulse control difficulties affecting overall cognitive functioning",
              "Executive function strengths with varying domain performance"
            ][Math.floor(Math.random() * 5)]
          };
          break;
          
        default:
          mockData = null;
      }
      
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

const SessionService = {
  addSession,
  getUserSessions,
  getUserSession,
  getSessionDomainDetails,
};

export default SessionService;
