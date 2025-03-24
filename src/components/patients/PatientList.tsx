
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientCard } from '@/components/dashboard/PatientCard';
import { useSupabaseQuery } from '@/hooks/use-supabase-query';
import { Patient, PatientMetrics } from '@/types/databaseTypes';
import { Button } from '@/components/ui/button';

interface PatientListProps {
  searchTerm: string;
  activeFilters: Record<string, boolean>;
}

export const PatientList: React.FC<PatientListProps> = ({ 
  searchTerm,
  activeFilters
}) => {
  const navigate = useNavigate();

  // Fetch all patients
  const { data: patients, isLoading: patientsLoading, error: patientsError } = useSupabaseQuery<Patient[]>({
    table: 'patients',
    orderBy: { column: 'name' }
  });

  // Fetch the latest metrics for each patient
  const { data: allMetrics, isLoading: metricsLoading } = useSupabaseQuery<PatientMetrics[]>({
    table: 'patient_metrics',
    orderBy: { column: 'date', ascending: false }
  });

  // Get the most recent metrics for each patient
  const patientMetrics = React.useMemo(() => {
    if (!allMetrics) return {};
    
    const metricsMap: Record<string, PatientMetrics> = {};
    
    // Group metrics by patient_id and take the most recent one
    allMetrics.forEach(metric => {
      if (!metricsMap[metric.patient_id] || 
          new Date(metric.date) > new Date(metricsMap[metric.patient_id].date)) {
        metricsMap[metric.patient_id] = metric;
      }
    });
    
    return metricsMap;
  }, [allMetrics]);

  // Apply filters to patients
  const filteredPatients = React.useMemo(() => {
    if (!patients) return [];
    
    return patients.filter(patient => {
      // Apply search filter
      if (searchTerm && !patient.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Apply active filters
      if (Object.keys(activeFilters).length > 0) {
        // Filter by ADHD Subtype
        if (activeFilters['inattentive'] && patient.adhd_subtype !== 'Inattentive') return false;
        if (activeFilters['hyperactive'] && patient.adhd_subtype !== 'Hyperactive-Impulsive') return false;
        if (activeFilters['combined'] && patient.adhd_subtype !== 'Combined') return false;
        
        // Filter by metrics severity (if we have metrics)
        const metrics = patientMetrics[patient.id];
        if (metrics) {
          if (activeFilters['severe'] && (metrics.percentile === null || metrics.percentile >= 40)) return false;
          if (activeFilters['moderate'] && (metrics.percentile === null || metrics.percentile < 40 || metrics.percentile >= 70)) return false;
          if (activeFilters['mild'] && (metrics.percentile === null || metrics.percentile < 70)) return false;
        } else if (activeFilters['severe'] || activeFilters['moderate'] || activeFilters['mild']) {
          return false;
        }
      }
      
      return true;
    });
  }, [patients, searchTerm, activeFilters, patientMetrics]);

  const handlePatientClick = (id: string) => {
    navigate(`/analysis?patientId=${id}`);
  };

  if (patientsLoading || metricsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div 
            key={i} 
            className="h-[220px] bg-card border rounded-md animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (patientsError) {
    return (
      <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
        <h3 className="font-medium mb-1">Error loading patients</h3>
        <p className="text-sm">{patientsError.message}</p>
      </div>
    );
  }

  if (!patients || patients.length === 0) {
    return (
      <div className="bg-muted border rounded-md p-8 text-center">
        <h3 className="font-medium mb-1">No patients found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Get started by adding your first patient.
        </p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/data-entry?tab=patient')}
        >
          Add Patient
        </Button>
      </div>
    );
  }

  if (filteredPatients.length === 0) {
    return (
      <div className="bg-muted border rounded-md p-8 text-center">
        <h3 className="font-medium mb-1">No matching patients</h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPatients.map(patient => (
        <PatientCard
          key={patient.id}
          patient={patient}
          metrics={patientMetrics[patient.id] || null}
          onClick={handlePatientClick}
        />
      ))}
    </div>
  );
};
