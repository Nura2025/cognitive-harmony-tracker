
import React from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface InfoTooltipProps {
  text: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ 
  text,
  size = 'md',
  className = '',
}) => {
  const iconSize = size === 'sm' ? 'h-3 w-3 sm:h-3.5 sm:w-3.5' : 'h-3.5 w-3.5 sm:h-4 sm:w-4';
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Info className={`${iconSize} text-muted-foreground cursor-help ${className}`} />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[150px] sm:max-w-xs text-xs sm:text-sm">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
