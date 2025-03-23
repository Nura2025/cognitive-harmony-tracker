
import { supabase } from '@/integrations/supabase/client';
import { Session, Activity } from '@/types/databaseTypes';
import { toast } from '@/hooks/use-toast';

// Fetch sessions for a patient
export const getPatientSessions = async (patientId: string): Promise<Session[]> => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('patient_id', patientId)
      .order('start_time', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching sessions for patient ${patientId}:`, error);
    return [];
  }
};

// Fetch a single session with activities
export const getSessionWithActivities = async (sessionId: string): Promise<Session | null> => {
  try {
    // Get the session
    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();
    
    if (sessionError) throw sessionError;
    
    // Get activities for this session
    const { data: activitiesData, error: activitiesError } = await supabase
      .from('activities')
      .select('*')
      .eq('session_id', sessionId);
      
    if (activitiesError) throw activitiesError;
    
    // Combine the data
    return {
      ...sessionData,
      activities: activitiesData || []
    };
  } catch (error) {
    console.error(`Error fetching session ${sessionId}:`, error);
    return null;
  }
};

// Create a new session with activities
export const createSession = async (
  session: Omit<Session, 'id' | 'created_at'>, 
  activities: Omit<Activity, 'id' | 'session_id' | 'created_at'>[]
): Promise<Session | null> => {
  try {
    // Insert the session
    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions')
      .insert([{
        patient_id: session.patient_id,
        start_time: session.start_time,
        end_time: session.end_time,
        duration: session.duration,
        environment: session.environment,
        completion_status: session.completion_status,
        overall_score: session.overall_score,
        device: session.device,
        attention: session.attention,
        memory: session.memory,
        executive_function: session.executive_function,
        behavioral: session.behavioral
      }])
      .select()
      .single();
    
    if (sessionError) throw sessionError;
    
    // Insert activities if provided
    if (activities.length > 0) {
      const activitiesToInsert = activities.map(activity => ({
        session_id: sessionData.id,
        type: activity.type,
        score: activity.score,
        duration: activity.duration,
        difficulty: activity.difficulty
      }));
      
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .insert(activitiesToInsert)
        .select();
        
      if (activitiesError) throw activitiesError;
      
      sessionData.activities = activitiesData;
    }
    
    toast({
      title: 'Session created',
      description: 'The assessment session has been recorded successfully.'
    });
    
    return sessionData;
  } catch (error) {
    console.error('Error creating session:', error);
    toast({
      title: 'Error creating session',
      description: (error as Error).message,
      variant: 'destructive'
    });
    return null;
  }
};
