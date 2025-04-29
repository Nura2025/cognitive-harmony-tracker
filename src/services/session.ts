
import axios from "axios";
import { API_BASE } from "./config";
import { TrendData } from "./patient";
import { format, subDays } from "date-fns";

// Mock data for sessions
const generateMockSessions = (userId: string, count: number = 10): { data: TrendData[] } => {
  const sessions: TrendData[] = [];
  
  for (let i = 0; i < count; i++) {
    const date = format(subDays(new Date(), i * 5), "yyyy-MM-dd'T'HH:mm:ss");
    const baseScore = 50 + Math.floor(Math.random() * 40); // Random score between 50-90
    
    const session: TrendData = {
      id: `session-${userId}-${i}`, // Add unique ID for each session
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

const addSession = (data) => {
  return axios.post(API_BASE + "/session", data);
};

const getUserSessions = (user_id) => {
  // Mock sessions data
  if (process.env.NODE_ENV === "development" || !API_BASE) {
    console.log("Using mock session data");
    return Promise.resolve(generateMockSessions(user_id));
  }
  return axios.get(API_BASE + `/sessions/${user_id}`);
};

const getUserSession = (user_id, session_id) => {
  // Mock session data
  if (process.env.NODE_ENV === "development" || !API_BASE) {
    console.log("Using mock session data for specific session");
    const sessions = generateMockSessions(user_id, 1);
    return Promise.resolve({ data: sessions.data[0] });
  }
  return axios.get(API_BASE + `/sessions/${user_id}/${session_id}`);
};

// Function to get domain-specific component details
const getSessionDomainDetails = async (sessionId: string, domain: string) => {
  try {
    // For development/testing when API might not be available
    if (process.env.NODE_ENV === "development" || !API_BASE) {
      console.log(`Using mock data for ${domain} details for session ${sessionId}`);
      
      // Generate appropriate mock data based on domain
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
            data_completeness: Math.random(),
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
      
      // Return the mock data after a short delay to simulate API call
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockData), 300);
      });
    }
    
    console.log(`Fetching ${domain} details for session ${sessionId}`);
    const response = await axios.get(`${API_BASE}/api/cognitive/component-details/${sessionId}?domain=${domain}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${domain} details for session ${sessionId}:`, error);
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
