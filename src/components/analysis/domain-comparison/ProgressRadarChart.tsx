
import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';

interface ProgressDataPoint {
  domain: string;
  firstSession: number;
  lastSession: number;
}

interface ProgressRadarChartProps {
  data: ProgressDataPoint[];
}

export const ProgressRadarChart: React.FC<ProgressRadarChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No valid session data available for visualization
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart outerRadius="75%" data={data}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis 
          dataKey="domain" 
          tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 100]} 
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
          stroke="hsl(var(--border))"
        />
        <Radar
          name="First Session"
          dataKey="firstSession"
          stroke="rgb(16, 185, 129)"
          fill="rgb(16, 185, 129)"
          fillOpacity={0.5}
        />
        <Radar
          name="Latest Session"
          dataKey="lastSession"
          stroke="rgb(139, 92, 246)"
          fill="rgb(139, 92, 246)"
          fillOpacity={0.5}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};
