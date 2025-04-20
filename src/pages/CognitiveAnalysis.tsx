
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CognitiveDomainChart } from '@/components/cognitive/CognitiveDomainChart';
import { DomainProgressChart } from '@/components/cognitive/DomainProgressChart';
import { DomainScoreCard } from '@/components/cognitive/DomainScoreCard';
import { ComponentBreakdown } from '@/components/cognitive/ComponentBreakdown';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  useCognitiveProfile, 
  useTimeSeriesData, 
  useNormativeComparison,
  useComponentDetails
} from '@/services/cognitiveService';
import { Skeleton } from '@/components/ui/skeleton';

type DomainType = 'attention' | 'memory' | 'executiveFunction' | 'impulseControl';

const CognitiveAnalysis = () => {
  const { t, language } = useLanguage();
  const [selectedDomain, setSelectedDomain] = useState<DomainType>('attention');
  const [selectedPeriod, setSelectedPeriod] = useState('90d');
  
  // Temporary user ID - In a real app, this would come from auth context or route params
  const userId = "example-user-id";
  
  // Fetch data using React Query
  const { data: profile, isLoading: profileLoading } = useCognitiveProfile(userId);
  const { data: timeSeriesData, isLoading: timeSeriesLoading } = useTimeSeriesData(userId, selectedDomain);
  const { data: normativeData } = useNormativeComparison(userId, selectedDomain);
  const { data: componentData } = useComponentDetails(profile?.session_id || '', selectedDomain);
  
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };
  
  const handleDomainCardClick = (domain: DomainType) => {
    setSelectedDomain(domain);
  };
  
  if (profileLoading) {
    return <div className="space-y-6"><Skeleton className="h-[400px]" /></div>;
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className={language === 'ar' ? 'text-right' : 'text-left'}>
        <h1 className="text-3xl font-bold mb-1">{t('cognitiveAnalysis')}</h1>
        <p className="text-muted-foreground">
          {t('cognitiveAnalysisDescription')}
        </p>
      </div>
      
      {/* Cognitive Domain Overview */}
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <CognitiveDomainChart
            userProfile={profile.domain_scores}
            normativeData={normativeData?.normative_comparison || {}}
            adhdComparison={normativeData?.adhd_comparison || {}}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(profile.domain_scores).map((domain) => (
              <DomainScoreCard
                key={domain}
                domain={domain as DomainType}
                score={profile.domain_scores[domain]}
                percentile={profile.percentiles[domain]}
                classification={profile.classifications[domain]}
                onClick={() => handleDomainCardClick(domain as DomainType)}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Domain-specific content */}
      <Tabs value={selectedDomain} onValueChange={(value) => setSelectedDomain(value as DomainType)}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="attention">{t('attention')}</TabsTrigger>
          <TabsTrigger value="memory">{t('memory')}</TabsTrigger>
          <TabsTrigger value="executiveFunction">{t('executiveFunction')}</TabsTrigger>
          <TabsTrigger value="impulseControl">{t('impulseControl')}</TabsTrigger>
        </TabsList>
        
        {Object.keys(profile?.domain_scores || {}).map((domain) => (
          <TabsContent key={domain} value={domain}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {timeSeriesData && (
                <DomainProgressChart
                  data={timeSeriesData}
                  domain={domain as DomainType}
                  onPeriodChange={handlePeriodChange}
                />
              )}
              
              {componentData && ['memory', 'impulseControl'].includes(domain) && (
                <ComponentBreakdown
                  data={Object.entries(componentData.components).map(([name, score]) => ({
                    name,
                    score: typeof score === 'number' ? score : (score as any).score
                  }))}
                  domain={domain as 'memory' | 'impulseControl'}
                />
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CognitiveAnalysis;
