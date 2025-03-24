
import { format, subDays, addMinutes, subMonths } from 'date-fns';
import { randomInt, randomFloat, randomChoice } from '../helpers/randomUtils';
import { Patient, PatientMetrics } from '@/types/databaseTypes';

/**
 * Generate mock patient data
 */
export const generatePatients = (count: number = 10): Patient[] => {
  const subtypes: Array<'Inattentive' | 'Hyperactive-Impulsive' | 'Combined'> = ['Inattentive', 'Hyperactive-Impulsive', 'Combined'];
  const genders: Array<'Male' | 'Female' | 'Other'> = ['Male', 'Female', 'Other'];
  const firstNames = ['Alex', 'Jamie', 'Taylor', 'Jordan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Skyler', 'Morgan', 'Sam', 'Drew'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Martinez'];
  
  return Array.from({ length: count }, (_, i) => {
    return {
      id: `P${1000 + i}`,
      name: `${randomChoice(firstNames)} ${randomChoice(lastNames)}`,
      age: randomInt(6, 17),
      gender: randomChoice(genders),
      diagnosis_date: format(subMonths(new Date(), randomInt(1, 24)), 'yyyy-MM-dd'),
      adhd_subtype: randomChoice(subtypes),
      created_at: new Date().toISOString()
    };
  });
};

/**
 * Generate metrics for each patient
 */
export const generatePatientMetrics = (patients: Patient[]): PatientMetrics[] => {
  return patients.map(patient => {
    const concerns: string[] = [];
    const attention = randomFloat(40, 95);
    const memory = randomFloat(40, 95);
    const executive_function = randomFloat(40, 95);
    const behavioral = randomFloat(40, 95);
    
    // Add clinical concerns based on scores
    if (attention < 60) concerns.push('Low sustained attention');
    if (memory < 60) concerns.push('Memory retention difficulties');
    if (executive_function < 60) concerns.push('Poor planning abilities');
    if (behavioral < 60) concerns.push('High impulsivity');
    
    // Calculate average percentile
    const percentile = Math.round((attention + memory + executive_function + behavioral) / 4);
    
    return {
      id: `PM-${patient.id}`,
      patient_id: patient.id,
      date: format(new Date(), 'yyyy-MM-dd'),
      attention,
      memory,
      executive_function,
      behavioral,
      percentile,
      sessions_duration: randomInt(20, 200),
      sessions_completed: randomInt(5, 15),
      progress: randomInt(5, 25),
      clinical_concerns: concerns,
      created_at: new Date().toISOString()
    };
  });
};
