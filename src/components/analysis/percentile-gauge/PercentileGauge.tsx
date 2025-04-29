
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { 
  Tooltip,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { PercentileTooltipContent } from './TooltipContent';
import { getTextColorClass, getColorClass } from './utils';

interface NormativeComparisonData {
  mean: number;
  standard_deviation: number;
  z_score: number;
  percentile: number;
  reference: string;
  sample_size: number;
}

interface PercentileGaugeProps {
  domain: string;
  percentile: number;
  normativeData?: NormativeComparisonData;
  loading?: boolean;
}

export const PercentileGauge: React.FC<PercentileGaugeProps> = ({ 
  domain, 
  percentile, 
  normativeData,
  loading = false
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{domain}</span>
        <div className="flex items-center">
          <span className={`text-sm font-bold ${getTextColorClass(percentile)}`}>
            {loading ? '—' : `${percentile.toFixed(1)}%`}
          </span>
          
          {normativeData && (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <button className="ml-1 focus:outline-none">
                    <InfoIcon className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                  </button>
                </TooltipTrigger>
                <PercentileTooltipContent normativeData={normativeData} />
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      
      <Progress
        value={loading ? 0 : percentile}
        indicatorClassName={loading ? "animate-pulse bg-muted-foreground/20" : getColorClass(percentile)}
        className="h-3 rounded-full"
      />
    </div>
  );
};
