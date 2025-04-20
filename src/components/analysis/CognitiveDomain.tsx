
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DomainHeader } from './domain/DomainHeader';
import { DomainChart } from './domain/DomainChart';
import { DomainProgress } from './domain/DomainProgress';
import { DomainInsights } from './domain/DomainInsights';

type CognitiveDomainType = {
  attention: number;
  memory: number;
  executiveFunction: number;
  behavioral: number;
  impulseControl?: number;
};

interface CognitiveDomainProps {
  domain: keyof CognitiveDomainType;
  score: number;
  trendData: Array<{date: string; value: number}>;
}

// Helper function to get domain-specific insights
const getDomainInsights = (domain: string, score: number): string[] => {
  if (score < 60) {
    switch (domain) {
      case 'attention':
        return [
          'Difficulty maintaining sustained attention during extended tasks',
          'Increased susceptibility to distractions in the environment',
          'Inconsistent performance over time with fluctuating focus'
        ];
      case 'memory':
        return [
          'Challenges with working memory tasks requiring information retention',
          'Difficulty recalling sequential information accurately',
          'Better performance with visual memory compared to verbal memory'
        ];
      case 'executiveFunction':
        return [
          'Struggles with planning and organizing multi-step activities',
          'Difficulty adjusting to changing task requirements',
          'Challenges with inhibitory control in response-based activities'
        ];
      case 'behavioral':
      case 'impulseControl':
        return [
          'Exhibits impulsive responses before fully processing information',
          'Difficulty managing frustration during challenging tasks',
          'Inconsistent self-monitoring during extended activities'
        ];
      default:
        return [];
    }
  }
  
  // Return insights for scores >= 60
  switch (domain) {
    case 'attention':
      return [
        'Shows good sustained attention across multiple activities',
        'Successfully filters distractions during focused tasks',
        'Consistent performance across different attention requirements'
      ];
    case 'memory':
      return [
        'Strong working memory capabilities across varied tasks',
        'Effectively retains and manipulates information when needed',
        'Shows appropriate memory strategies during complex tasks'
      ];
    case 'executiveFunction':
      return [
        'Demonstrates effective planning and organizational skills',
        'Good cognitive flexibility when adapting to changing requirements',
        'Shows appropriate inhibitory control during challenging activities'
      ];
    case 'behavioral':
    case 'impulseControl':
      return [
        'Maintains appropriate response control during activities',
        'Manages frustration effectively during challenging segments',
        'Shows consistent self-monitoring throughout sessions'
      ];
    default:
      return [];
  }
};

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
