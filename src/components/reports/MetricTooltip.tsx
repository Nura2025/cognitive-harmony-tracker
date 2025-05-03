
import React from 'react';
import { InfoIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';

export interface MetricTooltipProps {
  explanation: string;
}

export const MetricTooltip: React.FC<MetricTooltipProps> = ({ explanation }) => {
  const { language } = useLanguage();
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <InfoIcon className={`inline-block h-4 w-4 cursor-help opacity-70 ${language === 'ar' ? 'mr-2' : 'ml-2'}`} />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className={language === 'ar' ? 'text-right' : 'text-left'}>{explanation}</p>
      </TooltipContent>
    </Tooltip>
  );
};
