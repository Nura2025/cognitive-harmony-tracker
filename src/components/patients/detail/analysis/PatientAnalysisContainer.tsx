import React from 'react';
import { TrendData } from '@/services/patient';
import { NoAnalysisData } from './NoAnalysisData';
import { AnalysisError } from './AnalysisError';
import { AnalysisLoading } from './AnalysisLoading';
import { AnalysisContent } from './AnalysisContent';

interface PatientAnalysisProps {
  trendGraph: TrendData[];
  hasTrendData: boolean;
}

export const PatientAnalysis: React.FC<PatientAnalysisProps> = ({ trendGraph, hasTrendData }) => {
  const [domainTrendData, setDomainTrendData] = React.useState<Record<string, any>>({});
  const [isLoadingDomainData, setIsLoadingDomainData] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  
  // Prepare data for components
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

  // Fetch domain data using React.useEffect hook
  React.useEffect(() => {
    const fetchDomainData = async () => {
      if (hasTrendData && trendGraph.length > 0) {
        setIsLoadingDomainData(true);
        setFetchError(null);
        
        // Import SessionService dynamically to avoid circular dependencies
        const SessionService = (await import('@/services/session')).default;
        
        // Get the latest session for fetching domain details
        const latestSession = trendGraph[trendGraph.length - 1];
        const sessionId = latestSession.session_id;
        
        console.log('PatientAnalysis - Fetching domain details for session ID:', sessionId);
        
        // Define the domain mapping between API endpoint names and our state keys
        const domainMapping = {
          'attention': 'attention',
          'memory': 'memory',
          'executive': 'executiveFunction',
          'behavioral': 'behavioral'
        };
        
        // Fetch all domain data in parallel with a single batch of requests
        const domainPromises = Object.entries(domainMapping).map(([apiDomain, stateDomain]) => ({
          apiDomain,
          stateDomain,
          promise: SessionService.getSessionDomainDetails(sessionId, apiDomain)
        }));
        
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
              const { apiDomain, stateDomain } = domainPromises[index];
              
              if (result.status === 'fulfilled' && result.value) {
                console.log(`PatientAnalysis - Successfully fetched ${apiDomain} data:`, result.value);
                newDomainData[stateDomain] = result.value.trendData || [];
              } else {
                console.error(`PatientAnalysis - Failed to fetch ${apiDomain} data:`, 
                  result.status === 'rejected' ? result.reason : 'No data returned');
                newDomainData[stateDomain] = [];
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
    };

    fetchDomainData();
  }, [hasTrendData, trendGraph]);
  
  const patientMetrics = createMetricsData();
  const performanceTrendData = createPerformanceTrendData();

  if (!hasTrendData) {
    return <NoAnalysisData />;
  }

  if (fetchError) {
    return <AnalysisError errorMessage={fetchError} />;
  }

  return (
    <AnalysisContent 
      patientMetrics={patientMetrics}
      normativeData={percentileData.ageGroup}
      subtypeData={percentileData.adhdSubtype}
      performanceTrendData={performanceTrendData}
      domainTrendData={domainTrendData}
      isLoadingDomainData={isLoadingDomainData}
    />
  );
};
