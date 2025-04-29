
import React from 'react';
import { TooltipContent } from "@/components/ui/tooltip";
import { NormativeComparisonData } from '@/services/normative';

interface TooltipContentProps {
  normativeData: NormativeComparisonData['normative_comparison'];
}

export const PercentileTooltipContent: React.FC<TooltipContentProps> = ({ normativeData }) => {
  if (!normativeData) return null;
  
  return (
    <TooltipContent className="max-w-sm">
      <div className="space-y-1.5 text-xs">
        <p><strong>Mean:</strong> {normativeData.mean.toFixed(1)}</p>
        <p><strong>Standard Deviation:</strong> {normativeData.standard_deviation.toFixed(2)}</p>
        <p><strong>Z-Score:</strong> {normativeData.z_score.toFixed(2)}</p>
        <p><strong>Sample Size:</strong> {normativeData.sample_size}</p>
        {normativeData.reference && (
          <p className="text-muted-foreground italic"><strong>Reference:</strong> {normativeData.reference}</p>
        )}
      </div>
    </TooltipContent>
  );
};
