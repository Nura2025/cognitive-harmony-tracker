import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Clock, LineChart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PatientCard } from '@/components/dashboard/PatientCard';
import { StatusCard } from '@/components/dashboard/StatusCard';
import { DomainChart } from '@/components/dashboard/DomainChart';
import { SessionTimeline } from '@/components/dashboard/SessionTimeline';
import PatientService from '@/services/patient';
import { sessionData } from '@/utils/mockData';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/contexts/UserContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userData } = useUser();
  const [patients, setPatients] = useState<any[]>([]);
  const [patientMetrics, setPatientMetrics] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  
  // For dashboard metrics
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [averagePercentile, setAveragePercentile] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  
  // Generate domain trends for the dashboard chart (using mock data for now)
  const domainData = {
    attention: Array(10).fill(0).map((_, i) => 50 + Math.random() * 30),
    memory: Array(10).fill(0).map((_, i) => 55 + Math.random() * 25),
    executiveFunction: Array(10).fill(0).map((_, i) => 45 + Math.random() * 35),
    behavioral: Array(10).fill(0).map((_, i) => 60 + Math.random() * 20),
  };

  // Fetch patients from the API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        // Use clinicianId from userData when available
        const clinicianId = userData?.id || "77a87318-00e6-4124-90ab-c0e72c3b2597";
        const patientList = await PatientService.getPatientsByClinician(clinicianId);
        
        // Get the total patient count directly from the API response length
        setTotalPatients(patientList.length);
        
        // Format patient data for display
        const formattedPatients = patientList.map((p: any) => {
          // Calculate age from date of birth if needed
          const birthDate = p.date_of_birth ? new Date(p.date_of_birth) : null;
          let age;
          if (birthDate) {
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }
          }
          
          return {
            user_id: p.user_id,
            name: p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim(),
            age,
            gender: p.gender,
            adhd_subtype: p.adhd_subtype,
            last_session_date: p.last_session_date,
            total_sessions: p.total_sessions || 0,
          };
        });
        
        // Get detailed profiles for each patient to extract metrics
        const metrics: Record<string, any> = {};
        const profilePromises = formattedPatients.slice(0, 8).map(async (patient: any) => {
          try {
            const profile = await PatientService.getPatientProfile(patient.user_id);
            // Calculate percentile as average of domain scores
            const domainScores = profile.avg_domain_scores || {};
            const scoreValues = Object.values(domainScores).filter(score => typeof score === 'number');
            const percentile = scoreValues.length > 0 
              ? Math.round(scoreValues.reduce((a: number, b: number) => a + b, 0) / scoreValues.length)
              : 0;
              
            metrics[patient.user_id] = {
              ...domainScores,
              percentile,
              // Mock progress data for now
              progress: Math.round(Math.random() * 15 + 5)
            };
            return profile;
          } catch (error) {
            console.error(`Error fetching profile for patient ${patient.user_id}:`, error);
            return null;
          }
        });
        
        // Wait for all profile requests to complete
        await Promise.all(profilePromises);
        
        // Display only the first 8 patients in the UI
        setPatients(formattedPatients.slice(0, 8));
        setPatientMetrics(metrics);
        
        // Calculate other dashboard metrics
        setTotalSessions(formattedPatients.reduce((sum, p) => sum + (p.total_sessions || 0), 0));
        
        const allPercentiles = Object.values(metrics).map((m: any) => m.percentile || 0);
        setAveragePercentile(
          allPercentiles.length > 0
            ? Math.round(allPercentiles.reduce((a: number, b: number) => a + b, 0) / allPercentiles.length)
            : 0
        );
        
        // Mock total minutes for now
        setTotalMinutes(Math.round(totalSessions * 15));
      } catch (error) {
        console.error("Failed to fetch patients:", error);
        toast({
          title: "Error Loading Data",
          description: "Failed to load patient data. Using sample data instead.",
          variant: "destructive",
        });
        
        // Fallback to mock data
        import('@/utils/mockData').then(({ patients, metricsMap }) => {
          setPatients(patients.slice(0, 4));
          setPatientMetrics(metricsMap);
          setTotalPatients(patients.length);
          setTotalSessions(sessionData.length);
          setAveragePercentile(75);
          setTotalMinutes(totalSessions * 15);
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [userData?.id, toast, totalSessions]);
  
  const handlePatientClick = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };
  
  const handleViewAllPatients = () => {
    navigate('/patients');
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8 animate-fade-in p-2 sm:p-4 md:p-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Overview of cognitive assessment data and patient metrics
          </p>
        </div>
        
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
          <Skeleton className="h-64 sm:h-80 w-full" />
          <Skeleton className="h-64 sm:h-80 w-full" />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Recent Patients</h2>
          </div>
          
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-48 sm:h-56 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in p-2 sm:p-4 md:p-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Overview of cognitive assessment data and patient metrics
        </p>
      </div>
      
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatusCard 
          title="Total Patients"
          value={totalPatients}
          icon={<Users className="h-4 sm:h-5 w-4 sm:w-5" />}
          tooltip="Total number of patients under your care"
        />
        <StatusCard 
          title="Average Percentile"
          value={averagePercentile}
          isPercentile={true}
          change={{ value: 12, isImprovement: true }}
          icon={<Brain className="h-4 sm:h-5 w-4 sm:w-5" />}
          tooltip="Average cognitive performance across all patients relative to their age group"
        />
        <StatusCard 
          title="Session Count"
          value={totalSessions}
          change={{ value: 8, isImprovement: true }}
          icon={<LineChart className="h-4 sm:h-5 w-4 sm:w-5" />}
          tooltip="Total number of assessment sessions conducted"
        />
        <StatusCard 
          title="Total Assessment Time"
          value={`${totalMinutes} mins`}
          icon={<Clock className="h-4 sm:h-5 w-4 sm:w-5" />}
          tooltip="Cumulative time spent across all assessment sessions"
        />
      </div>
      
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        <DomainChart domainData={domainData} />
        <SessionTimeline sessions={sessionData.slice(0, 10)} />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-lg sm:text-xl font-semibold">Recent Patients</h2>
          <Button variant="outline" size="sm" onClick={handleViewAllPatients} className="text-xs sm:text-sm">
            View all patients
          </Button>
        </div>
        
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {patients.length > 0 ? (
            patients.map(patient => (
              <PatientCard 
                key={patient.user_id} 
                patient={patient} 
                metrics={patientMetrics[patient.user_id] || {}}
                onClick={handlePatientClick}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No patients found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
