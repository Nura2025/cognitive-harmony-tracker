
import React from 'react';
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

interface ZScoreBarProps {
  domain: string;
  zScore: number;
  percentile: number;
  normativeData?: NormativeComparisonData;
  loading?: boolean;
}

export const ZScoreBar: React.FC<ZScoreBarProps> = ({
  domain,
  zScore,
  percentile,
  normativeData,
  loading = false
}) => {
  // Get color based on z-score
  const getBarColorClass = (value: number) => {
    if (value < -2) return "bg-red-500";
    if (value < -1) return "bg-red-400";
    if (value < 0) return "bg-amber-400";
    if (value < 1) return "bg-amber-500";
    if (value < 2) return "bg-green-500";
    return "bg-emerald-600";
  };

  // Calculate position and width for the z-score indicator
  const calculateBarStyles = (value: number) => {
    // Clamp z-score between -3 and 3 for visualization purposes
    const clampedValue = Math.max(-3, Math.min(3, value));
    
    // Convert z-score to position percentage (centered at 50% for z=0)
    // -3 => 0%, 0 => 50%, 3 => 100%
    const position = ((clampedValue + 3) / 6) * 100;
    
    return {
      left: `${position}%`,
      transform: 'translateX(-50%)'
    };
  };

  return (
    <div className="flex flex-col space-y-1 mb-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{domain}</span>
        <div className="flex items-center">
          <span className={`text-sm font-bold ${getTextColor(zScore)}`}>
            {loading ? '—' : `z = ${zScore.toFixed(2)} (${percentile.toFixed(1)}%)`}
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
                    <p><strong>Percentile:</strong> {normativeData.percentile.toFixed(1)}%</p>
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
      
      <div className="relative h-4 bg-muted rounded-full overflow-hidden">
        {/* Z-score scale markers */}
        <div className="absolute inset-0 flex justify-between px-1">
          <div className="h-full border-r border-muted-foreground/20" style={{left: '16.7%'}}></div>
          <div className="h-full border-r border-muted-foreground/40" style={{left: '33.3%'}}></div>
          <div className="h-full border-r border-muted-foreground/60" style={{left: '50%'}}></div>
          <div className="h-full border-r border-muted-foreground/40" style={{left: '66.7%'}}></div>
          <div className="h-full border-r border-muted-foreground/20" style={{left: '83.3%'}}></div>
        </div>
        
        {/* Z-score labels */}
        <div className="absolute w-full -bottom-4 flex justify-between text-xs text-muted-foreground px-1">
          <span style={{left: '0%', position: 'absolute', transform: 'translateX(-50%)'}}>-3</span>
          <span style={{left: '16.7%', position: 'absolute', transform: 'translateX(-50%)'}}>-2</span>
          <span style={{left: '33.3%', position: 'absolute', transform: 'translateX(-50%)'}}>-1</span>
          <span style={{left: '50%', position: 'absolute', transform: 'translateX(-50%)'}}>0</span>
          <span style={{left: '66.7%', position: 'absolute', transform: 'translateX(-50%)'}}>+1</span>
          <span style={{left: '83.3%', position: 'absolute', transform: 'translateX(-50%)'}}>+2</span>
          <span style={{left: '100%', position: 'absolute', transform: 'translateX(-50%)'}}>+3</span>
        </div>
        
        {/* Z-score indicator */}
        {!loading && (
          <div 
            className={`absolute top-0 h-full w-3 rounded-full ${getBarColorClass(zScore)}`} 
            style={calculateBarStyles(zScore)}
          ></div>
        )}
        
        {loading && (
          <div className="absolute inset-0 bg-muted-foreground/10 animate-pulse"></div>
        )}
      </div>
      <div className="h-4"></div> {/* Space for the labels below */}
    </div>
  );
};

const getTextColor = (zScore: number) => {
  if (zScore < -2) return "text-red-500";
  if (zScore < -1) return "text-red-400";
  if (zScore < 0) return "text-amber-400";
  if (zScore < 1) return "text-amber-500";
  if (zScore < 2) return "text-green-500";
  return "text-emerald-600";
};
