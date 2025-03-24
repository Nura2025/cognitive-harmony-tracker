
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Clock, LineChart, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  patients, 
  patientMetrics, 
  metricsMap, 
  sessionData, 
  generateTrendData
} from '@/utils/mockData';
import { PatientCard } from '@/components/dashboard/PatientCard';
import { StatusCard } from '@/components/dashboard/StatusCard';
import { DomainChart } from '@/components/dashboard/DomainChart';
import { SessionTimeline } from '@/components/dashboard/SessionTimeline';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedPatients, setSelectedPatients] = useState(patients.slice(0, 4));
  
  // Calculate total metrics across all patients
  const totalPatients = patients.length;
  const totalSessions = sessionData.length;
  const averagePercentile = Math.round(
    patientMetrics.reduce((sum, metric) => sum + (metric.percentile || 0), 0) / patientMetrics.length
  );
  const totalMinutes = patientMetrics.reduce((sum, metric) => sum + metric.sessions_duration, 0);
  
  // Generate domain trends for the dashboard chart
  const domainTrendData = {
    attention: Array(10).fill(0).map((_, i) => 50 + Math.random() * 30),
    memory: Array(10).fill(0).map((_, i) => 55 + Math.random() * 25),
    executiveFunction: Array(10).fill(0).map((_, i) => 45 + Math.random() * 35),
    behavioral: Array(10).fill(0).map((_, i) => 60 + Math.random() * 20),
  };
  
  const handlePatientClick = (patientId: string) => {
    navigate(`/analysis?patient=${patientId}`);
  };
  
  const handleViewAllPatients = () => {
    navigate('/patients');
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of cognitive assessment data and patient metrics
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard 
          title="Total Patients"
          value={totalPatients}
          icon={<Users className="h-5 w-5" />}
        />
        <StatusCard 
          title="Average Percentile"
          value={averagePercentile}
          isPercentile={true}
          change={{ value: 12, isImprovement: true }}
          icon={<Brain className="h-5 w-5" />}
        />
        <StatusCard 
          title="Session Count"
          value={totalSessions}
          change={{ value: 8, isImprovement: true }}
          icon={<LineChart className="h-5 w-5" />}
        />
        <StatusCard 
          title="Total Assessment Time"
          value={`${totalMinutes} mins`}
          icon={<Clock className="h-5 w-5" />}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <DomainChart domainData={domainTrendData} />
        <SessionTimeline sessions={sessionData.slice(0, 10)} />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Patients</h2>
          <Button variant="outline" size="sm" onClick={handleViewAllPatients}>
            View all patients
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {selectedPatients.map(patient => (
            <PatientCard 
              key={patient.id} 
              patient={patient} 
              metrics={metricsMap[patient.id]}
              onClick={handlePatientClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
