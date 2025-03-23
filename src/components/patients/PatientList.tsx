
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
import { Patient, PatientMetrics } from '@/types/databaseTypes';
import { formatDateDistance, formatPercentile, getScoreColorClass } from '@/utils/dataProcessing';
import { format, parseISO } from 'date-fns';

interface PatientListProps {
  patients: Patient[];
  metrics: Record<string, PatientMetrics>;
}

export const PatientList: React.FC<PatientListProps> = ({ patients, metrics }) => {
  const navigate = useNavigate();
  
  if (patients.length === 0) {
    return (
      <div className="glass rounded-md p-8 text-center border border-border">
        <p className="text-muted-foreground">No patients found</p>
      </div>
    );
  }
  
  return (
    <div className="glass rounded-md overflow-hidden border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>ADHD Subtype</TableHead>
            <TableHead>Diagnosis Date</TableHead>
            <TableHead>Percentile</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow 
              key={patient.id}
              className="hover:bg-muted/30 transition-colors"
            >
              <TableCell className="font-medium">{patient.name}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-normal">
                  {patient.adhd_subtype}
                </Badge>
              </TableCell>
              <TableCell>{format(parseISO(patient.diagnosis_date), 'MMM d, yyyy')}</TableCell>
              <TableCell>
                {metrics[patient.id] ? (
                  <span 
                    className={`font-medium ${getScoreColorClass(metrics[patient.id]?.percentile)}`}
                  >
                    {formatPercentile(metrics[patient.id]?.percentile)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">No data</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => navigate(`/analysis?patient=${patient.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View analysis</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => navigate(`/reports?patient=${patient.id}`)}
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
