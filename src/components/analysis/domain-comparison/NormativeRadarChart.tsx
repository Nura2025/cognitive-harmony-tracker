
import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
import { CognitiveDomain } from '@/utils/types/patientTypes';

interface ChartDataPoint {
  domain: string;
  patient: number;
  normative: number;
  subtype?: number;
}

interface NormativeRadarChartProps {
  data: ChartDataPoint[];
  hasSubtypeData: boolean;
}

export const NormativeRadarChart: React.FC<NormativeRadarChartProps> = ({ 
  data, 
  hasSubtypeData 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No valid data available for visualization
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
        
        {hasSubtypeData && (
          <Radar
            name="ADHD Subtype Average"
            dataKey="subtype"
            stroke="rgb(251, 191, 36)"
            fill="rgb(251, 191, 36)"
            fillOpacity={0.5}
          />
        )}
        
        <Radar
          name="Normative Mean"
          dataKey="normative"
          stroke="rgb(96, 165, 250)"
          fill="rgb(96, 165, 250)"
          fillOpacity={0.5}
        />
        
        <Radar
          name="Patient's Raw Score"
          dataKey="patient"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.4}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};
