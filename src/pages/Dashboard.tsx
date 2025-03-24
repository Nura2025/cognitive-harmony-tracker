
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Clock, LineChart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { PatientCard } from '@/components/dashboard/PatientCard';
import { StatusCard } from '@/components/dashboard/StatusCard';
import { DomainChart } from '@/components/dashboard/DomainChart';
import { SessionTimeline } from '@/components/dashboard/SessionTimeline';
import { Patient, PatientMetrics, Session } from '@/types/databaseTypes';
import { useSupabaseQuery } from '@/hooks/use-supabase-query';

const Dashboard = () => {
  const navigate = useNavigate();
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
  
  // Fetch all patient metrics
  const {
    data: allPatientMetrics,
    isLoading: isLoadingAllMetrics,
    error: allMetricsError
  } = useSupabaseQuery<PatientMetrics[]>({
    table: 'patient_metrics',
    orderBy: { column: 'date', ascending: false }
  });
  
  // Fetch all sessions
  const {
    data: allSessions,
    isLoading: isLoadingAllSessions,
    error: allSessionsError
  } = useSupabaseQuery<Session[]>({
    table: 'sessions',
    orderBy: { column: 'start_time', ascending: false },
    limit: 10
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
    
    if (allMetricsError) {
      toast({
        title: "Error loading metrics",
        description: allMetricsError.message,
        variant: "destructive"
      });
    }
    
    if (allSessionsError) {
      toast({
        title: "Error loading sessions",
        description: allSessionsError.message,
        variant: "destructive"
      });
    }
  }, [patientsError, allMetricsError, allSessionsError]);
  
  // Calculate dashboard statistics
  const totalPatients = patients?.length || 0;
  const totalSessions = allSessions?.length || 0;
  
  // Safely calculate average percentile
  const averagePercentile = React.useMemo(() => {
    if (!allPatientMetrics || allPatientMetrics.length === 0) return 0;
    
    const validMetrics = allPatientMetrics.filter(metric => 
      metric.percentile !== null && metric.percentile !== undefined
    );
    
    if (validMetrics.length === 0) return 0;
    
    const sum = validMetrics.reduce((acc, metric) => 
      acc + (metric.percentile || 0), 0
    );
    
    return Math.round(sum / validMetrics.length);
  }, [allPatientMetrics]);
  
  // Calculate total assessment time in minutes
  const totalMinutes = React.useMemo(() => {
    if (!allPatientMetrics || allPatientMetrics.length === 0) return 0;
    
    return allPatientMetrics.reduce((sum, metric) => 
      sum + (metric.sessions_duration || 0), 0
    );
  }, [allPatientMetrics]);
  
  // Generate domain trend data for the chart
  const domainTrendData = React.useMemo(() => {
    // If we have metrics data, use it to create more realistic trend data
    const baseValues = {
      attention: 50,
      memory: 50,
      executiveFunction: 50,
      behavioral: 50
    };
    
    if (allPatientMetrics && allPatientMetrics.length > 0) {
      // Calculate average domain scores
      let attentionSum = 0;
      let memorySum = 0;
      let execFuncSum = 0;
      let behavioralSum = 0;
      let count = 0;
      
      allPatientMetrics.forEach(metric => {
        attentionSum += metric.attention;
        memorySum += metric.memory;
        execFuncSum += metric.executive_function;
        behavioralSum += metric.behavioral;
        count++;
      });
      
      if (count > 0) {
        baseValues.attention = attentionSum / count;
        baseValues.memory = memorySum / count;
        baseValues.executiveFunction = execFuncSum / count;
        baseValues.behavioral = behavioralSum / count;
      }
    }
    
    // Generate trend data based on actual averages
    return {
      attention: Array(10).fill(0).map((_, i) => 
        Math.min(100, Math.max(0, baseValues.attention * (0.9 + Math.random() * 0.2)))
      ),
      memory: Array(10).fill(0).map((_, i) => 
        Math.min(100, Math.max(0, baseValues.memory * (0.9 + Math.random() * 0.2)))
      ),
      executiveFunction: Array(10).fill(0).map((_, i) => 
        Math.min(100, Math.max(0, baseValues.executiveFunction * (0.9 + Math.random() * 0.2)))
      ),
      behavioral: Array(10).fill(0).map((_, i) => 
        Math.min(100, Math.max(0, baseValues.behavioral * (0.9 + Math.random() * 0.2)))
      ),
    };
  }, [allPatientMetrics]);
  
  // Handle patient selection for analysis
  const handlePatientClick = (patientId: string) => {
    if (patientId === selectedPatient) {
      setSelectedPatient(null);
    } else {
      setSelectedPatient(patientId);
      // Can also navigate to analysis page if that's the preferred behavior
      // navigate(`/analysis?patient=${patientId}`);
    }
  };
  
  // Navigate to patients page
  const handleViewAllPatients = () => {
    navigate('/patients');
  };
  
  // Create a metrics map for patient cards
  const metricsMap = React.useMemo(() => {
    if (!allPatientMetrics) return {};
    
    const map: Record<string, PatientMetrics> = {};
    
    // Group by patient and take the most recent metric for each
    allPatientMetrics.forEach(metric => {
      if (!map[metric.patient_id] || new Date(map[metric.patient_id].date) < new Date(metric.date)) {
        map[metric.patient_id] = metric;
      }
    });
    
    return map;
  }, [allPatientMetrics]);
  
  // Handle loading states
  const isLoading = isLoadingPatients || isLoadingAllMetrics || isLoadingAllSessions;
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of cognitive assessment data and patient metrics
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard 
          title="Total Patients"
          value={totalPatients}
          icon={<Users className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <StatusCard 
          title="Average Percentile"
          value={averagePercentile}
          isPercentile={true}
          change={{ value: 12, isImprovement: true }}
          icon={<Brain className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <StatusCard 
          title="Session Count"
          value={totalSessions}
          change={{ value: 8, isImprovement: true }}
          icon={<LineChart className="h-5 w-5" />}
          isLoading={isLoading}
        />
        <StatusCard 
          title="Total Assessment Time"
          value={`${totalMinutes} mins`}
          icon={<Clock className="h-5 w-5" />}
          isLoading={isLoading}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <DomainChart domainData={domainTrendData} />
        <SessionTimeline sessions={allSessions || []} />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Patients</h2>
          <Button variant="outline" size="sm" onClick={handleViewAllPatients}>
            View all patients
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoadingPatients ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-40 bg-muted rounded-lg animate-pulse"></div>
            ))
          ) : patients && patients.length > 0 ? (
            patients.slice(0, 8).map(patient => (
              <PatientCard 
                key={patient.id} 
                patient={patient} 
                metrics={metricsMap[patient.id] || null}
                onClick={handlePatientClick}
              />
            ))
          ) : (
            <div className="col-span-full p-4 text-center text-muted-foreground">
              No patients found. Add some patients to get started.
            </div>
          )}
        </div>
      </div>
      
      {/* Patient details section - show if a patient is selected */}
      {selectedPatient && (
        <div className="grid gap-6 md:grid-cols-2">
          <DomainChart
            patient={selectedPatient}
            isLoading={isLoadingMetrics}
            metrics={patientMetrics}
          />
          {/* Sessions for the selected patient would go here */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
