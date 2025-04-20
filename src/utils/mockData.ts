
import { CognitiveDomain, Patient, PatientMetrics, SessionData, ReportType } from './types/patientTypes';

// Define mock data
export const mockNormativeData: CognitiveDomain = {
  attention: 50,
  memory: 55,
  executiveFunction: 48,
  impulseControl: 52
};

export const mockSubtypeData: CognitiveDomain = {
  attention: 42,
  memory: 45,
  executiveFunction: 40,
  impulseControl: 43
};

// Empty data entries for when real data is not available
export const patients: Patient[] = [];
export const metricsMap: Record<string, PatientMetrics> = {
  "p1": {
    patientId: "p1",
    date: "2024-04-10",
    attention: 75,
    memory: 82,
    executiveFunction: 68,
    behavioral: 70,
    impulseControl: 65,
    percentile: 76,
    sessionsDuration: 120,
    sessionsCompleted: 5,
    progress: 8,
    clinicalConcerns: ["Task initiation", "Sustained attention"]
  },
  "p2": {
    patientId: "p2",
    date: "2024-04-12",
    attention: 65,
    memory: 72,
    executiveFunction: 78,
    behavioral: 80,
    impulseControl: 75,
    percentile: 72,
    sessionsDuration: 150,
    sessionsCompleted: 6,
    progress: 12,
    clinicalConcerns: ["Emotional regulation"]
  }
};

export const sessionsMap: Record<string, SessionData[]> = {};
export const reportsMap: Record<string, ReportType[]> = {};

// Export all types for use in other files
export type { CognitiveDomain, Patient, PatientMetrics, SessionData, ReportType };

// Mock patient data for reports
export const mockPatientData: Patient = {
  id: "p1",
  name: "John Doe",
  age: 25,
  gender: "male",
  diagnosisDate: "2024-01-01",
  adhdSubtype: "Combined",
  assessmentCount: 5,
  lastAssessment: "2024-04-01"
};
