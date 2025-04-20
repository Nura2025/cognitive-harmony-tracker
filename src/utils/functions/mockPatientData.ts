
import { Patient, PatientMetrics, SessionData, ReportType } from '../types/patientTypes';

// Mock patient data
export const mockPatientData = {
  patient: {
    id: "patient-123",
    name: "Alex Johnson",
    age: 13,
    gender: "Male",
    diagnosisDate: "2023-04-15",
    adhdSubtype: "Combined",
    assessmentCount: 7,
    lastAssessment: "2024-04-01"
  } as Patient,
  
  metrics: {
    patientId: "patient-123",
    date: "2024-04-01",
    attention: 78,
    memory: 82,
    executiveFunction: 65,
    behavioral: 71,
    impulseControl: 68,
    percentile: 74,
    sessionsDuration: 240,
    sessionsCompleted: 7,
    progress: 12,
    clinicalConcerns: ["Task initiation", "Emotional regulation"]
  } as PatientMetrics
};

// Mock normative data
export const mockNormativeData = {
  attention: 65,
  memory: 68,
  executiveFunction: 70,
  impulseControl: 62,
  behavioral: 63
};

// Mock ADHD subtype data
export const mockSubtypeData = {
  attention: 58,
  memory: 65,
  executiveFunction: 55,
  impulseControl: 52,
  behavioral: 59
};
