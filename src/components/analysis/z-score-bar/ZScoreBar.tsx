
import React from 'react';
import { 
  Tooltip,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { ZScoreTooltipContent } from './TooltipContent';
import { getZScoreTextColor, getZScoreBarColor, calculateBarStyles } from './utils';

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
  return (
    <div className="flex flex-col space-y-1 mb-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{domain}</span>
        <div className="flex items-center">
          <span className={`text-sm font-bold ${getZScoreTextColor(zScore)}`}>
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
                <ZScoreTooltipContent normativeData={normativeData} />
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
            className={`absolute top-0 h-full w-3 rounded-full ${getZScoreBarColor(zScore)}`} 
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
