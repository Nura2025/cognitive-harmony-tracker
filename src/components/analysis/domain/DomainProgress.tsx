
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DomainProgressProps {
  improvement: number;
}

export const DomainProgress: React.FC<DomainProgressProps> = ({ improvement }) => {
  return (
    <div className="flex items-center justify-between mt-1 mb-3">
      <div className="text-sm text-muted-foreground">
        90-day progress
      </div>
      <div className="flex items-center text-sm">
        {improvement > 0 ? (
          <Badge variant="outline" className="font-normal text-emerald-600 bg-emerald-50">
            +{improvement}% Improvement
          </Badge>
        ) : (
          <Badge variant="outline" className="font-normal text-amber-600 bg-amber-50">
            {improvement}% Change
          </Badge>
        )}
      </div>
    </div>
  );
};
