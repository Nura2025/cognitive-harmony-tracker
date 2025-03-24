
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  diagnosis_date: string;
  adhd_subtype: 'Inattentive' | 'Hyperactive-Impulsive' | 'Combined';
  created_at: string;
}

export interface CognitiveDomain {
  attention: number;
  memory: number;
  executive_function: number;
  behavioral: number;
}

export interface PatientMetrics extends CognitiveDomain {
  id: string;
  patient_id: string;
  date: string;
  percentile: number | null;
  sessions_duration: number;
  sessions_completed: number;
  progress: number;
  created_at: string;
  clinical_concerns?: string[];
}

export interface Session extends CognitiveDomain {
  id: string;
  patient_id: string;
  start_time: string;
  end_time: string;
  duration: number;
  environment: 'Home' | 'School' | 'Clinic';
  completion_status: 'Completed' | 'Abandoned' | 'Interrupted';
  overall_score: number;
  device: string;
  created_at: string;
  activities?: Activity[];
}

export interface Activity {
  id: string;
  session_id: string;
  type: string;
  score: number;
  duration: number;
  difficulty: number;
  created_at: string;
}

export interface ClinicalConcern {
  id: string;
  patient_metric_id: string;
  concern: string;
  created_at: string;
}

// New interfaces for doctor data
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  license_number: string;
  email: string;
  phone: string | null;
  created_at: string;
}

export interface DoctorPatient {
  id: string;
  doctor_id: string;
  patient_id: string;
  assigned_date: string;
  created_at: string;
}
