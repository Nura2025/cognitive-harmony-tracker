
import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { patients, metricsMap } from '@/utils/mockData';
import { PatientFilters } from '@/components/patients/PatientFilters';
import { PatientList } from '@/components/patients/PatientList';
import { useLanguage } from '@/contexts/LanguageContext';

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});
  const [filteredPatients, setFilteredPatients] = useState(patients);
  const { t, language } = useLanguage();
  
  // Filter patients based on search term and active filters
  useEffect(() => {
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
      result = result.filter(patient => activeSubtypes.includes(patient.adhdSubtype));
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
  }, [searchTerm, activeFilters]);
  
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
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
        <div className={language === 'ar' ? 'text-right' : 'text-left'}>
          <h1 className="text-3xl font-bold mb-1">{t('patients')}</h1>
          <p className="text-muted-foreground">
            {t('managePatientProfiles')}
          </p>
        </div>
        
        <Button className={`gap-1.5 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <PlusCircle className="h-4 w-4" />
          <span>{t('addPatient')}</span>
        </Button>
      </div>
      
      <PatientFilters 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />
      
      <PatientList 
        patients={filteredPatients} 
        metrics={metricsMap} 
      />
    </div>
  );
};

export default Patients;

