
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CognitiveDomainChart } from '@/components/cognitive/CognitiveDomainChart';
import { DomainProgressChart } from '@/components/cognitive/DomainProgressChart';
import { DomainScoreCard } from '@/components/cognitive/DomainScoreCard';
import { ComponentBreakdown } from '@/components/cognitive/ComponentBreakdown';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock data for demonstration - would be replaced with API calls
const mockCognitiveProfile = {
  attention: 82,
  memory: 75,
  executiveFunction: 68,
  impulseControl: 79
};

const mockNormativeData = {
  attention: 85,
  memory: 80,
  executiveFunction: 75,
  impulseControl: 82
};

const mockAdhdComparison = {
  attention: 65,
  memory: 70,
  executiveFunction: 60,
  impulseControl: 55
};

const mockTimeSeriesData = [
  { date: '2025-03-01', value: 65 },
  { date: '2025-03-08', value: 68 },
  { date: '2025-03-15', value: 72 },
  { date: '2025-03-22', value: 75 },
  { date: '2025-03-29', value: 73 },
  { date: '2025-04-05', value: 78 },
  { date: '2025-04-12', value: 82 }
];

const mockMemoryComponents = [
  { name: 'workingMemory', score: 75 },
  { name: 'visualMemory', score: 82 },
  { name: 'sequencingMemory', score: 68 },
  { name: 'patternRecognition', score: 71 }
];

const mockImpulseControlComponents = [
  { name: 'inhibitoryControl', score: 79 },
  { name: 'responseControl', score: 72 },
  { name: 'decisionSpeed', score: 85 },
  { name: 'errorAdaptation', score: 68 }
];

type DomainType = 'attention' | 'memory' | 'executiveFunction' | 'impulseControl';

const CognitiveAnalysis = () => {
  const { t, language } = useLanguage();
  const [selectedDomain, setSelectedDomain] = useState<DomainType>('attention');
  const [selectedPeriod, setSelectedPeriod] = useState('90d');
  
  // In a real app, these would be API calls
  const fetchCognitiveProfile = async () => {
    // const response = await fetch('/api/cognitive/profile/{user_id}');
    // const data = await response.json();
    // Handle the data
  };
  
  useEffect(() => {
    fetchCognitiveProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    // In a real app, this would trigger a new API fetch
  };
  
  const handleDomainCardClick = (domain: DomainType) => {
    setSelectedDomain(domain);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className={language === 'ar' ? 'text-right' : 'text-left'}>
        <h1 className="text-3xl font-bold mb-1">{t('cognitiveAnalysis')}</h1>
        <p className="text-muted-foreground">
          {t('cognitiveAnalysisDescription')}
        </p>
      </div>
      
      {/* Cognitive Domain Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <CognitiveDomainChart
          userProfile={mockCognitiveProfile}
          normativeData={mockNormativeData}
          adhdComparison={mockAdhdComparison}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DomainScoreCard
            domain="attention"
            score={mockCognitiveProfile.attention}
            percentile={78}
            classification="good"
            improvement={5}
            onClick={() => handleDomainCardClick('attention')}
          />
          <DomainScoreCard
            domain="memory"
            score={mockCognitiveProfile.memory}
            percentile={65}
            classification="average"
            improvement={3}
            onClick={() => handleDomainCardClick('memory')}
          />
          <DomainScoreCard
            domain="executiveFunction"
            score={mockCognitiveProfile.executiveFunction}
            percentile={58}
            classification="average"
            improvement={-2}
            onClick={() => handleDomainCardClick('executiveFunction')}
          />
          <DomainScoreCard
            domain="impulseControl"
            score={mockCognitiveProfile.impulseControl}
            percentile={72}
            classification="good"
            improvement={7}
            onClick={() => handleDomainCardClick('impulseControl')}
          />
        </div>
      </div>
      
      {/* Domain-specific content */}
      <Tabs value={selectedDomain} onValueChange={(value) => setSelectedDomain(value as DomainType)}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="attention">{t('attention')}</TabsTrigger>
          <TabsTrigger value="memory">{t('memory')}</TabsTrigger>
          <TabsTrigger value="executiveFunction">{t('executiveFunction')}</TabsTrigger>
          <TabsTrigger value="impulseControl">{t('impulseControl')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attention">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DomainProgressChart
              data={mockTimeSeriesData}
              domain="attention"
              onPeriodChange={handlePeriodChange}
            />
            
            {/* Additional attention content here */}
          </div>
        </TabsContent>
        
        <TabsContent value="memory">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DomainProgressChart
              data={mockTimeSeriesData}
              domain="memory"
              onPeriodChange={handlePeriodChange}
            />
            <ComponentBreakdown
              data={mockMemoryComponents}
              domain="memory"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="executiveFunction">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DomainProgressChart
              data={mockTimeSeriesData}
              domain="executiveFunction"
              onPeriodChange={handlePeriodChange}
            />
            {/* Additional executive function content here */}
          </div>
        </TabsContent>
        
        <TabsContent value="impulseControl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DomainProgressChart
              data={mockTimeSeriesData}
              domain="impulseControl"
              onPeriodChange={handlePeriodChange}
            />
            <ComponentBreakdown
              data={mockImpulseControlComponents}
              domain="impulseControl"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CognitiveAnalysis;
