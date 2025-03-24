import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shell } from "@/components/Shell";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DomainChart } from '@/components/dashboard/DomainChart';
import { SessionTimeline } from '@/components/dashboard/SessionTimeline';
import { Patient } from '@/types/databaseTypes';
import { useSupabaseQuery } from '@/hooks/use-supabase-query';
import { PatientMetrics, Session } from '@/types/databaseTypes';

interface PatientCardProps {
  patient: Patient;
  metrics?: PatientMetrics | null;
  isSelected: boolean;
  onClick: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, metrics, isSelected, onClick }) => {
  const { name, adhd_subtype, age, gender } = patient;
  
  return (
    <Card
      className={`glass cursor-pointer ${isSelected ? 'border-2 border-primary' : ''}`}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {age} years old, {gender}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center">
          <Badge variant="secondary">{adhd_subtype}</Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={`https://avatar.vercel.sh/${name}.png`} />
            <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {metrics ? `Progress: ${metrics.progress}%` : 'No metrics available'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// Inside the Dashboard component
const Dashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  
  // Fetch patients from database
  const { 
    data: patients, 
    isLoading: isLoadingPatients 
  } = useSupabaseQuery<Patient[]>({
    table: 'patients',
    orderBy: { column: 'name' }
  });
  
  // Fetch sessions for selected patient
  const {
    data: patientSessions,
    isLoading: isLoadingSessions
  } = useSupabaseQuery<Session[]>({
    table: 'sessions',
    filter: (query) => selectedPatient ? query.eq('patient_id', selectedPatient) : query.limit(0),
    orderBy: { column: 'start_time', ascending: false },
    enabled: !!selectedPatient,
    dependencies: [selectedPatient]
  });
  
  // Fetch metrics for selected patient
  const {
    data: patientMetrics,
    isLoading: isLoadingMetrics
  } = useSupabaseQuery<PatientMetrics>({
    table: 'patient_metrics',
    filter: (query) => selectedPatient ? query.eq('patient_id', selectedPatient) : query.limit(0),
    orderBy: { column: 'date', ascending: false },
    limit: 1,
    singleRow: true,
    enabled: !!selectedPatient,
    dependencies: [selectedPatient]
  });
  
  // Handle patient selection
  const handlePatientSelect = (patientId: string) => {
    setSelectedPatient(patientId);
  };
  
  // When rendering patient-specific components, pass the real data:
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Track cognitive performance and patient progress.
          </p>
        </div>
      </div>
      
      {/* Update the components to use real data */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {patients?.map(patient => (
          <PatientCard
            key={patient.id}
            patient={patient}
            metrics={patientMetrics}
            isSelected={selectedPatient === patient.id}
            onClick={() => handlePatientSelect(patient.id)}
          />
        ))}
        {isLoadingPatients && (
          <div className="col-span-full flex justify-center p-12">
            <p>Loading patients...</p>
          </div>
        )}
      </div>
      
      {selectedPatient && (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <DomainChart
              patient={selectedPatient}
              isLoading={isLoadingMetrics}
              metrics={patientMetrics}
            />
            <SessionTimeline
              patientId={selectedPatient}
              sessions={patientSessions}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
