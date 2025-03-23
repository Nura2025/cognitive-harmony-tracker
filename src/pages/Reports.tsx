
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { patients, metricsMap, generateRecommendations } from '@/utils/mockData';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { formatDuration, formatPercentile, getScoreColorClass } from '@/utils/dataProcessing';
import { format } from 'date-fns';

const Reports = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState<string | null>(null);
  
  // Parse patient ID from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('patient');
    
    if (id && patients.some(p => p.id === id)) {
      setPatientId(id);
    } else if (patients.length > 0) {
      setPatientId(patients[0].id);
    }
  }, [location]);
  
  const handlePatientChange = (id: string) => {
    navigate(`/reports?patient=${id}`);
  };
  
  const handleBackToDashboard = () => {
    navigate('/');
  };
  
  // Find the current patient
  const currentPatient = patients.find(p => p.id === patientId);
  const patientMetrics = patientId ? metricsMap[patientId] : null;
  
  if (!currentPatient || !patientMetrics) {
    return <div>Loading...</div>;
  }
  
  const recommendations = generateRecommendations(patientMetrics);
  
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
          <h1 className="text-3xl font-bold mb-1">Clinical Reports</h1>
          <p className="text-muted-foreground">
            Generate and export assessment reports for clinical use
          </p>
        </div>
        
        <div className="min-w-[200px]">
          <Select value={patientId || ''} onValueChange={handlePatientChange}>
            <SelectTrigger>
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
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Patient Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">{currentPatient.name}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-muted-foreground">
                        {currentPatient.age} years old, {currentPatient.gender}
                      </span>
                      <Badge variant="outline" className="font-normal">
                        {currentPatient.adhdSubtype} ADHD
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-muted-foreground">Overall Percentile</span>
                    <span className={`text-2xl font-bold ${getScoreColorClass(patientMetrics.percentile)}`}>
                      {formatPercentile(patientMetrics.percentile)}
                    </span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-3">Assessment Overview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Session Count</p>
                      <p className="text-lg font-medium">{patientMetrics.sessionsCompleted}</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Duration</p>
                      <p className="text-lg font-medium">{formatDuration(patientMetrics.sessionsDuration * 60)}</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">First Assessment</p>
                      <p className="text-lg font-medium">{format(new Date(currentPatient.diagnosisDate), 'MM/dd/yyyy')}</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Last Assessment</p>
                      <p className="text-lg font-medium">{format(new Date(currentPatient.lastAssessment), 'MM/dd/yyyy')}</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-3">Cognitive Domain Scores</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {(Object.keys(patientMetrics) as Array<keyof typeof patientMetrics>)
                      .filter(key => ['attention', 'memory', 'executiveFunction', 'behavioral'].includes(key))
                      .map(domain => (
                        <div key={domain} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full bg-cognitive-${domain} mr-2`} />
                            <span className="text-sm">
                              {domain === 'executiveFunction' ? 'Executive Function' : 
                               domain.charAt(0).toUpperCase() + domain.slice(1)}
                            </span>
                          </div>
                          <span className={`font-medium ${getScoreColorClass(patientMetrics[domain])}`}>
                            {Math.round(patientMetrics[domain])}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <ReportGenerator patient={currentPatient} metrics={patientMetrics} />
        </div>
      </div>
    </div>
  );
};

export default Reports;
