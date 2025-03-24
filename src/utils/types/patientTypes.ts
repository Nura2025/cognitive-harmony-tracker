
// Type definitions for patient and assessment data

import { CognitiveDomain as DBCognitiveDomain } from '@/types/databaseTypes';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  diagnosisDate: string;
  adhdSubtype: 'Inattentive' | 'Hyperactive-Impulsive' | 'Combined';
  assessmentCount: number;
  lastAssessment: string;
}

export interface CognitiveDomain {
  attention: number;
  memory: number;
  executiveFunction: number;
  behavioral: number;
}

export interface PatientMetrics extends CognitiveDomain {
  patientId: string;
  date: string;
  percentile: number;
  sessionsDuration: number;
  sessionsCompleted: number;
  progress: number;
  clinicalConcerns: string[];
}

export interface SessionData {
  id: string;
  patient_id: string; // Match database field name
  start_time: string; // Match database field name
  end_time: string; // Match database field name
  duration: number;
  environment: 'Home' | 'School' | 'Clinic';
  completion_status: 'Completed' | 'Abandoned' | 'Interrupted'; // Match database field name
  overall_score: number; // Match database field name
  device: string;
  attention: number; // Match database field name
  memory: number; // Match database field name
  executive_function: number; // Match database field name
  behavioral: number; // Match database field name
  activities: Array<{
    id: string;
    type: string;
    score: number;
    duration: number;
    difficulty: number;
  }>;
  domainScores: {
    attention: number;
    memory: number;
    executiveFunction: number;
    behavioral: number;
  };
}

// Helper function to map database types to frontend types
export const mapDbSessionToSessionData = (dbSession: any, activities: any[] = []): SessionData => {
  return {
    id: dbSession.id,
    patient_id: dbSession.patient_id,
    start_time: dbSession.start_time,
    end_time: dbSession.end_time,
    duration: dbSession.duration,
    environment: dbSession.environment,
    completion_status: dbSession.completion_status,
    overall_score: dbSession.overall_score,
    device: dbSession.device,
    attention: dbSession.attention,
    memory: dbSession.memory,
    executive_function: dbSession.executive_function,
    behavioral: dbSession.behavioral,
    activities: activities,
    domainScores: {
      attention: dbSession.attention,
      memory: dbSession.memory,
      executiveFunction: dbSession.executive_function,
      behavioral: dbSession.behavioral
    }
  };
};
