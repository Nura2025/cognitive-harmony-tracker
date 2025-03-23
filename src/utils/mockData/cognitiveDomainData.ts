
import { randomInt } from '../helpers/randomUtils';

// Mock data for patient cognitive domains
export const mockPatientData: Record<string, number> = {
  attention: 78,
  memory: 84,
  executive: 65,
  behavioral: 52
};

// Mock normative data for comparison
export const mockNormativeData: Record<string, number> = {
  attention: 65,
  memory: 67,
  executive: 70,
  behavioral: 68
};

// Mock subtype data for ADHD comparison
export const mockSubtypeData: Record<string, number> = {
  attention: 45,
  memory: 72,
  executive: 58,
  behavioral: 43
};
