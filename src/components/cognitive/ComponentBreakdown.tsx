
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface ComponentScoreData {
  name: string;
  score: number;
}

interface ComponentBreakdownProps {
  data: ComponentScoreData[];
  domain: 'memory' | 'impulseControl';
  title?: string;
  description?: string;
  className?: string;
}

export const ComponentBreakdown: React.FC<ComponentBreakdownProps> = ({
  data,
  domain,
  title,
  description,
  className
}) => {
  const { t, language } = useLanguage();
  
  // Get domain color based on the domain type
  const getDomainColor = (domain: string) => {
    const colors = {
      memory: 'rgb(96, 165, 250)',
      impulseControl: 'rgb(74, 222, 128)'
    };
    return colors[domain as keyof typeof colors] || 'hsl(var(--primary))';
  };
  
  const domainColor = getDomainColor(domain);
  const defaultTitle = t(`${domain}Components`);
  
  return (
    <Card className={`glass ${className}`}>
      <CardHeader className={`pb-2 ${language === 'ar' ? 'text-right' : ''}`}>
        <CardTitle className="text-lg">{title || defaultTitle}</CardTitle>
        {description && <CardDescription>{t(description)}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.map(item => ({ name: t(item.name), score: item.score }))}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              layout={language === 'ar' ? 'vertical' : 'horizontal'}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              {language === 'ar' ? (
                <>
                  <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="name" type="category" width={120} stroke="hsl(var(--muted-foreground))" />
                </>
              ) : (
                <>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                </>
              )}
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  boxShadow: 'var(--shadow)',
                  borderRadius: 'var(--radius)'
                }}
                formatter={(value: number) => [`${value}`, t('score')]}
              />
              <Bar dataKey="score" fill={domainColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
