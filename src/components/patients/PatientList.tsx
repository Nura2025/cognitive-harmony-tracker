
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientCard } from '@/components/dashboard/PatientCard';
import { useToast } from '@/hooks/use-toast';
import { patientAPI, patientMetricsAPI } from '@/api/apiClient';
import { useApiQuery } from '@/hooks/use-api-query';
import { Patient, PatientMetrics } from '@/types/databaseTypes';

interface PatientListProps {
  searchTerm?: string;
  activeFilters?: Record<string, boolean>;
}

export const PatientList: React.FC<PatientListProps> = ({ 
  searchTerm = '', 
  activeFilters = {} 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [metricsMap, setMetricsMap] = useState<Record<string, PatientMetrics>>({});
  
  // Fetch patients from API
  const { 
    data: patients, 
    isLoading, 
    error 
  } = useApiQuery<Patient[]>({
    queryFn: () => patientAPI.getAll(),
  });
  
  // Fetch patient metrics to associate with each patient
  const { 
    data: metrics,
    isLoading: isLoadingMetrics 
  } = useApiQuery<PatientMetrics[]>({
    queryFn: () => patientMetricsAPI.getAll(),
  });
  
  // Show error toast if API call fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading patients",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [error, toast]);
  
  // Create metrics mapping when data is loaded
  useEffect(() => {
    if (metrics) {
      const map: Record<string, PatientMetrics> = {};
      
      // Group by patient and take the most recent
      metrics.forEach(metric => {
        if (!map[metric.patient_id] || new Date(map[metric.patient_id].date) < new Date(metric.date)) {
          map[metric.patient_id] = metric;
        }
      });
      
      setMetricsMap(map);
    }
  }, [metrics]);
  
  // Filter patients based on search and active filters
  const filteredPatients = React.useMemo(() => {
    if (!patients) return [];
    
    return patients.filter(patient => {
      // Filter by search term (case insensitive)
      const matchesSearch = searchTerm 
        ? patient.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      
      // Filter by ADHD subtype
      const subtypeFilters = Object.entries(activeFilters)
        .filter(([key, value]) => key.startsWith('type-') && value)
        .map(([key]) => key.replace('type-', ''));
      
      const matchesSubtype = subtypeFilters.length > 0 
        ? subtypeFilters.includes(patient.adhd_subtype.toLowerCase())
        : true;
      
      // Filter by assessment status
      const hasRecentAssessment = metricsMap[patient.id]?.date
        ? new Date(metricsMap[patient.id].date).getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000) // 30 days
        : false;
      
      const needsAssessment = activeFilters['status-needs-assessment']
        ? !hasRecentAssessment
        : true;
      
      const hasAssessment = activeFilters['status-has-assessment']
        ? hasRecentAssessment
        : true;
      
      return matchesSearch && matchesSubtype && needsAssessment && hasAssessment;
    });
  }, [patients, searchTerm, activeFilters, metricsMap]);
  
  // Handle patient click to navigate to analysis
  const handlePatientClick = (patientId: string) => {
    navigate(`/analysis?patientId=${patientId}`);
  };
  
  // Display loading state
  if (isLoading || isLoadingMetrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="h-[230px] bg-muted rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }
  
  // Display no results message
  if (filteredPatients.length === 0) {
    return (
      <div className="bg-muted/40 rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium mb-2">No patients found</h3>
        <p className="text-muted-foreground mb-6">
          {searchTerm || Object.values(activeFilters).some(Boolean) 
            ? "Try adjusting your search or filters"
            : "Add some patients to get started"}
        </p>
      </div>
    );
  }
  
  // Display patient cards
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredPatients.map(patient => (
        <PatientCard 
          key={patient.id} 
          patient={patient} 
          metrics={metricsMap[patient.id]}
          onClick={handlePatientClick}
        />
      ))}
    </div>
  );
};
