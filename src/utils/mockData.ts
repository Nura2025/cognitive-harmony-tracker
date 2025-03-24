// This file serves as the entry point for mock data
// It initializes and exports all generated mock data

import { 
  Patient, 
  PatientMetrics, 
  CognitiveDomain,
  Session,
  Activity
} from '@/types/databaseTypes';
import { generatePatients, generatePatientMetrics } from './generators/patientGenerators';
import { generateSession } from './generators/sessionGenerators';
import { mockPatientData, mockNormativeData, mockSubtypeData } from './mockData/cognitiveDomainData';

// Define a mapping interface for frontend components
export interface SessionWithDomainScores extends Session {
  domainScores: {
    attention: number;
    memory: number;
    executiveFunction: number;
    behavioral: number;
  };
}

/**
 * Generate trend data for visualization from sessions
 */
export const generateTrendData = (sessions: Session[] | any[]): any[] => {
  if (!sessions || sessions.length === 0) return [];

  return sessions.map(session => ({
    date: session.start_time ? new Date(session.start_time).toISOString().split('T')[0] : '',
    score: session.overall_score || 0
  }))
  .filter(item => item.date)
  .sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Generate percentile data for visualization
 */
export const generatePercentileData = (metrics: PatientMetrics | any): any[] => {
  if (!metrics) return [];

  return [
    { domain: 'Attention', value: metrics.attention || 0 },
    { domain: 'Memory', value: metrics.memory || 0 },
    { domain: 'Executive Function', value: metrics.executive_function || 0 },
    { domain: 'Behavioral', value: metrics.behavioral || 0 }
  ];
};

/**
 * Generate recommendations based on ADHD subtype
 */
export const generateRecommendations = (adhdSubtype: string): string[] => {
  const baseRecommendations = [
    "Establish a structured daily routine with clear schedules",
    "Break tasks into smaller, manageable chunks",
    "Use timers and alarms for time management",
    "Create a dedicated, distraction-free workspace"
  ];

  switch (adhdSubtype.toLowerCase()) {
    case 'inattentive':
      return [
        ...baseRecommendations,
        "Implement visual reminders and checklists",
        "Use color-coding and visual organization systems",
        "Practice mindfulness techniques to improve focus",
        "Consider environmental modifications to reduce sensory distractions"
      ];
    case 'hyperactive-impulsive':
      return [
        ...baseRecommendations,
        "Incorporate regular movement breaks throughout the day",
        "Engage in physical exercise before focused work sessions",
        "Practice self-regulation techniques like deep breathing",
        "Use fidget tools appropriately during seated activities"
      ];
    case 'combined':
    default:
      return [
        ...baseRecommendations,
        "Balance physical activity with focused attention tasks",
        "Implement both visual organization systems and movement opportunities",
        "Practice both mindfulness and self-regulation techniques",
        "Consider a multimodal approach to intervention"
      ];
  }
};

// Generate some session data for mock usage
export const generateSessionData = (patientId: string, count: number = 5): Session[] => {
  return Array(count).fill(null).map(() => generateSession(patientId));
};

// For convenience, export dummy functions for backward compatibility
export const patients: Patient[] = [];
export const patientMetrics: PatientMetrics[] = [];
export const sessionData: Session[] = [];
export const metricsMap: Record<string, PatientMetrics> = {};
export const sessionsMap: Record<string, Session[]> = {};

// Export all types and generator functions
export { 
  generatePatients, 
  generatePatientMetrics, 
  generateSession,
  mockPatientData,
  mockNormativeData,
  mockSubtypeData
};
