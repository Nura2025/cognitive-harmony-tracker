
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { CognitiveDomain } from '@/utils/types/patientTypes';
import { NormativeComparisonData } from '@/services/normative';
import { mapDomainKey, processNormativeChartData } from './utils';
import { ChartLegend } from './ChartLegend';
import { NormativeRadarChart } from './NormativeRadarChart';
import { VisualizationSelector } from './VisualizationSelector';
import { DomainVisualizations } from './DomainVisualizations';
import { getDomainName } from '@/utils/dataProcessing';

interface NormativeTabProps {
  domains: (keyof CognitiveDomain)[];
  patientData: CognitiveDomain;
  normativeData?: CognitiveDomain;
  subtypeData?: CognitiveDomain;
  normativeComparison: Record<string, NormativeComparisonData | null>;
  isValidData: boolean;
  isLoading: boolean;
}

export const NormativeTab: React.FC<NormativeTabProps> = ({
  domains,
  patientData,
  normativeData,
  subtypeData,
  normativeComparison,
  isValidData,
  isLoading
}) => {
  const [visualization, setVisualization] = React.useState<'percentile' | 'zscore'>('percentile');
  
  const chartData = React.useMemo(() => {
    return processNormativeChartData(domains, patientData, normativeComparison, normativeData, subtypeData);
  }, [domains, patientData, normativeData, subtypeData, normativeComparison]);

  return (
    <CardContent>
      <div className="flex items-center justify-between mb-4">
        <ChartLegend subtypeData={!!subtypeData} />
        <VisualizationSelector value={visualization} onChange={setVisualization} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[350px] w-full">
          <NormativeRadarChart 
            data={chartData} 
            hasSubtypeData={!!subtypeData}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium mb-2">
            {visualization === 'percentile' ? 'Percentile Ranks' : 'Z-Score Comparison'}
          </h3>
          
          <DomainVisualizations
            visualization={visualization}
            domains={domains}
            normativeComparison={normativeComparison}
            mapDomainKey={mapDomainKey}
            getDomainName={getDomainName}
            loading={isLoading}
          />
        </div>
      </div>
    </CardContent>
  );
};
