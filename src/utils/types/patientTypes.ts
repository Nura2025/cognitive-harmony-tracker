export interface CognitiveProfile {
  user_id: string;
  user_name: string;
  age: number;
  age_group: string;
  adhd_subtype: string;
  session_id: string;
  session_date: string;
  domain_scores: {
    attention: number;
    memory: number;
    impulse_control: number;
    executive_function: number;
  };
  percentiles: {
    attention: number;
    memory: number;
    impulse_control: number;
    executive_function: number;
  };
  classifications: {
    attention: string;
    memory: string;
    impulse_control: string;
    executive_function: string;
  };
  profile_pattern: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  score: number;
  value?: number; // Adding this for backward compatibility
}

export interface ProgressComparison {
  user_id: string;
  domain: string;
  period: string;
  initial_score: number;
  current_score: number;
  initial_date: string;
  current_date: string;
  absolute_change: number;
  percentage_change: number;
}

export interface ComponentDetails {
  session_id: string;
  domain: string;
  overall_score: number;
  percentile: number;
  classification: string;
  components: Record<string, any>;
  data_completeness: number;
}

export interface NormativeComparison {
  user_id: string;
  domain: string;
  age_group: string;
  raw_score: number;
  normative_comparison: {
    mean: number;
    standard_deviation: number;
    z_score: number;
    percentile: number;
    reference: string;
    sample_size: number;
  };
  adhd_comparison: {
    z_score: number;
    percentile: number;
    reference: string;
  };
}

// Additional types needed by components
export interface CognitiveDomain {
  attention: number;
  memory: number;
  executiveFunction: number;
  impulseControl: number;
  behavioral?: number; // For backwards compatibility
  [key: string]: number | undefined; // Add string indexing to resolve type errors
}

export interface CognitiveDomainMetrics {
  [key: string]: number;
  attention: number;
  memory: number;
  executiveFunction: number;
  impulseControl: number;
  behavioral?: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  diagnosisDate: string;
  adhdSubtype: string;
  assessmentCount: number;
  lastAssessment: string;
}

export interface PatientMetrics {
  [key: string]: number | string[] | undefined;
  patientId: string;
  date: string;
  attention: number;
  memory: number;
  executiveFunction: number;
  behavioral: number;
  impulseControl?: number;
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
  completionStatus: string;
  overallScore: number;
  domainScores: Record<string, number>;
  activities: {
    id: string;
    name: string;
    type: string;
    score: number;
    duration: number;
    difficulty: number;
    completionStatus: string;
  }[];
  duration?: number;
  environment?: string;
  device?: string;
}

export interface PatientData {
  patient: Patient;
  metrics: PatientMetrics;
  sessions: SessionData[];
  reports: ReportType[];
}

export interface ReportType {
  id: string;
  patientId: string;
  title: string;
  date: string;
  type: string;
  metrics?: Record<string, number>;
  notes?: string;
  recommendations?: string[];
  generatedBy?: string;
  sections?: Record<string, boolean>;
  status: string;
  createdDate: string;
}
