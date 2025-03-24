
import { format, subDays, addMinutes, subMonths } from 'date-fns';
import { randomInt, randomFloat, randomChoice } from '../helpers/randomUtils';

// Define interfaces matching what the application expects
interface GeneratedPatient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  diagnosisDate: string;
  adhdSubtype: 'Inattentive' | 'Hyperactive-Impulsive' | 'Combined';
  assessmentCount: number;
  lastAssessment: string;
}

interface GeneratedPatientMetrics {
  patientId: string;
  date: string;
  attention: number;
  memory: number;
  executiveFunction: number;
  behavioral: number;
  percentile: number;
  sessionsDuration: number;
  sessionsCompleted: number;
  progress: number;
  clinicalConcerns: string[];
}

/**
 * Generate mock patient data
 */
export const generatePatients = (count: number = 10): GeneratedPatient[] => {
  const subtypes: Array<'Inattentive' | 'Hyperactive-Impulsive' | 'Combined'> = ['Inattentive', 'Hyperactive-Impulsive', 'Combined'];
  const genders: Array<'Male' | 'Female' | 'Other'> = ['Male', 'Female', 'Other'];
  const firstNames = ['Alex', 'Jamie', 'Taylor', 'Jordan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Skyler', 'Morgan', 'Sam', 'Drew'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Martinez'];
  
  return Array.from({ length: count }, (_, i) => {
    const assessmentCount = randomInt(1, 15);
    const lastAssessmentDays = randomInt(1, 30);
    
    return {
      id: `P${1000 + i}`,
      name: `${randomChoice(firstNames)} ${randomChoice(lastNames)}`,
      age: randomInt(6, 17),
      gender: randomChoice(genders),
      diagnosisDate: format(subMonths(new Date(), randomInt(1, 24)), 'yyyy-MM-dd'),
      adhdSubtype: randomChoice(subtypes),
      assessmentCount,
      lastAssessment: format(subDays(new Date(), lastAssessmentDays), 'yyyy-MM-dd')
    };
  });
};

/**
 * Generate metrics for each patient
 */
export const generatePatientMetrics = (patients: any[]): GeneratedPatientMetrics[] => {
  return patients.map(patient => {
    const concerns: string[] = [];
    const attention = randomFloat(40, 95);
    const memory = randomFloat(40, 95);
    const executiveFunction = randomFloat(40, 95);
    const behavioral = randomFloat(40, 95);
    
    // Add clinical concerns based on scores
    if (attention < 60) concerns.push('Low sustained attention');
    if (memory < 60) concerns.push('Memory retention difficulties');
    if (executiveFunction < 60) concerns.push('Poor planning abilities');
    if (behavioral < 60) concerns.push('High impulsivity');
    
    // Calculate average percentile
    const percentile = Math.round((attention + memory + executiveFunction + behavioral) / 4);
    
    return {
      patientId: patient.id,
      date: format(new Date(), 'yyyy-MM-dd'),
      attention,
      memory,
      executiveFunction,
      behavioral,
      percentile,
      sessionsDuration: randomInt(20, 200),
      sessionsCompleted: patient.assessmentCount || randomInt(5, 15),
      progress: randomInt(5, 25),
      clinicalConcerns: concerns
    };
  });
};
