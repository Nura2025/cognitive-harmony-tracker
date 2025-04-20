
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
