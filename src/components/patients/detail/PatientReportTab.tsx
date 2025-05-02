
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { PatientReports } from '@/components/reports/PatientReports';
import { ReportType } from '@/utils/types/patientTypes';
import { mockReports } from '@/utils/mockData/reportData';

interface PatientReportTabProps {
  patientId: string;
  patientName: string;
}

export const PatientReportTab: React.FC<PatientReportTabProps> = ({ patientId, patientName }) => {
  const [reports, setReports] = useState<ReportType[]>(() => mockReports(patientId));
  
  // Function to handle adding a new report
  const handleAddReport = (newReport: ReportType) => {
    setReports(prevReports => [newReport, ...prevReports]);
  };
  
  // Placeholder function for viewing a report
  const handleViewReport = (report: ReportType) => {
    console.log('Viewing report:', report);
    // In a real application, this would navigate to or show a detailed report view
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PatientReports 
            reports={reports} 
            onViewReport={handleViewReport} 
          />
        </div>
        <div>
          <ReportGenerator 
            patient={{ user_id: patientId, name: patientName, age: 0, gender: 'Male' }}
            metrics={{
              patientId: patientId,
              date: new Date().toISOString(),
              attention: 75,
              memory: 65,
              executiveFunction: 80,
              behavioral: 70,
              percentile: 72,
              sessionsDuration: 120,
              sessionsCompleted: 12,
              progress: 8,
              clinicalConcerns: [],
            }}
            onReportGenerate={handleAddReport}
          />
        </div>
      </div>
    </div>
  );
};
