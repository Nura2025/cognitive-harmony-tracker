
import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PatientFilters } from '@/components/patients/PatientFilters';
import { PatientList } from '@/components/patients/PatientList';
import { getPatients, getPatientMetrics } from '@/services/patientService';
import { Patient, PatientMetrics } from '@/types/databaseTypes';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Patients = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [metricsMap, setMetricsMap] = useState<Record<string, PatientMetrics>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch patients and their metrics from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const patientsData = await getPatients();
        setPatients(patientsData);
        
        // Fetch metrics for each patient
        const metricsData: Record<string, PatientMetrics> = {};
        for (const patient of patientsData) {
          const metrics = await getPatientMetrics(patient.id);
          if (metrics) {
            metricsData[patient.id] = metrics;
          }
        }
        
        setMetricsMap(metricsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast({
          title: 'Error loading patients',
          description: 'Failed to load patient data from the database.',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter patients based on search term and active filters
  useEffect(() => {
    if (patients.length === 0) return;
    
    let result = [...patients];
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(patient => 
        patient.name.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Apply subtype filters
    const activeSubtypes = Object.keys(activeFilters)
      .filter(key => key.startsWith('subtype-') && activeFilters[key])
      .map(key => key.replace('subtype-', ''));
    
    if (activeSubtypes.length > 0) {
      result = result.filter(patient => activeSubtypes.includes(patient.adhd_subtype));
    }
    
    // Apply age range filters
    const activeAgeRanges = Object.keys(activeFilters)
      .filter(key => key.startsWith('age-') && activeFilters[key])
      .map(key => key.replace('age-', ''));
    
    if (activeAgeRanges.length > 0) {
      result = result.filter(patient => {
        return activeAgeRanges.some(range => {
          const [min, max] = range.split('-').map(Number);
          return patient.age >= min && patient.age <= max;
        });
      });
    }
    
    setFilteredPatients(result);
  }, [searchTerm, activeFilters, patients]);
  
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
  
  const handleFilterChange = (key: string, value: boolean) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleResetFilters = () => {
    setActiveFilters({});
    setSearchTerm('');
  };
  
  const handleAddPatient = () => {
    navigate('/data-entry?tab=patient');
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Patients</h1>
          <p className="text-muted-foreground">
            Manage patient profiles and assessment data
          </p>
        </div>
        
        <Button className="gap-1.5" onClick={handleAddPatient}>
          <PlusCircle className="h-4 w-4" />
          <span>Add Patient</span>
        </Button>
      </div>
      
      <PatientFilters 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <p>Loading patients...</p>
        </div>
      ) : (
        <PatientList 
          patients={filteredPatients} 
          metrics={metricsMap} 
        />
      )}
    </div>
  );
};

export default Patients;
