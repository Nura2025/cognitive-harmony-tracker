
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { TimeSeriesDataPoint } from '@/services/cognitiveService';

interface DomainProgressChartProps {
  data: TimeSeriesDataPoint[];
  domain: 'attention' | 'memory' | 'executiveFunction' | 'impulseControl';
  title?: string;
  description?: string;
  onPeriodChange?: (period: string) => void;
  className?: string;
}

export const DomainProgressChart: React.FC<DomainProgressChartProps> = ({
  data,
  domain,
  title,
  description,
  onPeriodChange,
  className
}) => {
  const { t, language } = useLanguage();
  
  // Get domain color based on the domain type
  const getDomainColor = (domain: string) => {
    const colors = {
      attention: 'hsl(var(--primary))',
      memory: 'rgb(96, 165, 250)',
      executiveFunction: 'rgb(251, 191, 36)',
      impulseControl: 'rgb(74, 222, 128)'
    };
    return colors[domain as keyof typeof colors] || colors.attention;
  };
  
  const domainColor = getDomainColor(domain);
  const defaultTitle = t(`${domain}Progress`);
  
  return (
    <Card className={`glass ${className}`}>
      <CardHeader className={`pb-2 ${language === 'ar' ? 'text-right' : ''}`}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title || defaultTitle}</CardTitle>
            {description && <CardDescription>{t(description)}</CardDescription>}
          </div>
          
          {onPeriodChange && (
            <div className="w-24">
              <Select onValueChange={onPeriodChange} defaultValue="90d">
                <SelectTrigger>
                  <SelectValue placeholder={t('period')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30d">30 {t('days')}</SelectItem>
                  <SelectItem value="60d">60 {t('days')}</SelectItem>
                  <SelectItem value="90d">90 {t('days')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />
              <YAxis 
                domain={[0, 100]} 
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  boxShadow: 'var(--shadow)',
                  borderRadius: 'var(--radius)'
                }}
                formatter={(value: number) => [`${value}`, t(domain)]}
                labelFormatter={(date) => new Date(date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke={domainColor}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--background))' }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
