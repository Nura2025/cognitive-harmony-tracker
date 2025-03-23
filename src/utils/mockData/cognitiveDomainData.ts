
import { CognitiveDomain } from '@/types/databaseTypes';

// Mock data for patient cognitive domains
export const mockPatientData: CognitiveDomain = {
  attention: 78,
  memory: 84,
  executive_function: 65,
  behavioral: 52
};

// Mock normative data for comparison
export const mockNormativeData: CognitiveDomain = {
  attention: 65,
  memory: 67,
  executive_function: 70,
  behavioral: 68
};

// Mock subtype data for ADHD comparison
export const mockSubtypeData: CognitiveDomain = {
  attention: 45,
  memory: 72,
  executive_function: 58,
  behavioral: 43
};
