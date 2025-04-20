
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
export const metricsMap: Record<string, PatientMetrics> = {};
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
