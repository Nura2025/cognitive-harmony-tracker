
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

// Type definitions for consistent usage
export type { CognitiveDomain };
