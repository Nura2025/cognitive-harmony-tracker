
import React from 'react';
import { getDomainColor } from '@/utils/dataProcessing';
import { Separator } from '@/components/ui/separator';

interface DomainInsightsProps {
  domain: string;
  insights: string[];
}

export const DomainInsights: React.FC<DomainInsightsProps> = ({ domain, insights }) => {
  const colorClass = getDomainColor(domain);
  
  return (
    <>
      <Separator className="my-4" />
      <div className="space-y-2">
        <h4 className="font-semibold">Key Observations</h4>
        <ul className="text-sm space-y-1.5">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 mr-2 ${colorClass}`} />
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
