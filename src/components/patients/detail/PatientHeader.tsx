
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, FileText } from 'lucide-react';
import { Patient } from '@/utils/types/patientTypes';

interface PatientHeaderProps {
  patient: Patient;
  onBackClick: () => void;
  onGenerateReport: () => void;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({
  patient,
  onBackClick,
  onGenerateReport,
}) => {
  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4 -ml-2 text-muted-foreground"
        onClick={onBackClick}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Patients
      </Button>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">{patient.name}</h1>
          <p className="text-muted-foreground">
            Patient ID: {patient.id} | Diagnosed: {patient.diagnosisDate}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1.5"
            onClick={onGenerateReport}
          >
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>
    </>
  );
};
