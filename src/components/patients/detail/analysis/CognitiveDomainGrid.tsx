
import React from 'react';
import { CognitiveDomain } from '@/components/analysis/CognitiveDomain';
import { CognitiveDomainMetrics } from '@/utils/types/patientTypes';
import { AnalysisLoading } from './AnalysisLoading';

interface CognitiveDomainGridProps {
  patientMetrics: CognitiveDomainMetrics | null;
  domainTrendData: Record<string, any>;
  isLoadingDomainData: boolean;
}

export const CognitiveDomainGrid: React.FC<CognitiveDomainGridProps> = ({
  patientMetrics,
  domainTrendData,
  isLoadingDomainData
}) => {
  if (isLoadingDomainData) {
    return <AnalysisLoading />;
  }
  
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
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
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
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
      </div>
    </>
  );
};
