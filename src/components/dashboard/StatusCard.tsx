
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { formatPercentile, getScoreColorClass } from '@/utils/dataProcessing';
import { InfoTooltip } from '@/components/ui/info-tooltip';

interface StatusCardProps {
  title: string;
  value: number | string;
  isPercentile?: boolean;
  change?: { value: number; isImprovement: boolean };
  icon: React.ReactNode;
  tooltip?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  isPercentile = false,
  change,
  icon,
  tooltip
}) => {
  const formattedValue = isPercentile ? formatPercentile(value as number) : value;
  const colorClass = isPercentile ? getScoreColorClass(value as number) : '';
  
  return (
    <Card className="glass overflow-hidden">
      <CardContent className="p-3 sm:p-6">
        <div className="flex justify-between items-start">
          <div className="w-full">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
              {title}
              {tooltip && <InfoTooltip text={tooltip} size="sm" />}
            </p>
            <h4 className={`text-lg sm:text-2xl font-bold mt-1 ${colorClass} truncate`}>
              {formattedValue}
              {isPercentile && <span className="hidden sm:inline"> Percentile</span>}
              {isPercentile && <span className="sm:hidden"> %ile</span>}
            </h4>
            
            {change && (
              <div className="flex items-center mt-1 sm:mt-2">
                {change.isImprovement ? (
                  <div className="flex items-center text-emerald-600 text-xs sm:text-sm">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    <span>{change.value}%</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 text-xs sm:text-sm">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    <span>{change.value}%</span>
                  </div>
                )}
                <span className="text-muted-foreground text-xs ml-1.5 hidden sm:inline">from last month</span>
              </div>
            )}
          </div>
          
          <div className="p-1.5 sm:p-2 rounded-md bg-primary/10 text-primary flex-shrink-0 ml-2">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
