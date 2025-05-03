
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { PatientReports } from '@/components/reports/PatientReports';
import { ReportType } from '@/utils/types/patientTypes';
import { mockReports } from '@/utils/mockData/reportData';
import axios from 'axios';
import { API_BASE } from '@/services/config';
import { toast } from "@/hooks/use-toast";
import { ReportVisualizations } from '@/components/reports/ReportVisualizations';

interface PatientReportTabProps {
  patientId: string;
  patientName: string;
}

export const PatientReportTab: React.FC<PatientReportTabProps> = ({ patientId, patientName }) => {
  const [reports, setReports] = useState<ReportType[]>(() => mockReports(patientId));
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  
  // Function to handle adding a new report
  const handleAddReport = (newReport: ReportType) => {
    setReports(prevReports => [newReport, ...prevReports]);
  };
  
  // Function to handle viewing a report
  const handleViewReport = (report: ReportType) => {
    setSelectedReport(report);
  };
  
  // Function to send email with report
  const sendReportEmail = async (
    emailRecipient: string, 
    emailSubject: string, 
    emailMessage: string, 
    reportData: any
  ) => {
    try {
      // In a real application, this would call an API endpoint to send the email
      // For now we'll simulate this with a delayed response
      console.log('Sending email to:', emailRecipient);
      console.log('Email subject:', emailSubject);
      console.log('Email message:', emailMessage);
      console.log('Report data:', reportData);
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a production environment, you would use an API like:
      // const response = await axios.post(`${API_BASE}/api/send-report-email`, {
      //   recipient: emailRecipient,
      //   subject: emailSubject,
      //   message: emailMessage,
      //   reportData: reportData
      // });
      
      toast({
        title: "Email Sending Simulated",
        description: `In a production environment, this would send an email to ${emailRecipient}. Email functionality requires server-side implementation.`,
      });
      
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Email Sending Failed",
        description: "There was an error sending the email. Please try again later.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  return (
    <div className="space-y-6">
      {selectedReport ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{selectedReport.title}</h2>
            <button 
              className="text-sm text-muted-foreground hover:text-primary"
              onClick={() => setSelectedReport(null)}
            >
              Back to reports
            </button>
          </div>
          <ReportVisualizations 
            report={selectedReport} 
            patientId={patientId} 
            patientName={patientName} 
          />
        </>
      ) : (
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
              onSendEmail={sendReportEmail}
            />
          </div>
        </div>
      )}
    </div>
  );
};
