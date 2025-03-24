
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  isPercentile?: boolean;
  change?: {
    value: number;
    isImprovement: boolean;
  };
  isLoading?: boolean;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  icon,
  isPercentile = false,
  change,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="h-5 w-16 bg-muted animate-pulse rounded-md"></div>
            </div>
            {icon && (
              <div className="p-2 rounded-full bg-muted/10">
                {icon}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-2xl font-bold">
                {isPercentile ? `${value}%` : value}
              </p>
              {change && (
                <span 
                  className={cn(
                    "text-xs font-medium",
                    change.isImprovement ? "text-emerald-500" : "text-rose-500"
                  )}
                >
                  {change.isImprovement ? '+' : '-'}{change.value}%
                </span>
              )}
            </div>
          </div>
          {icon && (
            <div className="p-2 rounded-full bg-muted/10">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
