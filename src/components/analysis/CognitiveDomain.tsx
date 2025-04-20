
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DomainHeader } from './domain/DomainHeader';
import { DomainChart } from './domain/DomainChart';
import { DomainProgress } from './domain/DomainProgress';
import { DomainInsights } from './domain/DomainInsights';
import { getDomainInsights } from '@/utils/domainInsights';
import { CognitiveDomainMetrics } from '@/utils/types/patientTypes';

interface CognitiveDomainProps {
  domain: keyof CognitiveDomainMetrics;
  score: number;
  trendData: Array<{date: string; value: number}>;
}

export const CognitiveDomain: React.FC<CognitiveDomainProps> = ({
  domain,
  score,
  trendData
}) => {
  const formattedTrendData = trendData.map(item => ({
    ...item,
    date: item.date.substring(5) // Remove year part
  }));
  
  const latestScore = formattedTrendData[formattedTrendData.length - 1]?.value || score;
  const firstScore = formattedTrendData[0]?.value || latestScore;
  const improvement = Math.round((latestScore - firstScore) * 10) / 10;
  
  const insights = getDomainInsights(String(domain), score);
  
  return (
    <Card className="glass overflow-hidden">
      <CardHeader className="p-0">
        <DomainHeader domain={String(domain)} score={score} />
      </CardHeader>
      <CardContent className="p-6">
        <DomainChart domain={String(domain)} data={formattedTrendData} />
        <DomainProgress improvement={improvement} />
        <DomainInsights domain={String(domain)} insights={insights} />
      </CardContent>
    </Card>
  );
};

export default CognitiveDomain;
