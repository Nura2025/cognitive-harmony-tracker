
import { CognitiveDomain } from '../types/patientTypes';
import { randomInt } from '../helpers/randomUtils';

// Mock data for patient cognitive domains
export const mockPatientData: CognitiveDomain = {
  attention: 78,
  memory: 84,
  executiveFunction: 65,
  behavioral: 52
};

// Mock normative data for comparison
export const mockNormativeData: CognitiveDomain = {
  attention: 65,
  memory: 67,
  executiveFunction: 70,
  behavioral: 68
};

// Mock subtype data for ADHD comparison
export const mockSubtypeData: CognitiveDomain = {
  attention: 45,
  memory: 72,
  executiveFunction: 58,
  behavioral: 43
};
