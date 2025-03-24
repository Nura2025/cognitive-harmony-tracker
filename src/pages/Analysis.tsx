
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Calendar, CalendarClock, CheckCircle2, FileBarChart, History, UserRound } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  patients, 
  metricsMap, 
  sessionsMap,
  mockNormativeData,
  mockSubtypeData,
  generateTrendData,
  generatePercentileData,
  generateRecommendations
} from '@/utils/mockData';
import { DomainComparison } from '@/components/analysis/DomainComparison';
import { PerformanceTrend } from '@/components/analysis/PerformanceTrend';
import { CognitiveDomain } from '@/types/databaseTypes';
import { SessionTimeline } from '@/components/dashboard/SessionTimeline';

const Analysis = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');

  const [patient, setPatient] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [percentileData, setPercentileData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    if (!patientId) {
      navigate('/patients');
      return;
    }

    // Find the selected patient
    const selectedPatient = patients.find(p => p.id === patientId);
    if (!selectedPatient) {
      navigate('/patients');
      return;
    }

    setPatient(selectedPatient);

    // Get metrics for this patient
    const patientMetrics = metricsMap[patientId];
    setMetrics(patientMetrics);

    // Get sessions for this patient
    const patientSessions = sessionsMap[patientId] || [];
    setSessions(patientSessions);

    // Generate recommendations based on patient subtype
    if (patientMetrics && patientMetrics.adhd_subtype) {
      const recs = generateRecommendations(patientMetrics.adhd_subtype);
      setRecommendations(recs);
    } else {
      // Default recommendations if no subtype available
      setRecommendations(generateRecommendations());
    }

    // Generate percentile and trend data
    setPercentileData(generatePercentileData(patientMetrics));
    setTrendData(generateTrendData(patientSessions));
  }, [patientId, navigate]);

  if (!patient || !metrics) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading patient data...</p>
      </div>
    );
  }

  return (
    <div className="container p-4 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Cognitive Analysis</h1>
          <div className="flex items-center text-sm text-muted-foreground">
            <UserRound className="h-4 w-4 mr-1" />
            <span>{patient.first_name} {patient.last_name}</span>
            <span className="mx-2">•</span>
            <Calendar className="h-4 w-4 mr-1" />
            <span>Age: {patient.age}</span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/sessions?patientId=' + patient.id)}>
            <CalendarClock className="h-4 w-4 mr-2" />
            View Sessions
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/reports?patientId=' + patient.id)}>
            <FileBarChart className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ADHD Subtype</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.adhd_subtype || "Not Specified"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on cognitive assessment
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Severity Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.severity_level || "Not Assessed"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Overall condition severity
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {sessions.length > 0 
                ? `Latest: ${format(parseISO(sessions[sessions.length - 1].date), 'MMM d, yyyy')}`
                : "No sessions recorded"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Domain Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <DomainComparison 
              patientData={metrics} 
              normativeData={mockNormativeData}
              subtypeData={mockSubtypeData}
            />
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceTrend data={trendData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Session Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length > 0 ? (
              <SessionTimeline sessions={sessions} />
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <History className="h-8 w-8 mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-1">No Sessions Available</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  There are no therapy sessions recorded for this patient yet.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/data-entry?type=session&patientId=' + patient.id)}
                >
                  Record New Session
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Domain Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Attention Domain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="font-medium mb-2">Percentile Ranking</h4>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                    <div 
                      className="bg-blue-600 h-4 rounded-full" 
                      style={{ width: `${metrics.attention_percentile || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{metrics.attention_percentile || 0}%</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <h4 className="font-medium mb-2">Key Observations</h4>
                <p className="text-sm text-muted-foreground">
                  {metrics.attention_notes || "No specific observations recorded for attention domain."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Memory Domain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="font-medium mb-2">Percentile Ranking</h4>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                    <div 
                      className="bg-purple-600 h-4 rounded-full" 
                      style={{ width: `${metrics.memory_percentile || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{metrics.memory_percentile || 0}%</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <h4 className="font-medium mb-2">Key Observations</h4>
                <p className="text-sm text-muted-foreground">
                  {metrics.memory_notes || "No specific observations recorded for memory domain."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Executive Function Domain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="font-medium mb-2">Percentile Ranking</h4>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                    <div 
                      className="bg-green-600 h-4 rounded-full" 
                      style={{ width: `${metrics.executive_function_percentile || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{metrics.executive_function_percentile || 0}%</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <h4 className="font-medium mb-2">Key Observations</h4>
                <p className="text-sm text-muted-foreground">
                  {metrics.executive_function_notes || "No specific observations recorded for executive function domain."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Behavioral Domain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="font-medium mb-2">Percentile Ranking</h4>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                    <div 
                      className="bg-red-600 h-4 rounded-full" 
                      style={{ width: `${metrics.behavioral_percentile || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{metrics.behavioral_percentile || 0}%</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <h4 className="font-medium mb-2">Key Observations</h4>
                <p className="text-sm text-muted-foreground">
                  {metrics.behavioral_notes || "No specific observations recorded for behavioral domain."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
