
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowDown, ArrowUp, Brain, Activity, Lightbulb, Gauge } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DomainScoreCardProps {
  domain: 'attention' | 'memory' | 'executiveFunction' | 'impulseControl';
  score: number;
  percentile: number;
  classification: string;
  improvement?: number;
  onClick?: () => void;
  className?: string;
}

export const DomainScoreCard: React.FC<DomainScoreCardProps> = ({
  domain,
  score,
  percentile,
  classification,
  improvement,
  onClick,
  className
}) => {
  const { t, language } = useLanguage();
  
  // Get domain color and icon based on the domain type
  const getDomainIcon = (domain: string) => {
    const icons = {
      attention: <Activity className="h-6 w-6" />,
      memory: <Brain className="h-6 w-6" />,
      executiveFunction: <Lightbulb className="h-6 w-6" />,
      impulseControl: <Gauge className="h-6 w-6" />
    };
    return icons[domain as keyof typeof icons] || icons.attention;
  };
  
  const getDomainColorClass = (domain: string) => {
    const colors = {
      attention: 'text-primary bg-primary/10',
      memory: 'text-blue-500 bg-blue-500/10',
      executiveFunction: 'text-amber-500 bg-amber-500/10',
      impulseControl: 'text-green-500 bg-green-500/10'
    };
    return colors[domain as keyof typeof colors] || colors.attention;
  };
  
  const getClassificationColorClass = (classification: string) => {
    const colors = {
      excellent: 'text-emerald-500',
      good: 'text-blue-500',
      average: 'text-amber-500',
      belowAverage: 'text-orange-500',
      concern: 'text-red-500'
    };
    return colors[classification as keyof typeof colors] || '';
  };
  
  return (
    <Card 
      className={`glass overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className={`flex items-start justify-between ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className={language === 'ar' ? 'text-right' : ''}>
            <div className="flex items-center mb-2 gap-1.5">
              <div className={`p-2 rounded-md ${getDomainColorClass(domain)}`}>
                {getDomainIcon(domain)}
              </div>
              <h3 className="text-lg font-semibold">{t(domain)}</h3>
            </div>
            
            <div className="space-y-2 mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{score}</span>
                <span className="text-muted-foreground text-sm">{t('rawScore')}</span>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">{t('percentile')}</span>
                  <span className="text-sm font-medium">{percentile}%</span>
                </div>
                <Progress value={percentile} className="h-2" />
              </div>
              
              <div>
                <span className={`text-sm font-medium ${getClassificationColorClass(classification)}`}>
                  {t(classification)}
                </span>
              </div>
              
              {improvement !== undefined && (
                <div className="flex items-center mt-2">
                  {improvement >= 0 ? (
                    <div className="flex items-center text-emerald-600 text-sm">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      <span>{improvement}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600 text-sm">
                      <ArrowDown className="h-3 w-3 mr-1" />
                      <span>{Math.abs(improvement)}%</span>
                    </div>
                  )}
                  <span className="text-muted-foreground text-xs ml-1.5">{t('fromLastAssessment')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
