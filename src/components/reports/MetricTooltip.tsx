
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MetricTooltipProps {
  explanation: string;
  translationKey?: string;
  children: React.ReactNode;
}

export const MetricTooltip: React.FC<MetricTooltipProps> = ({ explanation, translationKey, children }) => {
  const { t, language } = useLanguage();
  const tooltipText = translationKey ? t(translationKey) : explanation;
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center gap-1.5 cursor-help ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            {children}
            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent 
          className="max-w-sm" 
          dir={language === 'ar' ? 'rtl' : 'ltr'}
          align={language === 'ar' ? 'end' : 'start'}
          side={language === 'ar' ? 'right' : 'left'}
        >
          <p className={`text-sm ${language === 'ar' ? 'text-right' : 'text-left'}`}>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
