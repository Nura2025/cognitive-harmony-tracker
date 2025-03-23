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
import { patients, sessionsMap } from '@/utils/mockData';
import { SessionAnalysis } from '@/components/sessions/SessionAnalysis';
import { ActivityBreakdown } from '@/components/sessions/ActivityBreakdown';

const Sessions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // Parse patient ID and session ID from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pId = params.get('patient');
    const sId = params.get('session');
    
    if (pId && patients.some(p => p.id === pId)) {
      setPatientId(pId);
      
      // If there's also a session ID, set it if it belongs to this patient
      if (sId && sessionsMap[pId]?.some(s => s.id === sId)) {
        setSessionId(sId);
      } else if (sessionsMap[pId]?.length > 0) {
        // Otherwise, use the first session of this patient
        setSessionId(sessionsMap[pId][0].id);
      }
    } else if (patients.length > 0) {
      // Default to first patient if no valid patient ID provided
      const firstPatient = patients[0].id;
      setPatientId(firstPatient);
      
      if (sessionsMap[firstPatient]?.length > 0) {
        setSessionId(sessionsMap[firstPatient][0].id);
      }
    }
  }, [location]);
  
  const handlePatientChange = (id: string) => {
    if (sessionsMap[id]?.length > 0) {
      navigate(`/sessions?patient=${id}&session=${sessionsMap[id][0].id}`);
    } else {
      navigate(`/sessions?patient=${id}`);
    }
  };
  
  const handleSessionChange = (id: string) => {
    navigate(`/sessions?patient=${patientId}&session=${id}`);
  };
  
  const handleBackToDashboard = () => {
    navigate('/');
  };
  
  // Find the current patient and session
  const currentPatient = patients.find(p => p.id === patientId);
  const patientSessions = patientId ? sessionsMap[patientId] || [] : [];
  const currentSession = patientSessions.find(s => s.id === sessionId);
  
  if (!currentPatient || !currentSession) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-medium">No session data available</h3>
          <p className="text-muted-foreground">Select a patient with recorded sessions</p>
        </div>
      </div>
    );
  }
  
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
              {patients.map(patient => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sessionId || ''} onValueChange={handleSessionChange}>
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Select a session" />
            </SelectTrigger>
            <SelectContent>
              {patientSessions.map(session => (
                <SelectItem key={session.id} value={session.id}>
                  Session {session.id.split('-')[1]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <SessionAnalysis session={currentSession} />
        <ActivityBreakdown session={currentSession} />
      </div>
    </div>
  );
};

export default Sessions;
