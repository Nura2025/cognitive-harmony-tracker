
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CardTitle } from '@/components/ui/card';
import { getDomainName, getDomainColor, getDomainBgColor, getScoreColorClass } from '@/utils/dataProcessing';

interface DomainHeaderProps {
  domain: string;
  score: number;
}

export const DomainHeader: React.FC<DomainHeaderProps> = ({ domain, score }) => {
  const colorClass = getDomainColor(String(domain));
  const bgColorClass = getDomainBgColor(String(domain));
  const scoreColorClass = getScoreColorClass(score);

  return (
    <div className={`${bgColorClass} pb-2`}>
      <div className="flex items-center justify-between">
        <CardTitle className={`text-lg ${colorClass}`}>
          {getDomainName(String(domain))}
        </CardTitle>
        <Badge className={`${scoreColorClass} bg-white`} variant="outline">
          {Math.round(score)}%
        </Badge>
      </div>
    </div>
  );
};
