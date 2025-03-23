
import { supabase } from '@/integrations/supabase/client';
import { Patient, PatientMetrics, ClinicalConcern } from '@/types/databaseTypes';
import { toast } from '@/hooks/use-toast';

// Fetch all patients
export const getPatients = async (): Promise<Patient[]> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching patients:', error);
    toast({
      title: 'Error fetching patients',
      description: (error as Error).message,
      variant: 'destructive'
    });
    return [];
  }
};

// Fetch a single patient by ID
export const getPatient = async (id: string): Promise<Patient | null> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching patient ${id}:`, error);
    toast({
      title: 'Error fetching patient',
      description: (error as Error).message,
      variant: 'destructive'
    });
    return null;
  }
};

// Create a new patient
export const createPatient = async (patient: Omit<Patient, 'id' | 'created_at'>): Promise<Patient | null> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .insert([patient])
      .select()
      .single();
    
    if (error) throw error;
    toast({
      title: 'Patient created',
      description: `${patient.name} has been added successfully.`
    });
    return data;
  } catch (error) {
    console.error('Error creating patient:', error);
    toast({
      title: 'Error creating patient',
      description: (error as Error).message,
      variant: 'destructive'
    });
    return null;
  }
};

// Update a patient
export const updatePatient = async (id: string, patient: Partial<Patient>): Promise<Patient | null> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .update(patient)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    toast({
      title: 'Patient updated',
      description: `Patient information has been updated successfully.`
    });
    return data;
  } catch (error) {
    console.error(`Error updating patient ${id}:`, error);
    toast({
      title: 'Error updating patient',
      description: (error as Error).message,
      variant: 'destructive'
    });
    return null;
  }
};

// Delete a patient
export const deletePatient = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast({
      title: 'Patient deleted',
      description: 'Patient has been removed successfully.'
    });
    return true;
  } catch (error) {
    console.error(`Error deleting patient ${id}:`, error);
    toast({
      title: 'Error deleting patient',
      description: (error as Error).message,
      variant: 'destructive'
    });
    return false;
  }
};

// Get patient metrics
export const getPatientMetrics = async (patientId: string): Promise<PatientMetrics | null> => {
  try {
    // First get the metrics
    const { data: metricsData, error: metricsError } = await supabase
      .from('patient_metrics')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: false })
      .limit(1)
      .single();
    
    if (metricsError) throw metricsError;
    
    if (!metricsData) return null;
    
    // Then get any clinical concerns
    const { data: concernsData, error: concernsError } = await supabase
      .from('clinical_concerns')
      .select('concern')
      .eq('patient_metric_id', metricsData.id);
      
    if (concernsError) throw concernsError;
    
    // Combine the data
    return {
      ...metricsData,
      clinical_concerns: concernsData?.map(c => c.concern) || []
    };
  } catch (error) {
    console.error(`Error fetching metrics for patient ${patientId}:`, error);
    return null;
  }
};

// Create patient metrics with concerns
export const createPatientMetrics = async (
  metrics: Omit<PatientMetrics, 'id' | 'created_at'>, 
  concerns: string[]
): Promise<PatientMetrics | null> => {
  try {
    // Start a transaction to insert metrics and concerns
    const { data: metricsData, error: metricsError } = await supabase
      .from('patient_metrics')
      .insert([{
        patient_id: metrics.patient_id,
        date: metrics.date,
        attention: metrics.attention,
        memory: metrics.memory,
        executive_function: metrics.executive_function,
        behavioral: metrics.behavioral,
        percentile: metrics.percentile,
        sessions_duration: metrics.sessions_duration,
        sessions_completed: metrics.sessions_completed,
        progress: metrics.progress
      }])
      .select()
      .single();
    
    if (metricsError) throw metricsError;
    
    // If we have concerns, insert them
    if (concerns.length > 0) {
      const concernsToInsert = concerns.map(concern => ({
        patient_metric_id: metricsData.id,
        concern
      }));
      
      const { error: concernsError } = await supabase
        .from('clinical_concerns')
        .insert(concernsToInsert);
        
      if (concernsError) throw concernsError;
    }
    
    toast({
      title: 'Metrics saved',
      description: 'Patient metrics have been saved successfully.'
    });
    
    return {
      ...metricsData,
      clinical_concerns: concerns
    };
  } catch (error) {
    console.error('Error creating patient metrics:', error);
    toast({
      title: 'Error saving metrics',
      description: (error as Error).message,
      variant: 'destructive'
    });
    return null;
  }
};
