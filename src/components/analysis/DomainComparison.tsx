
import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CognitiveDomain } from '@/utils/types/patientTypes';
import { SessionData } from '@/utils/mockData';
import NormativeService, { NormativeComparisonData } from '@/services/normative';
import { NormativeTab } from './domain-comparison/NormativeTab';
import { ProgressTab } from './domain-comparison/ProgressTab';
import { mapDomainKey } from './domain-comparison/utils';

interface DomainComparisonProps {
  patientData: CognitiveDomain;
  normativeData?: CognitiveDomain;
  subtypeData?: CognitiveDomain;
  sessions?: SessionData[];
  patientId?: string;
}

export const DomainComparison: React.FC<DomainComparisonProps> = ({
  patientData,
  normativeData,
  subtypeData,
  sessions = [],
  patientId
}) => {
  const domains = Object.keys(patientData) as (keyof CognitiveDomain)[];
  const [normativeComparison, setNormativeComparison] = useState<Record<string, NormativeComparisonData | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch normative comparison data when patientId is available
  useEffect(() => {
    if (patientId) {
      setIsLoading(true);
      
      const fetchData = async () => {
        try {
          // Fetch normative data for all domains
          const allData = await NormativeService.fetchAllNormativeData(patientId);
          setNormativeComparison(allData);
        } catch (error) {
          console.error("Failed to fetch normative comparison data:", error);
          // Set empty data as fallback
          setNormativeComparison({});
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [patientId]);
  
  const isValidData = domains.every(domain => 
    typeof patientData[domain] === 'number' && !isNaN(patientData[domain])
  );
  
  const firstAndLastSession = useMemo(() => {
    if (!sessions || sessions.length < 2) {
      return null;
    }
    
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    
    const firstSession = sortedSessions[0];
    const lastSession = sortedSessions[sortedSessions.length - 1];
    
    return { firstSession, lastSession };
  }, [sessions]);
  
  const hasSessionData = firstAndLastSession !== null;
  
  return (
    <Tabs defaultValue="normative" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="normative">Normative Comparison</TabsTrigger>
        <TabsTrigger value="progress" disabled={!hasSessionData}>
          Progress Comparison
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="normative">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cognitive Domain Comparison</CardTitle>
          </CardHeader>
          <NormativeTab 
            domains={domains}
            patientData={patientData}
            normativeData={normativeData}
            subtypeData={subtypeData}
            normativeComparison={normativeComparison}
            isValidData={isValidData}
            isLoading={isLoading}
          />
        </Card>
      </TabsContent>
      
      <TabsContent value="progress">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">First vs. Last Session Progress</CardTitle>
          </CardHeader>
          <ProgressTab
            domains={domains}
            sessions={sessions}
            hasSessionData={hasSessionData}
            firstAndLastSession={firstAndLastSession}
          />
        </Card>
      </TabsContent>
    </Tabs>
  );
};
