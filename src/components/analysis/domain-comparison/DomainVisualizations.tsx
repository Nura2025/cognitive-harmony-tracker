
import React from 'react';
import { PercentileGauge } from '../percentile-gauge/PercentileGauge';
import { ZScoreBar } from '../z-score-bar/ZScoreBar';
import { NormativeComparisonData } from '@/services/normative';
import { CognitiveDomain } from '@/utils/types/patientTypes';

interface DomainVisualizationsProps {
  visualization: 'percentile' | 'zscore';
  domains: (keyof CognitiveDomain)[];
  normativeComparison: Record<string, NormativeComparisonData | null>;
  mapDomainKey: (key: keyof CognitiveDomain) => string;
  getDomainName: (key: keyof CognitiveDomain) => string;
  loading: boolean;
}

export const DomainVisualizations: React.FC<DomainVisualizationsProps> = ({
  visualization,
  domains,
  normativeComparison,
  mapDomainKey,
  getDomainName,
  loading
}) => {
  if (visualization === 'percentile') {
    return (
      <div className="space-y-4">
        {domains.map(domain => {
          const apiDomain = mapDomainKey(domain);
          const normData = normativeComparison[apiDomain];
          const percentile = normData?.normative_comparison?.percentile || 50;
          
          return (
            <PercentileGauge
              key={domain}
              domain={getDomainName(domain)}
              percentile={percentile}
              normativeData={normData?.normative_comparison}
              loading={loading}
            />
          );
        })}
      </div>
    );
  } 
  
  return (
    <div className="space-y-4">
      {domains.map(domain => {
        const apiDomain = mapDomainKey(domain);
        const normData = normativeComparison[apiDomain];
        const zScore = normData?.normative_comparison?.z_score || 0;
        const percentile = normData?.normative_comparison?.percentile || 50;
        
        return (
          <ZScoreBar
            key={domain}
            domain={getDomainName(domain)}
            zScore={zScore}
            percentile={percentile}
            normativeData={normData?.normative_comparison}
            loading={loading}
          />
        );
      })}
    </div>
  );
};
