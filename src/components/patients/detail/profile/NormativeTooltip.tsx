
import React from 'react';
import { NormativeComparisonData } from '@/services/normative';

interface NormativeTooltipProps {
  domain: string;
  data: NormativeComparisonData | undefined;
  isLoading: boolean;
}

// Helper functions for color coding based on percentile and z-score
export const getPercentileColor = (percentile: number) => {
  if (percentile < 16) return "text-red-500";
  if (percentile < 50) return "text-amber-500";
  if (percentile < 85) return "text-green-500";
  return "text-emerald-600";
};

export const getZScoreColor = (zScore: number) => {
  if (zScore < -2) return "text-red-500";
  if (zScore < -1) return "text-red-400";
  if (zScore < 0) return "text-amber-400";
  if (zScore < 1) return "text-amber-500";
  if (zScore < 2) return "text-green-500";
  return "text-emerald-600";
};

export const NormativeTooltip: React.FC<NormativeTooltipProps> = ({ 
  domain, 
  data, 
  isLoading 
}) => {
  if (isLoading) {
    return <p className="text-xs animate-pulse">Loading normative data...</p>;
  }
  
  if (!data) {
    return <p className="text-xs text-muted-foreground">No normative data available</p>;
  }
  
  const { normative_comparison } = data;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center border-b pb-1">
        <span className="text-sm font-medium">Normative Comparison</span>
        <span className="text-xs py-0.5 px-2 bg-muted rounded-full">
          {data.age_group}
        </span>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-xs text-muted-foreground">Percentile:</span>
          <span className={`text-xs font-medium ${getPercentileColor(normative_comparison.percentile)}`}>
            {normative_comparison.percentile.toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-muted-foreground">Z-Score:</span>
          <span className={`text-xs font-medium ${getZScoreColor(normative_comparison.z_score)}`}>
            {normative_comparison.z_score.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-muted-foreground">Mean Score:</span>
          <span className="text-xs font-medium">{normative_comparison.mean.toFixed(1)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-muted-foreground">Standard Deviation:</span>
          <span className="text-xs font-medium">{normative_comparison.standard_deviation.toFixed(2)}</span>
        </div>
      </div>
      
      {normative_comparison.reference && (
        <div className="pt-1 border-t text-[10px] text-muted-foreground italic">
          Reference: {normative_comparison.reference} (n={normative_comparison.sample_size})
        </div>
      )}
    </div>
  );
};
