
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

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
  // Get color based on percentile range
  const getColorClass = (value: number) => {
    if (value < 16) return "bg-red-500";
    if (value < 50) return "bg-amber-500";
    if (value < 85) return "bg-green-500";
    return "bg-emerald-600";
  };

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{domain}</span>
        <div className="flex items-center">
          <span className={`text-sm font-bold ${getTextColor(percentile)}`}>
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

const getTextColor = (percentile: number) => {
  if (percentile < 16) return "text-red-500";
  if (percentile < 50) return "text-amber-500";
  if (percentile < 85) return "text-green-500";
  return "text-emerald-600";
};
