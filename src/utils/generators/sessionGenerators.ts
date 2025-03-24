
import { Session, Activity } from '@/types/databaseTypes';
import { SessionData } from '@/utils/types/patientTypes';
import { faker } from '@faker-js/faker';
import { randomDomainScore, randomDate } from '../helpers/randomUtils';

/**
 * Generate a random session with activities
 */
export function generateSession(patientId: string): Session {
  const startTime = randomDate(new Date(2023, 0, 1), new Date());
  const durationMinutes = Math.floor(15 + Math.random() * 45); // 15-60 minutes
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + durationMinutes);
  
  const attention = randomDomainScore();
  const memory = randomDomainScore();
  const executive_function = randomDomainScore();
  const behavioral = randomDomainScore();
  
  // Average of all domain scores for the overall score
  const overall_score = Math.round((attention + memory + executive_function + behavioral) / 4);
  
  return {
    id: faker.string.uuid(),
    patient_id: patientId,
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    duration: durationMinutes,
    environment: faker.helpers.arrayElement(['Home', 'School', 'Clinic']) as 'Home' | 'School' | 'Clinic',
    completion_status: faker.helpers.arrayElement(['Completed', 'Abandoned', 'Interrupted']) as 'Completed' | 'Abandoned' | 'Interrupted',
    overall_score,
    device: faker.helpers.arrayElement(['Tablet', 'Desktop', 'Mobile']),
    attention,
    memory,
    executive_function,
    behavioral,
    created_at: new Date().toISOString(),
    activities: Array(Math.floor(3 + Math.random() * 5)).fill(null).map(() => generateActivity(faker.string.uuid()))
  };
}

/**
 * Generate a random activity for a session
 */
export function generateActivity(sessionId: string): Activity {
  return {
    id: faker.string.uuid(),
    session_id: sessionId,
    type: faker.helpers.arrayElement([
      'Attention Test', 
      'Memory Game', 
      'Pattern Recognition', 
      'Impulse Control',
      'Working Memory Task',
      'Visual Attention Test'
    ]),
    score: Math.floor(Math.random() * 100),
    duration: Math.floor(3 + Math.random() * 8) * 60, // 3-10 minutes in seconds
    difficulty: Math.floor(1 + Math.random() * 5), // 1-5 difficulty level
    created_at: new Date().toISOString()
  };
}

/**
 * Convert database Session to frontend SessionData
 */
export function mapToSessionData(session: Session): SessionData {
  return {
    id: session.id,
    patient_id: session.patient_id,
    start_time: session.start_time,
    end_time: session.end_time,
    duration: session.duration,
    environment: session.environment,
    completion_status: session.completion_status,
    overall_score: session.overall_score,
    device: session.device,
    attention: session.attention,
    memory: session.memory,
    executive_function: session.executive_function,
    behavioral: session.behavioral,
    activities: session.activities || [],
    domainScores: {
      attention: session.attention,
      memory: session.memory,
      executiveFunction: session.executive_function,
      behavioral: session.behavioral
    }
  };
}
