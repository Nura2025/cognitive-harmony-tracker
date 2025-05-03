
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
import { CognitiveDomain } from '@/utils/mockData';
import { getDomainName } from '@/utils/dataProcessing';
import { InfoTooltip } from '@/components/ui/info-tooltip';

interface DomainChartProps {
  domainData: {
    attention: number[];
    memory: number[];
    executiveFunction: number[];
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
    behavioral: 'hsl(var(--cognitive-behavioral))'
  };

  // Domain descriptions for tooltips
  const domainDescriptions = {
    attention: "Ability to focus on specific stimuli while ignoring distractions",
    memory: "Capacity to encode, store, and retrieve information",
    executiveFunction: "Higher-order cognitive processes that control and coordinate other cognitive abilities",
    behavioral: "Impulse control and self-regulation behaviors"
  };

  return (
    <Card className="glass">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Cognitive Domain Trends</CardTitle>
          <InfoTooltip text="Performance trends across different cognitive domains over time" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 mb-3">
          {(Object.keys(domainData) as (keyof typeof domainData)[]).map(domain => (
            <div key={domain} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-1.5" 
                style={{ backgroundColor: domainColors[domain] }}
              />
              <span className="text-xs flex items-center gap-1">
                {getDomainName(domain as keyof CognitiveDomain)}
                <InfoTooltip 
                  text={domainDescriptions[domain]} 
                  size="sm"
                />
              </span>
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
              {/* Use a fixed numeric value instead of a variable for ReferenceLine */}
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
