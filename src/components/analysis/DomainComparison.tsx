
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
import { CognitiveDomain } from '@/types/databaseTypes';
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
  
  // Validate that all patient data is numeric and not NaN
  const isValidData = domains.every(domain => 
    typeof patientData[domain] === 'number' && !isNaN(patientData[domain])
  );
  
  // Create safe chart data with fallbacks for missing or invalid values
  const chartData = domains.map(domain => {
    // Ensure all values are valid numbers
    const patientValue = typeof patientData[domain] === 'number' && !isNaN(patientData[domain]) 
      ? patientData[domain] 
      : 0;
    
    const normativeValue = normativeData && typeof normativeData[domain] === 'number' && !isNaN(normativeData[domain])
      ? normativeData[domain]
      : 50;
      
    const subtypeValue = subtypeData && typeof subtypeData[domain] === 'number' && !isNaN(subtypeData[domain])
      ? subtypeData[domain]
      : 40;
      
    return {
      domain: getDomainName(domain),
      patient: patientValue,
      normative: normativeValue,
      subtype: subtypeValue
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
              <div className="w-3 h-3 rounded-full bg-blue-400 mr-1.5" />
              <span className="text-xs">Age-Based Normative</span>
            </div>
          )}
          {subtypeData && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-400 mr-1.5" />
              <span className="text-xs">ADHD Subtype Average</span>
            </div>
          )}
        </div>
        
        <div className="h-[350px] w-full">
          {chartData.length > 0 && isValidData && (
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
                    stroke="rgb(251, 191, 36)"
                    fill="rgb(251, 191, 36)"
                    fillOpacity={0.5}
                  />
                )}
                
                {normativeData && (
                  <Radar
                    name="Age-Based Normative"
                    dataKey="normative"
                    stroke="rgb(96, 165, 250)"
                    fill="rgb(96, 165, 250)"
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
          {(!chartData.length || !isValidData) && (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No valid data available for visualization
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
