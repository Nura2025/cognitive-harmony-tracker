import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SessionAnalysis } from '@/components/sessions/SessionAnalysis';
import { ActivityBreakdown } from '@/components/sessions/ActivityBreakdown';
import { useSupabaseQuery } from '@/hooks/use-supabase-query';
import { Patient, Session, Activity } from '@/types/databaseTypes';
import { supabase } from '@/integrations/supabase/client';

interface SessionWithActivities extends Session {
  activities: Activity[];
  domainScores: {
    attention: number;
    memory: number;
    executiveFunction: number;
    behavioral: number;
  };
}

const Sessions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  
  const { data: patients, isLoading: isLoadingPatients } = useSupabaseQuery<Patient[]>({
    table: 'patients',
    orderBy: { column: 'name' }
  });
  
  const { data: patientSessions, isLoading: isLoadingSessions } = useSupabaseQuery<Session[]>({
    table: 'sessions',
    filter: (query) => patientId ? query.eq('patient_id', patientId) : query.limit(0),
    orderBy: { column: 'start_time', ascending: false },
    enabled: !!patientId,
    dependencies: [patientId]
  });
  
  const { data: currentSession, isLoading: isLoadingSession } = useSupabaseQuery<Session>({
    table: 'sessions',
    filter: (query) => sessionId ? query.eq('id', sessionId) : query.limit(0),
    singleRow: true,
    enabled: !!sessionId,
    dependencies: [sessionId]
  });
  
  useEffect(() => {
    const fetchActivities = async () => {
      if (!sessionId) {
        setActivities([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('session_id', sessionId);
      
      if (error) {
        console.error('Error fetching activities:', error);
        return;
      }
      
      setActivities(data || []);
    };
    
    fetchActivities();
  }, [sessionId]);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pId = params.get('patient');
    const sId = params.get('session');
    
    if (pId) {
      setPatientId(pId);
      
      if (sId) {
        setSessionId(sId);
      }
    }
  }, [location]);
  
  useEffect(() => {
    if (patientSessions && patientSessions.length > 0 && !sessionId) {
      const defaultSessionId = patientSessions[0].id;
      navigate(`/sessions?patient=${patientId}&session=${defaultSessionId}`, { replace: true });
    }
  }, [patientSessions, patientId, sessionId, navigate]);
  
  const handlePatientChange = (id: string) => {
    navigate(`/sessions?patient=${id}`);
  };
  
  const handleSessionChange = (id: string) => {
    navigate(`/sessions?patient=${patientId}&session=${id}`);
  };
  
  const handleBackToDashboard = () => {
    navigate('/');
  };
  
  const sessionWithActivities: SessionWithActivities | null = currentSession 
    ? { 
        ...currentSession, 
        activities: activities,
        domainScores: {
          attention: currentSession.attention,
          memory: currentSession.memory,
          executiveFunction: currentSession.executive_function,
          behavioral: currentSession.behavioral
        }
      } 
    : null;
  
  const isLoading = isLoadingPatients || isLoadingSessions || isLoadingSession;
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-2 -ml-2 text-muted-foreground"
            onClick={handleBackToDashboard}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold mb-1">Session Analysis</h1>
          <p className="text-muted-foreground">
            Detailed breakdown of individual assessment sessions
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={patientId || ''} onValueChange={handlePatientChange}>
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Select a patient" />
            </SelectTrigger>
            <SelectContent>
              {patients?.map(patient => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={sessionId || ''} 
            onValueChange={handleSessionChange}
            disabled={!patientSessions || patientSessions.length === 0}
          >
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Select a session" />
            </SelectTrigger>
            <SelectContent>
              {patientSessions?.map((session, index) => (
                <SelectItem key={session.id} value={session.id}>
                  Session {index + 1} ({new Date(session.start_time).toLocaleDateString()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-[300px]">
          <p>Loading session data...</p>
        </div>
      ) : sessionWithActivities ? (
        <div className="grid gap-6 md:grid-cols-2">
          <SessionAnalysis session={sessionWithActivities} />
          <ActivityBreakdown session={sessionWithActivities} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-center">
            <h3 className="text-lg font-medium">No session data available</h3>
            <p className="text-muted-foreground">Select a patient with recorded sessions</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sessions;
