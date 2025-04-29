import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { CognitiveDomain } from '@/utils/types/patientTypes';
import { SessionData } from '@/utils/mockData';
import { getDomainName } from '@/utils/dataProcessing';
import { BarChart } from 'lucide-react';
import { PercentileGauge } from './PercentileGauge';
import { ZScoreBar } from './ZScoreBar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import NormativeService, { NormativeComparisonData } from '@/services/normative';

interface DomainComparisonProps {
  patientData: CognitiveDomain;
  normativeData?: CognitiveDomain;
  subtypeData?: CognitiveDomain;
  sessions?: SessionData[];
  patientId?: string;
}

export const DomainComparison: React.FC<DomainComparisonProps> = ({
  patientData,
  normativeData,
  subtypeData,
  sessions = [],
  patientId
}) => {
  const domains = Object.keys(patientData) as (keyof CognitiveDomain)[];
  const [visualization, setVisualization] = useState<'percentile' | 'zscore'>('percentile');
  const [normativeComparison, setNormativeComparison] = useState<Record<string, NormativeComparisonData | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch normative comparison data when patientId is available
  useEffect(() => {
    if (patientId) {
      setIsLoading(true);
      
      const fetchData = async () => {
        try {
          // Fetch normative data for all domains
          const allData = await NormativeService.fetchAllNormativeData(patientId);
          setNormativeComparison(allData);
        } catch (error) {
          console.error("Failed to fetch normative comparison data:", error);
          // Set empty data as fallback
          setNormativeComparison({});
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [patientId]);
  
  const isValidData = domains.every(domain => 
    typeof patientData[domain] === 'number' && !isNaN(patientData[domain])
  );
  
  const normativeChartData = useMemo(() => {
    return domains.map(domain => {
      // Get patient's raw score
      const patientValue = typeof patientData[domain] === 'number' && !isNaN(patientData[domain]) 
        ? patientData[domain] 
        : 0;
      
      // Map domain keys to API domain names for normative data lookup
      const apiDomainKey = mapDomainKey(domain);
      const normData = normativeComparison[apiDomainKey];
      
      // Use normative mean from API data if available, otherwise fallback to provided normativeData
      const normativeMean = normData?.normative_comparison?.mean ?? 
        (normativeData && typeof normativeData[domain] === 'number' && !isNaN(normativeData[domain])
          ? normativeData[domain]
          : 50);
          
      const subtypeValue = subtypeData && typeof subtypeData[domain] === 'number' && !isNaN(subtypeData[domain])
        ? subtypeData[domain]
        : 40;
        
      return {
        domain: getDomainName(domain),
        patient: patientValue,
        normative: normativeMean,
        subtype: subtypeValue
      };
    });
  }, [domains, patientData, normativeData, subtypeData, normativeComparison]);
  
  const firstAndLastSession = useMemo(() => {
    if (!sessions || sessions.length < 2) {
      return null;
    }
    
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    
    const firstSession = sortedSessions[0];
    const lastSession = sortedSessions[sortedSessions.length - 1];
    
    return { firstSession, lastSession };
  }, [sessions]);
  
  const sessionComparisonData = useMemo(() => {
    if (!firstAndLastSession) return [];
    
    const { firstSession, lastSession } = firstAndLastSession;
    
    return domains.map(domain => {
      const firstValue = typeof firstSession.domainScores[domain] === 'number' 
        ? firstSession.domainScores[domain] 
        : 0;
        
      const lastValue = typeof lastSession.domainScores[domain] === 'number'
        ? lastSession.domainScores[domain]
        : 0;
        
      return {
        domain: getDomainName(domain),
        firstSession: firstValue,
        lastSession: lastValue
      };
    });
  }, [firstAndLastSession, domains]);
  
  const hasSessionData = firstAndLastSession !== null && sessionComparisonData.length > 0;
  
  // Helper function to map domain keys to API domain names
  const mapDomainKey = (key: keyof CognitiveDomain): string => {
    switch (key) {
      case 'attention': return 'attention';
      case 'memory': return 'memory';
      case 'executiveFunction': return 'executivefunction';
      case 'behavioral': return 'behavioral';
      default: return 'memory';
    }
  };
  
  return (
    <Tabs defaultValue="normative" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="normative">Normative Comparison</TabsTrigger>
        <TabsTrigger value="progress" disabled={!hasSessionData}>
          Progress Comparison
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="normative">
        <Card className="glass">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Cognitive Domain Comparison</CardTitle>
              <Select 
                value={visualization} 
                onValueChange={(value) => setVisualization(value as 'percentile' | 'zscore')}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Visualization Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentile">Percentile Gauges</SelectItem>
                  <SelectItem value="zscore">Z-Score Bars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary mr-1.5" />
                <span className="text-xs">Patient's Raw Score</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-400 mr-1.5" />
                <span className="text-xs">Normative Mean</span>
              </div>
              {subtypeData && (
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-400 mr-1.5" />
                  <span className="text-xs">ADHD Subtype Average</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-[350px] w-full">
                {normativeChartData.length > 0 && isValidData && (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius="75%" data={normativeChartData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis 
                        dataKey="domain" 
                        tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                        stroke="hsl(var(--border))"
                      />
                      
                      {subtypeData && (
                        <Radar
                          name="ADHD Subtype Average"
                          dataKey="subtype"
                          stroke="rgb(251, 191, 36)"
                          fill="rgb(251, 191, 36)"
                          fillOpacity={0.5}
                        />
                      )}
                      
                      <Radar
                        name="Normative Mean"
                        dataKey="normative"
                        stroke="rgb(96, 165, 250)"
                        fill="rgb(96, 165, 250)"
                        fillOpacity={0.5}
                      />
                      
                      <Radar
                        name="Patient's Raw Score"
                        dataKey="patient"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
                {(!normativeChartData.length || !isValidData) && (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No valid data available for visualization
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium mb-2">
                  {visualization === 'percentile' ? 'Percentile Ranks' : 'Z-Score Comparison'}
                </h3>
                
                {visualization === 'percentile' ? (
                  // Percentile Gauges
                  domains.map(domain => {
                    const apiDomain = mapDomainKey(domain);
                    const normData = normativeComparison[apiDomain];
                    const percentile = normData?.normative_comparison.percentile || 50;
                    
                    return (
                      <PercentileGauge
                        key={domain}
                        domain={getDomainName(domain)}
                        percentile={percentile}
                        normativeData={normData?.normative_comparison}
                        loading={isLoading}
                      />
                    );
                  })
                ) : (
                  // Z-Score Bars
                  domains.map(domain => {
                    const apiDomain = mapDomainKey(domain);
                    const normData = normativeComparison[apiDomain];
                    const zScore = normData?.normative_comparison.z_score || 0;
                    const percentile = normData?.normative_comparison.percentile || 50;
                    
                    return (
                      <ZScoreBar
                        key={domain}
                        domain={getDomainName(domain)}
                        zScore={zScore}
                        percentile={percentile}
                        normativeData={normData?.normative_comparison}
                        loading={isLoading}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="progress">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">First vs. Last Session Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {hasSessionData ? (
              <>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-1.5" />
                    <span className="text-xs">First Session</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-violet-500 mr-1.5" />
                    <span className="text-xs">Latest Session</span>
                  </div>
                </div>
                
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius="75%" data={sessionComparisonData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis 
                        dataKey="domain" 
                        tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                        stroke="hsl(var(--border))"
                      />
                      <Radar
                        name="First Session"
                        dataKey="firstSession"
                        stroke="rgb(16, 185, 129)"
                        fill="rgb(16, 185, 129)"
                        fillOpacity={0.5}
                      />
                      <Radar
                        name="Latest Session"
                        dataKey="lastSession"
                        stroke="rgb(139, 92, 246)"
                        fill="rgb(139, 92, 246)"
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                Not enough session data available for comparison
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
