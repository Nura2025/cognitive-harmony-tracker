
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Clock, LineChart, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PatientCard } from '@/components/dashboard/PatientCard';
import { StatusCard } from '@/components/dashboard/StatusCard';
import { DomainChart } from '@/components/dashboard/DomainChart';
import { SessionTimeline } from '@/components/dashboard/SessionTimeline';
import { 
  useCognitiveProfile, 
  useTimeSeriesData 
} from '@/services/cognitiveService';

const Dashboard = () => {
  const navigate = useNavigate();
  // For demo purposes, using a fixed user ID - in a real app this would come from auth
  const userId = "example-user-id";
  
  // Fetch cognitive profile data
  const { data: profile, isLoading: profileLoading } = useCognitiveProfile(userId);
  const { data: timeSeriesData } = useTimeSeriesData(userId, 'attention');
  
  const handleViewAllPatients = () => {
    navigate('/patients');
  };
  
  // Format domain data for the chart
  const domainTrendData = profile?.domain_scores ? {
    attention: [profile.domain_scores.attention],
    memory: [profile.domain_scores.memory],
    executiveFunction: [profile.domain_scores.executive_function],
    impulseControl: [profile.domain_scores.impulse_control],
    behavioral: [Math.round((profile.domain_scores.impulse_control + profile.domain_scores.executive_function) / 2)] // Adding behavioral for backward compatibility
  } : {
    attention: [],
    memory: [],
    executiveFunction: [],
    impulseControl: [],
    behavioral: []
  };
  
  if (profileLoading) {
    return (
      <div className="space-y-8">
        <div className="h-[400px] animate-pulse bg-muted rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of cognitive assessment data and patient metrics
        </p>
      </div>
      
      {profile && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatusCard 
            title="Overall Score"
            value={Math.round(
              Object.values(profile.domain_scores).reduce((a, b) => a + b, 0) / 
              Object.values(profile.domain_scores).length
            )}
            isPercentile={true}
            icon={<Brain className="h-5 w-5" />}
          />
          <StatusCard 
            title="Average Percentile"
            value={Math.round(
              Object.values(profile.percentiles).reduce((a, b) => a + b, 0) / 
              Object.values(profile.percentiles).length
            )}
            isPercentile={true}
            icon={<LineChart className="h-5 w-5" />}
          />
          <StatusCard 
            title="Assessment Date"
            value={new Date(profile.session_date).toLocaleDateString()}
            icon={<Clock className="h-5 w-5" />}
          />
          <StatusCard 
            title="Age Group"
            value={profile.age_group}
            icon={<Users className="h-5 w-5" />}
          />
        </div>
      )}
      
      <div className="grid gap-6 md:grid-cols-2">
        <DomainChart domainData={domainTrendData} />
        {timeSeriesData && <SessionTimeline sessions={timeSeriesData} />}
      </div>
    </div>
  );
};

export default Dashboard;
