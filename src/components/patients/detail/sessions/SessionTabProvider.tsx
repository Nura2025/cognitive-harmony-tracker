
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendData } from '@/services/patient';
import { MemoryTab } from './MemoryTab';
import { AttentionTab } from './AttentionTab';
import { ImpulseTab } from './ImpulseTab';
import { ExecutiveTab } from './ExecutiveTab';
import { formatScore, getScoreColor, formatPercentile, getClassificationStyle } from './utils/scoreUtils';

interface SessionTabProviderProps {
  session: TrendData;
  expandedDomain: string | null;
  toggleDomainDetails: (domain: string) => void;
}

export const SessionTabProvider: React.FC<SessionTabProviderProps> = ({
  session,
  expandedDomain,
  toggleDomainDetails
}) => {
  const [activeTab, setActiveTab] = useState('memory');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // When tab changes, we set expandedDomain to the new tab value
    toggleDomainDetails(value);
  };

  return (
    <Tabs 
      defaultValue="memory" 
      className="w-full"
      onValueChange={handleTabChange}
      value={activeTab}
    >
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="memory">Memory</TabsTrigger>
        <TabsTrigger value="attention">Attention</TabsTrigger>
        <TabsTrigger value="impulse">Impulse</TabsTrigger>
        <TabsTrigger value="executive">Executive</TabsTrigger>
      </TabsList>
      
      {/* Memory Tab */}
      <TabsContent value="memory">
        <MemoryTab 
          session={session}
          expandedDomain={expandedDomain}
          toggleDomainDetails={toggleDomainDetails}
          getScoreColor={getScoreColor}
          formatScore={formatScore}
          formatPercentile={formatPercentile}
          getClassificationStyle={getClassificationStyle}
        />
      </TabsContent>
      
      {/* Attention Tab */}
      <TabsContent value="attention">
        <AttentionTab 
          session={session}
          expandedDomain={expandedDomain}
          toggleDomainDetails={toggleDomainDetails}
          getScoreColor={getScoreColor}
          formatScore={formatScore}
          formatPercentile={formatPercentile}
          getClassificationStyle={getClassificationStyle}
        />
      </TabsContent>
      
      {/* Impulse Tab */}
      <TabsContent value="impulse">
        <ImpulseTab 
          session={session}
          expandedDomain={expandedDomain}
          toggleDomainDetails={toggleDomainDetails}
          getScoreColor={getScoreColor}
          formatScore={formatScore}
          formatPercentile={formatPercentile}
          getClassificationStyle={getClassificationStyle}
        />
      </TabsContent>
      
      {/* Executive Tab */}
      <TabsContent value="executive">
        <ExecutiveTab 
          session={session}
          expandedDomain={expandedDomain}
          toggleDomainDetails={toggleDomainDetails}
          getScoreColor={getScoreColor}
          formatScore={formatScore}
          formatPercentile={formatPercentile}
          getClassificationStyle={getClassificationStyle}
        />
      </TabsContent>
    </Tabs>
  );
};
