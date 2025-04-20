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

// Update metricsMap with complete data
export const metricsMap: Record<string, PatientMetrics> = {
  "p1": {
    patientId: "p1",
    date: "2024-04-10",
    attention: 75,
    memory: 82,
    executiveFunction: 68,
    behavioral: 70,
    impulseControl: 65,
    percentile: 76,
    sessionsDuration: 120,
    sessionsCompleted: 5,
    progress: 8,
    clinicalConcerns: ["Task initiation", "Sustained attention"]
  },
  "p2": {
    patientId: "p2",
    date: "2024-04-12",
    attention: 65,
    memory: 72,
    executiveFunction: 78,
    behavioral: 80,
    impulseControl: 75,
    percentile: 72,
    sessionsDuration: 150,
    sessionsCompleted: 6,
    progress: 12,
    clinicalConcerns: ["Emotional regulation"]
  }
};

// Update sessionsMap with sample sessions
export const sessionsMap: Record<string, SessionData[]> = {
  "p1": [
    {
      id: "s1",
      patientId: "p1",
      startTime: "2024-03-01T10:00:00Z",
      endTime: "2024-03-01T11:00:00Z",
      completionStatus: "completed",
      overallScore: 78,
      domainScores: {
        attention: 75,
        memory: 82,
        executiveFunction: 68,
        behavioral: 70,
        impulseControl: 65
      },
      activities: [
        {
          id: "a1",
          name: "Memory Task",
          type: "memory",
          score: 82,
          duration: 600,
          difficulty: 2,
          completionStatus: "completed"
        }
      ]
    },
    {
      id: "s2",
      patientId: "p1",
      startTime: "2024-03-15T14:00:00Z",
      endTime: "2024-03-15T15:00:00Z",
      completionStatus: "completed",
      overallScore: 80,
      domainScores: {
        attention: 78,
        memory: 85,
        executiveFunction: 72,
        behavioral: 75,
        impulseControl: 70
      },
      activities: [
        {
          id: "a2",
          name: "Attention Task",
          type: "attention",
          score: 78,
          duration: 600,
          difficulty: 3,
          completionStatus: "completed"
        }
      ]
    }
  ],
  "p2": []
};

// Update reportsMap with sample reports
export const reportsMap: Record<string, ReportType[]> = {
  "p1": [
    {
      id: "r1",
      patientId: "p1",
      title: "Clinical Assessment Report",
      date: "2024-04-10",
      type: "clinical",
      metrics: {
        attention: 75,
        memory: 82,
        executiveFunction: 68,
        behavioral: 70,
        impulseControl: 65
      },
      notes: "Patient shows improvement in memory tasks",
      recommendations: [
        "Continue memory exercises",
        "Focus on executive function tasks"
      ],
      status: "generated",
      createdDate: "2024-04-10"
    }
  ],
  "p2": []
};

// Mock patients data
export const patients: Patient[] = [
  {
    id: "p1",
    name: "John Doe",
    age: 25,
    gender: "male",
    diagnosisDate: "2024-01-01",
    adhdSubtype: "Combined",
    assessmentCount: 5,
    lastAssessment: "2024-04-01"
  },
  {
    id: "p2",
    name: "Jane Smith",
    age: 30,
    gender: "female",
    diagnosisDate: "2024-02-15",
    adhdSubtype: "Inattentive",
    assessmentCount: 6,
    lastAssessment: "2024-04-12"
  }
];

// Empty session and report maps for mock data
export const sessionsMap: Record<string, SessionData[]> = {
  "p1": [],
  "p2": []
};

export const reportsMap: Record<string, ReportType[]> = {
  "p1": [],
  "p2": []
};

// Mock patient data for reports
export const mockPatientData: Patient = {
  id: "p1",
  name: "John Doe",
  age: 25,
  gender: "male",
  diagnosisDate: "2024-01-01",
  adhdSubtype: "Combined",
  assessmentCount: 5,
  lastAssessment: "2024-04-01"
};

// Export all types for use in other files
export type { CognitiveDomain, Patient, PatientMetrics, SessionData, ReportType };
