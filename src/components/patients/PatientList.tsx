
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, FileText } from 'lucide-react';
import { Patient, PatientMetrics } from '@/utils/mockData';
import { formatLastSession, formatPercentile, getScoreColorClass } from '@/utils/dataProcessing';

interface PatientListProps {
  patients: Patient[];
  metrics: Record<string, PatientMetrics>;
}

export const PatientList: React.FC<PatientListProps> = ({ patients, metrics }) => {
  const navigate = useNavigate();
  
  const handlePatientClick = (patientId: string) => {
    navigate(`/patient/${patientId}`);
  };
  
  return (
    <div className="glass rounded-md overflow-hidden border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>ADHD Subtype</TableHead>
            <TableHead>Last Session</TableHead>
            <TableHead>Sessions</TableHead>
            <TableHead>Percentile</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow 
              key={patient.id}
              className="hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => handlePatientClick(patient.id)}
            >
              <TableCell className="font-medium">{patient.name}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-normal">
                  {patient.adhdSubtype}
                </Badge>
              </TableCell>
              <TableCell>{formatLastSession(patient.lastAssessment)}</TableCell>
              <TableCell>{patient.assessmentCount}</TableCell>
              <TableCell>
                <span 
                  className={`font-medium ${getScoreColorClass(metrics[patient.id]?.percentile)}`}
                >
                  {formatPercentile(metrics[patient.id]?.percentile)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2" onClick={e => e.stopPropagation()}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/analysis?patient=${patient.id}`);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View analysis</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/reports?patient=${patient.id}`);
                    }}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="sr-only">View reports</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
