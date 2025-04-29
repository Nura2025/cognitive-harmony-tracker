
import { CognitiveDomain } from '@/utils/types/patientTypes';
import { SessionData } from '@/utils/mockData';
import { getDomainName } from '@/utils/dataProcessing';

// Process data for the normative comparison radar chart
export const processNormativeChartData = (
  domains: (keyof CognitiveDomain)[],
  patientData: CognitiveDomain,
  normativeComparison: any,
  normativeData?: CognitiveDomain,
  subtypeData?: CognitiveDomain
) => {
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
};

// Process data for the progress comparison radar chart
export const processSessionComparisonData = (
  domains: (keyof CognitiveDomain)[],
  firstSession: SessionData,
  lastSession: SessionData
) => {
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
};

// Helper function to map domain keys to API domain names
export const mapDomainKey = (key: keyof CognitiveDomain): string => {
  switch (key) {
    case 'attention': return 'attention';
    case 'memory': return 'memory';
    case 'executiveFunction': return 'executivefunction';
    case 'behavioral': return 'behavioral';
    default: return 'memory';
  }
};
