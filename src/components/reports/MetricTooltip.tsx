
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface MetricTooltipProps {
  explanation: string;
  children: React.ReactNode;
}

export const MetricTooltip: React.FC<MetricTooltipProps> = ({ explanation, children }) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1.5 cursor-help">
            {children}
            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <p className="text-sm">{explanation}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
