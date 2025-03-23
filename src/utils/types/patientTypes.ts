
// Type definitions for patient and assessment data

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
  patientId: string;
  startTime: string;
  endTime: string;
  duration: number;
  environment: 'Home' | 'School' | 'Clinic';
  completionStatus: 'Completed' | 'Abandoned' | 'Interrupted';
  overallScore: number;
  device: string;
  activities: Array<{
    id: string;
    type: string;
    score: number;
    duration: number;
    difficulty: number;
  }>;
  domainScores: CognitiveDomain;
}
