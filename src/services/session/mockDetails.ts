
import { randomInt, randomFloat, randomChoice } from '../../utils/helpers/randomUtils';

/**
 * Generate mock domain details for a given session and domain
 */
export const getMockDomainDetails = (sessionId: string, domain: string) => {
  let mockData;
  
  switch(domain) {
    case 'memory':
      mockData = {
        session_id: sessionId,
        domain: "memory",
        overall_score: 75 + randomInt(-10, 10),
        percentile: randomInt(0, 100),
        classification: randomChoice(['Excellent', 'Good', 'Average', 'Below Average', 'Impaired']),
        components: {
          working_memory: {
            score: 80 + randomInt(-10, 10),
            components: {
              span_capacity: 70 + randomInt(0, 30),
              accuracy: 60 + randomInt(0, 40), 
              efficiency: 75 + randomInt(0, 25),
              processing_speed: 50 + randomInt(0, 50)
            }
          },
          visual_memory: {
            score: 70 + randomInt(-15, 15),
            components: {
              recognition_accuracy: 65 + randomInt(0, 35),
              recognition_efficiency: 60 + randomInt(0, 40),
              memory_load: 55 + randomInt(0, 45)
            }
          }
        },
        data_completeness: randomInt(60, 100), // 60-100%
        tasks_used: ['Memory Matrix', 'Sequence Recall', 'Dual N-Back', 'Pattern Memory']
          .sort(() => Math.random() - 0.5)
          .slice(0, randomInt(1, 4))
      };
      break;
      
    case 'attention':
      mockData = {
        session_id: sessionId,
        domain: "attention",
        overall_score: 65 + randomInt(-15, 15),
        percentile: randomInt(0, 100),
        classification: randomChoice(['Excellent', 'Good', 'Average', 'Below Average', 'Impaired']),
        components: {
          sustained_attention: 60 + randomInt(-20, 20),
          selective_attention: 70 + randomInt(-15, 15),
          divided_attention: 55 + randomInt(-20, 20),
          attention_switching: 65 + randomInt(-15, 15)
        },
        data_completeness: Math.random(),
        tasks_used: ['Continuous Performance', 'Visual Search', 'Divided Attention']
          .sort(() => Math.random() - 0.5)
          .slice(0, randomInt(1, 3))
      };
      break;
      
    case 'impulse_control':
      mockData = {
        session_id: sessionId,
        domain: "impulse_control",
        overall_score: 60 + randomInt(-15, 15),
        percentile: randomInt(0, 100),
        classification: randomChoice(['Excellent', 'Good', 'Average', 'Below Average', 'Impaired']),
        components: {
          inhibitory_control: 65 + randomInt(-15, 15),
          response_control: 55 + randomInt(-20, 20),
          decision_speed: 75 + randomInt(-10, 10),
          error_adaptation: 60 + randomInt(-15, 15)
        },
        data_completeness: Math.random(),
        games_used: ['Go/No-Go', 'Flanker Task', 'Stroop Test', 'Stop Signal']
          .sort(() => Math.random() - 0.5)
          .slice(0, randomInt(1, 4))
      };
      break;
      
    case 'executive_function':
      mockData = {
        session_id: sessionId,
        domain: "executive_function",
        overall_score: 70 + randomInt(-10, 10),
        percentile: randomInt(0, 100),
        classification: randomChoice(['Excellent', 'Good', 'Average', 'Below Average', 'Impaired']),
        components: {
          memory_contribution: 65 + randomInt(-15, 15),
          attention_contribution: 70 + randomInt(-10, 10),
          impulse_contribution: 60 + randomInt(-15, 15)
        },
        data_completeness: Math.random(),
        profile_pattern: randomChoice([
          "Balanced cognitive profile with good integration across domains",
          "Strong memory with moderate attention and impulse control",
          "Attention challenges impacting executive function",
          "Impulse control difficulties affecting overall cognitive functioning",
          "Executive function strengths with varying domain performance"
        ])
      };
      break;
      
    default:
      mockData = null;
  }
  
  return mockData;
};
