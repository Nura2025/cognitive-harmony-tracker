
import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PatientFilters } from '@/components/patients/PatientFilters';
import { PatientList } from '@/components/patients/PatientList';
import { useNavigate } from 'react-router-dom';

const Patients = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});
  
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
      
      <PatientList />
    </div>
  );
};

export default Patients;

