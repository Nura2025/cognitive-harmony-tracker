
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { CognitiveDomain, PatientMetrics } from '@/types/databaseTypes';
import { getDomainName, convertToDatabaseKey } from '@/utils/dataProcessing';

interface DomainChartProps {
  patient: string;
  isLoading: boolean;
  metrics: PatientMetrics | null;
}

export const DomainChart: React.FC<DomainChartProps> = ({ 
  patient, 
  isLoading,
  metrics 
}) => {
  // Create domain data structure from metrics if available
  const domainData = {
    attention: metrics ? [metrics.attention] : [],
    memory: metrics ? [metrics.memory] : [],
    executiveFunction: metrics ? [metrics.executive_function] : [],
    behavioral: metrics ? [metrics.behavioral] : [],
  };

  // Generate chart data from domain data
  const chartData = Array(10).fill(0).map((_, index) => {
    const dataPoint: Record<string, number | string> = { day: index + 1 };
    
    // For the first data point, use real data if available
    if (index === 0 && metrics) {
      dataPoint.attention = metrics.attention || 0;
      dataPoint.memory = metrics.memory || 0;
      dataPoint.executiveFunction = metrics.executive_function || 0;
      dataPoint.behavioral = metrics.behavioral || 0;
    } else {
      // For other points, use simulated trend data
      const randomFactor = 0.9 + Math.random() * 0.2; // Random factor between 0.9 and 1.1
      
      dataPoint.attention = metrics ? 
        Math.min(100, Math.max(0, Math.round((metrics.attention || 50) * randomFactor))) : 
        50;
        
      dataPoint.memory = metrics ? 
        Math.min(100, Math.max(0, Math.round((metrics.memory || 50) * randomFactor))) : 
        50;
        
      dataPoint.executiveFunction = metrics ? 
        Math.min(100, Math.max(0, Math.round((metrics.executive_function || 50) * randomFactor))) : 
        50;
        
      dataPoint.behavioral = metrics ? 
        Math.min(100, Math.max(0, Math.round((metrics.behavioral || 50) * randomFactor))) : 
        50;
    }
    
    return dataPoint;
  });

  // Customize domain colors
  const domainColors = {
    attention: 'hsl(var(--cognitive-attention))',
    memory: 'hsl(var(--cognitive-memory))',
    executiveFunction: 'hsl(var(--cognitive-executive))',
    behavioral: 'hsl(var(--cognitive-behavioral))'
  };

  if (isLoading) {
    return (
      <Card className="glass">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Cognitive Domain Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">Loading domain data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Cognitive Domain Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 mb-3">
          {(Object.keys(domainData) as (keyof typeof domainData)[]).map(domain => {
            const dbKey = convertToDatabaseKey(domain as string);
            return (
              <div key={domain} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-1.5" 
                  style={{ backgroundColor: domainColors[domain] }}
                />
                <span className="text-xs">{getDomainName(dbKey as keyof CognitiveDomain)}</span>
              </div>
            );
          })}
        </div>
        
        <div className="h-[300px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 5, left: 0, bottom: 0 }}
            >
              <defs>
                {(Object.keys(domainData) as (keyof typeof domainData)[]).map(domain => (
                  <linearGradient key={domain} id={`gradient-${domain}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={domainColors[domain]} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={domainColors[domain]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tickMargin={10}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                domain={[0, 100]} 
                tickMargin={10}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  boxShadow: 'var(--shadow)',
                  borderRadius: 'var(--radius)',
                  color: 'hsl(var(--foreground))'
                }}
                itemStyle={{ padding: '2px 0' }}
                formatter={(value: number) => [`${value}%`, '']}
                labelFormatter={(day) => `Day ${day}`}
              />
              <ReferenceLine y={60} stroke="hsl(var(--muted))" strokeDasharray="3 3" />
              
              {(Object.keys(domainData) as (keyof typeof domainData)[]).map(domain => (
                <Area
                  key={domain}
                  type="monotone"
                  dataKey={domain}
                  stroke={domainColors[domain]}
                  fillOpacity={1}
                  fill={`url(#gradient-${domain})`}
                  strokeWidth={2}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
