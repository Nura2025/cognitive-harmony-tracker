
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
import { CognitiveDomain } from '@/utils/mockData';
import { getDomainName } from '@/utils/dataProcessing';

interface DomainComparisonProps {
  patientData: CognitiveDomain;
  normativeData?: CognitiveDomain;
  subtypeData?: CognitiveDomain;
}

export const DomainComparison: React.FC<DomainComparisonProps> = ({
  patientData,
  normativeData,
  subtypeData
}) => {
  // Process the data for the radar chart
  const domains = Object.keys(patientData) as (keyof CognitiveDomain)[];
  
  const chartData = domains.map(domain => {
    return {
      domain: getDomainName(domain),
      patient: patientData[domain] || 0, // Ensure we have a fallback value
      normative: normativeData?.[domain] || 50,
      subtype: subtypeData?.[domain] || 40
    };
  });
  
  return (
    <Card className="glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Cognitive Domain Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-primary mr-1.5" />
            <span className="text-xs">Patient</span>
          </div>
          {normativeData && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-muted-foreground/50 mr-1.5" />
              <span className="text-xs">Age-Based Normative</span>
            </div>
          )}
          {subtypeData && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-muted-foreground/20 mr-1.5" />
              <span className="text-xs">ADHD Subtype Average</span>
            </div>
          )}
        </div>
        
        <div className="h-[350px] w-full">
          {chartData.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius="75%" data={chartData}>
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
                
                {subtypeData && (
                  <Radar
                    name="ADHD Subtype Average"
                    dataKey="subtype"
                    stroke="hsl(var(--muted-foreground)/20)"
                    fill="hsl(var(--muted-foreground)/20)"
                    fillOpacity={0.5}
                  />
                )}
                
                {normativeData && (
                  <Radar
                    name="Age-Based Normative"
                    dataKey="normative"
                    stroke="hsl(var(--muted-foreground)/50)"
                    fill="hsl(var(--muted-foreground)/50)"
                    fillOpacity={0.5}
                  />
                )}
                
                <Radar
                  name="Patient"
                  dataKey="patient"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
