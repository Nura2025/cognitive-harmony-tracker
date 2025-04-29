import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartBar, AlertCircle } from 'lucide-react';
import { DomainComparison } from '@/components/analysis/DomainComparison';
import { PerformanceTrend } from '@/components/analysis/PerformanceTrend';
import { CognitiveDomain } from '@/components/analysis/CognitiveDomain';
import { TrendData } from '@/services/patient';
import SessionService from '@/services/session';

interface PatientAnalysisProps {
  trendGraph: TrendData[];
  hasTrendData: boolean;
}

export const PatientAnalysis: React.FC<PatientAnalysisProps> = ({ trendGraph, hasTrendData }) => {
  const [domainTrendData, setDomainTrendData] = useState<Record<string, any>>({});
  const [isLoadingDomainData, setIsLoadingDomainData] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Prepare data for PerformanceTrend component
  const prepareTrendData = (trendGraph: TrendData[] = []) => {
    return {
      attention: trendGraph.map(session => ({
        date: session.session_date,
        score: session.attention_score,
      })),
      memory: trendGraph.map(session => ({
        date: session.session_date,
        score: session.memory_score,
      })),
      impulse: trendGraph.map(session => ({
        date: session.session_date,
        score: session.impulse_score,
      })),
      executive: trendGraph.map(session => ({
        date: session.session_date,
        score: session.executive_score,
      })),
    };
  };

  // Fetch all domain data at once - optimized to make a single request for each domain
  useEffect(() => {
    if (hasTrendData && trendGraph.length > 0) {
      setIsLoadingDomainData(true);
      setFetchError(null);
      
      // Get the latest session for fetching domain details
      const latestSession = trendGraph[trendGraph.length - 1];
      const sessionId = latestSession.session_id;
      
      console.log('PatientAnalysis - Fetching domain details for session ID:', sessionId);
      
      // Fetch all domain data in parallel with a single batch of requests
      const domainPromises = [
        { domain: 'attention', promise: SessionService.getSessionDomainDetails(sessionId, 'attention') },
        { domain: 'memory', promise: SessionService.getSessionDomainDetails(sessionId, 'memory') },
        { domain: 'executive', promise: SessionService.getSessionDomainDetails(sessionId, 'executive') },
        { domain: 'behavioral', promise: SessionService.getSessionDomainDetails(sessionId, 'behavioral') }
      ];
      
      // Use Promise.allSettled to handle both successful and failed promises
      Promise.allSettled(domainPromises.map(item => item.promise))
        .then(results => {
          // Create a new object to store all domain data
          const newDomainData: Record<string, any> = {
            attention: [],
            memory: [],
            executiveFunction: [],
            behavioral: []
          };
          
          // Process results, keeping track of which succeeded and which failed
          results.forEach((result, index) => {
            const domainName = domainPromises[index].domain;
            const mappedDomain = domainName === 'executive' ? 'executiveFunction' : 
                               domainName === 'behavioral' ? 'behavioral' : domainName;
            
            if (result.status === 'fulfilled' && result.value) {
              console.log(`PatientAnalysis - Successfully fetched ${domainName} data:`, result.value);
              newDomainData[mappedDomain] = result.value.trendData || [];
            } else {
              console.error(`PatientAnalysis - Failed to fetch ${domainName} data:`, 
                result.status === 'rejected' ? result.reason : 'No data returned');
              newDomainData[mappedDomain] = [];
            }
          });
          
          // Update state with all domain data at once
          setDomainTrendData(newDomainData);
        })
        .catch(error => {
          console.error("PatientAnalysis - Error in domain data Promise.allSettled:", error);
          setFetchError("Failed to load one or more domain details");
        })
        .finally(() => {
          setIsLoadingDomainData(false);
        });
    } else {
      setIsLoadingDomainData(false);
    }
  }, [hasTrendData, trendGraph]);

  const trendData = prepareTrendData(trendGraph);
  
  // Create metrics data for DomainComparison
  const createMetricsData = () => {
    if (!hasTrendData || trendGraph.length === 0) return null;
    
    const latestSession = trendGraph[trendGraph.length - 1];
    return {
      attention: latestSession.attention_score,
      memory: latestSession.memory_score,
      executiveFunction: latestSession.executive_score,
      behavioral: latestSession.impulse_score
    };
  };
  
  const patientMetrics = createMetricsData();
  
  // Create percentile comparison data
  const percentileData = {
    ageGroup: {
      attention: 75,
      memory: 68,
      executiveFunction: 72,
      behavioral: 70
    },
    adhdSubtype: {
      attention: 60,
      memory: 55,
      executiveFunction: 58,
      behavioral: 52
    }
  };

  // Create performance trend data with validation
  const createPerformanceTrendData = () => {
    if (!hasTrendData) return [];
    
    return trendGraph.map(session => ({
      date: session.session_date,
      score: (session.attention_score + session.memory_score + 
              session.executive_score + session.impulse_score) / 4
    }));
  };

  const performanceTrendData = createPerformanceTrendData();

  if (!hasTrendData) {
    return (
      <Card className="glass md:col-span-2">
        <CardContent className="pt-6 flex flex-col items-center justify-center h-64">
          <ChartBar className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-1">No Analysis Data Available</h3>
          <p className="text-muted-foreground text-center">
            Detailed analysis will be available after the patient completes cognitive assessments.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Add error state display
  if (fetchError) {
    return (
      <Card className="glass md:col-span-2">
        <CardContent className="pt-6 flex flex-col items-center justify-center h-64">
          <AlertCircle className="h-10 w-10 text-rose-500 mb-2" />
          <h3 className="text-lg font-medium mb-1">Error Loading Analysis Data</h3>
          <p className="text-muted-foreground text-center">
            {fetchError}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid gap-6 md:grid-cols-2">
        {patientMetrics && (
          <DomainComparison 
            patientData={patientMetrics}
            normativeData={percentileData.ageGroup}
            subtypeData={percentileData.adhdSubtype}
          />
        )}
        <PerformanceTrend 
          data={performanceTrendData}
          title="Overall Performance Trend"
          description="Progress tracking across all cognitive metrics"
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {!isLoadingDomainData ? (
          <>
            <CognitiveDomain 
              domain="attention"
              score={patientMetrics?.attention || 0}
              trendData={domainTrendData.attention || []}
            />
            <CognitiveDomain 
              domain="memory"
              score={patientMetrics?.memory || 0}
              trendData={domainTrendData.memory || []}
            />
          </>
        ) : (
          <Card className="glass md:col-span-2">
            <CardContent className="pt-6 flex flex-col items-center justify-center h-64">
              <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium mb-1">Loading Domain Data</h3>
              <p className="text-muted-foreground text-center">
                Please wait while we fetch detailed domain analysis...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {!isLoadingDomainData ? (
          <>
            <CognitiveDomain 
              domain="executiveFunction"
              score={patientMetrics?.executiveFunction || 0}
              trendData={domainTrendData.executiveFunction || []}
            />
            <CognitiveDomain 
              domain="behavioral"
              score={patientMetrics?.behavioral || 0}
              trendData={domainTrendData.behavioral || []}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};
