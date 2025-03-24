
import { supabase } from '@/integrations/supabase/client';
import { Doctor } from '@/types/databaseTypes';
import { toast } from '@/hooks/use-toast';

// Fetch all doctors
export const getDoctors = async (): Promise<Doctor[]> => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching doctors:', error);
    toast({
      title: 'Error fetching doctors',
      description: (error as Error).message,
      variant: 'destructive'
    });
    return [];
  }
};

// Fetch a single doctor by ID
export const getDoctor = async (id: string): Promise<Doctor | null> => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching doctor ${id}:`, error);
    toast({
      title: 'Error fetching doctor',
      description: (error as Error).message,
      variant: 'destructive'
    });
    return null;
  }
};

// Create a new doctor
export const createDoctor = async (doctor: Omit<Doctor, 'id' | 'created_at'>): Promise<Doctor | null> => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .insert([doctor])
      .select()
      .single();
    
    if (error) throw error;
    toast({
      title: 'Doctor created',
      description: `${doctor.name} has been added successfully.`
    });
    return data;
  } catch (error) {
    console.error('Error creating doctor:', error);
    toast({
      title: 'Error creating doctor',
      description: (error as Error).message,
      variant: 'destructive'
    });
    return null;
  }
};

// Update a doctor
export const updateDoctor = async (id: string, doctor: Partial<Doctor>): Promise<Doctor | null> => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .update(doctor)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    toast({
      title: 'Doctor updated',
      description: `Doctor information has been updated successfully.`
    });
    return data;
  } catch (error) {
    console.error(`Error updating doctor ${id}:`, error);
    toast({
      title: 'Error updating doctor',
      description: (error as Error).message,
      variant: 'destructive'
    });
    return null;
  }
};

// Delete a doctor
export const deleteDoctor = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('doctors')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast({
      title: 'Doctor deleted',
      description: 'Doctor has been removed successfully.'
    });
    return true;
  } catch (error) {
    console.error(`Error deleting doctor ${id}:`, error);
    toast({
      title: 'Error deleting doctor',
      description: (error as Error).message,
      variant: 'destructive'
    });
    return false;
  }
};

// Assign a patient to a doctor
export const assignPatientToDoctor = async (doctorId: string, patientId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('doctor_patients')
      .insert([{ 
        doctor_id: doctorId, 
        patient_id: patientId
      }]);
    
    if (error) throw error;
    toast({
      title: 'Patient assigned',
      description: 'Patient has been assigned to the doctor successfully.'
    });
    return true;
  } catch (error) {
    console.error(`Error assigning patient to doctor:`, error);
    toast({
      title: 'Error assigning patient',
      description: (error as Error).message,
      variant: 'destructive'
    });
    return false;
  }
};

// Remove a patient from a doctor
export const removePatientFromDoctor = async (doctorId: string, patientId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('doctor_patients')
      .delete()
      .eq('doctor_id', doctorId)
      .eq('patient_id', patientId);
    
    if (error) throw error;
    toast({
      title: 'Patient removed',
      description: 'Patient has been removed from doctor successfully.'
    });
    return true;
  } catch (error) {
    console.error(`Error removing patient from doctor:`, error);
    toast({
      title: 'Error removing patient',
      description: (error as Error).message,
      variant: 'destructive'
    });
    return false;
  }
};

// Get all patients assigned to a doctor
export const getDoctorPatients = async (doctorId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('doctor_patients')
      .select(`
        id,
        assigned_date,
        patients:patient_id (*)
      `)
      .eq('doctor_id', doctorId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching doctor's patients:`, error);
    toast({
      title: 'Error fetching patients',
      description: (error as Error).message,
      variant: 'destructive'
    });
    return [];
  }
};

// Get all doctors assigned to a patient
export const getPatientDoctors = async (patientId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('doctor_patients')
      .select(`
        id,
        assigned_date,
        doctors:doctor_id (*)
      `)
      .eq('patient_id', patientId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching patient's doctors:`, error);
    toast({
      title: 'Error fetching doctors',
      description: (error as Error).message,
      variant: 'destructive'
    });
    return [];
  }
};
