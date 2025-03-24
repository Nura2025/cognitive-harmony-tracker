
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from '@/hooks/use-toast';
import { DomainChart } from '@/components/dashboard/DomainChart';
import { SessionTimeline } from '@/components/dashboard/SessionTimeline';
import { Patient, PatientMetrics, Session } from '@/types/databaseTypes';
import { useSupabaseQuery } from '@/hooks/use-supabase-query';
import { PatientCard } from '@/components/dashboard/PatientCard';

// Dashboard Component
const Dashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  
  // Fetch patients from database
  const { 
    data: patients, 
    isLoading: isLoadingPatients,
    error: patientsError
  } = useSupabaseQuery<Patient[]>({
    table: 'patients',
    orderBy: { column: 'name' }
  });
  
  // Fetch sessions for selected patient
  const {
    data: patientSessions,
    isLoading: isLoadingSessions,
    error: sessionsError
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
    isLoading: isLoadingMetrics,
    error: metricsError
  } = useSupabaseQuery<PatientMetrics>({
    table: 'patient_metrics',
    filter: (query) => selectedPatient ? query.eq('patient_id', selectedPatient) : query.limit(0),
    orderBy: { column: 'date', ascending: false },
    limit: 1,
    singleRow: true,
    enabled: !!selectedPatient,
    dependencies: [selectedPatient]
  });
  
  // Show errors as toasts if they occur
  useEffect(() => {
    if (patientsError) {
      toast({
        title: "Error loading patients",
        description: patientsError.message,
        variant: "destructive"
      });
    }
    
    if (sessionsError) {
      toast({
        title: "Error loading sessions",
        description: sessionsError.message,
        variant: "destructive"
      });
    }
    
    if (metricsError) {
      toast({
        title: "Error loading metrics",
        description: metricsError.message,
        variant: "destructive"
      });
    }
  }, [patientsError, sessionsError, metricsError]);
  
  // Handle patient selection
  const handlePatientSelect = (patientId: string) => {
    setSelectedPatient(patientId === selectedPatient ? null : patientId);
  };
  
  // Build metrics map for patient cards
  const metricsMap: Record<string, PatientMetrics | null> = {};
  
  if (selectedPatient && patientMetrics) {
    metricsMap[selectedPatient] = patientMetrics;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Track cognitive performance and patient progress.
          </p>
        </div>
      </div>
      
      {/* Patient cards grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {isLoadingPatients ? (
          Array(3).fill(0).map((_, i) => (
            <Card key={i} className="glass">
              <CardHeader>
                <Skeleton className="h-5 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent className="grid gap-4">
                <Skeleton className="h-4 w-16" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : patients?.length === 0 ? (
          <div className="col-span-full p-8 text-center">
            <p className="text-muted-foreground">No patients found</p>
          </div>
        ) : (
          patients?.map(patient => (
            <PatientCard
              key={patient.id}
              patient={patient}
              metrics={patientMetrics && selectedPatient === patient.id ? patientMetrics : null}
              onClick={() => handlePatientSelect(patient.id)}
              isSelected={selectedPatient === patient.id}
            />
          ))
        )}
      </div>
      
      {/* Patient details section */}
      {selectedPatient && (
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
      )}
    </div>
  );
};

export default Dashboard;
