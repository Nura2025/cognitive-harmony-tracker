
export interface SessionAnalysisProps {
  session: any;
}

export interface ActivityBreakdownProps {
  activities: any[];
}

export interface PatientCardProps {
  patient: any;
  metrics?: any;
  onClick?: () => void;
}

export interface PatientListProps {
  patients: any[];
  metrics: any;
}

export interface PatientReportsProps {
  reports: any[];
  onViewReport: (report: any) => void;
}

export interface ReportGeneratorProps {
  patient: any;
  metrics: any;
  onReportGenerate: (report: any) => void;
}

export interface SessionTimelineProps {
  sessions: any[];
  title?: string;
}
