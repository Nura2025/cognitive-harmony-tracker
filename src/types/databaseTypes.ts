
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  diagnosis_date: string;
  adhd_subtype: 'Inattentive' | 'Hyperactive-Impulsive' | 'Combined';
  created_at: string;
}

export interface PatientMetrics {
  id: string;
  patient_id: string;
  date: string;
  attention: number;
  memory: number;
  executive_function: number;
  behavioral: number;
  percentile: number | null;
  sessions_duration: number;
  sessions_completed: number;
  progress: number;
  created_at: string;
  clinical_concerns?: string[];
}

export interface Session {
  id: string;
  patient_id: string;
  start_time: string;
  end_time: string;
  duration: number;
  environment: 'Home' | 'School' | 'Clinic';
  completion_status: 'Completed' | 'Abandoned' | 'Interrupted';
  overall_score: number;
  device: string;
  attention: number;
  memory: number;
  executive_function: number;
  behavioral: number;
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
