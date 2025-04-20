
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
import { getDomainName } from '@/utils/dataProcessing';

interface DomainChartProps {
  domainData: {
    attention: number[];
    memory: number[];
    executiveFunction: number[];
    impulseControl: number[];
    behavioral: number[];
  };
}

export const DomainChart: React.FC<DomainChartProps> = ({ domainData }) => {
  // Convert domain data to a format suitable for the chart
  const chartData = Array(10).fill(0).map((_, index) => {
    const dataPoint: Record<string, number | string> = { day: index + 1 };
    (Object.keys(domainData) as (keyof typeof domainData)[]).forEach(domain => {
      // Ensure we have valid numbers in the dataset
      const value = domainData[domain][index];
      dataPoint[domain] = typeof value === 'number' && !isNaN(value) ? value : 0;
    });
    return dataPoint;
  });

  // Customize domain colors
  const domainColors = {
    attention: 'hsl(var(--cognitive-attention))',
    memory: 'hsl(var(--cognitive-memory))',
    executiveFunction: 'hsl(var(--cognitive-executive))',
    behavioral: 'hsl(var(--cognitive-behavioral))',
    impulseControl: 'hsl(var(--cognitive-impulse))'
  };

  return (
    <Card className="glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Cognitive Domain Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 mb-3">
          {(Object.keys(domainData) as (keyof typeof domainData)[]).map(domain => (
            <div key={String(domain)} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-1.5" 
                style={{ backgroundColor: domainColors[domain as keyof typeof domainColors] || '#888' }}
              />
              <span className="text-xs">{getDomainName(String(domain))}</span>
            </div>
          ))}
        </div>
        
        <div className="h-[300px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 5, left: 0, bottom: 0 }}
            >
              <defs>
                {(Object.keys(domainData) as (keyof typeof domainData)[]).map(domain => (
                  <linearGradient key={String(domain)} id={`gradient-${String(domain)}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={domainColors[domain as keyof typeof domainColors] || '#888'} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={domainColors[domain as keyof typeof domainColors] || '#888'} stopOpacity={0} />
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
              {/* Use a fixed numeric value instead of a variable for ReferenceLine */}
              <ReferenceLine y={60} stroke="hsl(var(--muted))" strokeDasharray="3 3" />
              
              {(Object.keys(domainData) as (keyof typeof domainData)[]).map(domain => (
                <Area
                  key={String(domain)}
                  type="monotone"
                  dataKey={String(domain)}
                  stroke={domainColors[domain as keyof typeof domainColors] || '#888'}
                  fillOpacity={1}
                  fill={`url(#gradient-${String(domain)})`}
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
