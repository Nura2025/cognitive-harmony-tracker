
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

interface CognitiveDomain {
  attention: number;
  memory: number;
  executiveFunction: number;
  impulseControl: number;
}

interface CognitiveDomainChartProps {
  userProfile: CognitiveDomain;
  normativeData?: CognitiveDomain;
  adhdComparison?: CognitiveDomain;
  title?: string;
  description?: string;
  className?: string;
}

export const CognitiveDomainChart: React.FC<CognitiveDomainChartProps> = ({
  userProfile,
  normativeData,
  adhdComparison,
  title = "Cognitive Domain Profile",
  description,
  className
}) => {
  const { t, language } = useLanguage();
  
  // Transform data for the radar chart
  const chartData = [
    { domain: t('attention'), user: userProfile.attention, normative: normativeData?.attention, adhd: adhdComparison?.attention },
    { domain: t('memory'), user: userProfile.memory, normative: normativeData?.memory, adhd: adhdComparison?.memory },
    { domain: t('executiveFunction'), user: userProfile.executiveFunction, normative: normativeData?.executiveFunction, adhd: adhdComparison?.executiveFunction },
    { domain: t('impulseControl'), user: userProfile.impulseControl, normative: normativeData?.impulseControl, adhd: adhdComparison?.impulseControl }
  ];

  return (
    <Card className={`glass ${className}`}>
      <CardHeader className={`pb-2 ${language === 'ar' ? 'text-right' : ''}`}>
        <CardTitle className="text-lg">{t(title)}</CardTitle>
        {description && <CardDescription>{t(description)}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className={`flex flex-wrap gap-4 mb-4 ${language === 'ar' ? 'justify-end' : 'justify-start'}`}>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-primary mr-1.5" />
            <span className="text-xs">{t('userProfile')}</span>
          </div>
          {normativeData && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-400 mr-1.5" />
              <span className="text-xs">{t('ageBasedNormative')}</span>
            </div>
          )}
          {adhdComparison && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-400 mr-1.5" />
              <span className="text-xs">{t('adhdComparison')}</span>
            </div>
          )}
        </div>
        
        <div className="h-[350px] w-full">
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
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  boxShadow: 'var(--shadow)',
                  borderRadius: 'var(--radius)'
                }}
                formatter={(value: number) => [`${value}`, '']}
              />
              
              {adhdComparison && (
                <Radar
                  name={t('adhdComparison')}
                  dataKey="adhd"
                  stroke="rgb(251, 191, 36)"
                  fill="rgb(251, 191, 36)"
                  fillOpacity={0.5}
                />
              )}
              
              {normativeData && (
                <Radar
                  name={t('ageBasedNormative')}
                  dataKey="normative"
                  stroke="rgb(96, 165, 250)"
                  fill="rgb(96, 165, 250)"
                  fillOpacity={0.5}
                />
              )}
              
              <Radar
                name={t('userProfile')}
                dataKey="user"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
