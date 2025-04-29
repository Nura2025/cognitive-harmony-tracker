
import React from 'react';
import { CognitiveDomain } from '@/components/analysis/CognitiveDomain';
import { CognitiveDomainMetrics } from '@/utils/types/patientTypes';
import { AnalysisLoading } from './AnalysisLoading';
import { PerformanceTrend } from '@/components/analysis/PerformanceTrend';

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
        <PerformanceTrend 
          data={domainTrendData.attention || []}
          title="Attention Domain"
          description="Focus and sustained attention"
          showDuration={true}
        />
        <PerformanceTrend 
          data={domainTrendData.memory || []}
          title="Memory Domain"
          description="Working and visual memory tasks"
          showDuration={true}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <PerformanceTrend 
          data={domainTrendData.executiveFunction || []}
          title="Executive Function Domain"
          description="Planning and cognitive flexibility"
          showDuration={true}
        />
        <PerformanceTrend 
          data={domainTrendData.behavioral || []}
          title="Impulse Control Domain"
          description="Response inhibition and control"
          showDuration={true}
        />
      </div>
    </>
  );
};
