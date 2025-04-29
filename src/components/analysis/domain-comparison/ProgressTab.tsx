
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { SessionData } from '@/utils/mockData';
import { CognitiveDomain } from '@/utils/types/patientTypes';
import { processSessionComparisonData } from './utils';
import { ProgressLegend } from './ProgressLegend';
import { ProgressRadarChart } from './ProgressRadarChart';

interface ProgressTabProps {
  domains: (keyof CognitiveDomain)[];
  sessions?: SessionData[];
  hasSessionData: boolean;
  firstAndLastSession: { firstSession: SessionData; lastSession: SessionData } | null;
}

export const ProgressTab: React.FC<ProgressTabProps> = ({
  domains,
  hasSessionData,
  firstAndLastSession
}) => {
  const sessionComparisonData = React.useMemo(() => {
    if (!firstAndLastSession) return [];
    
    const { firstSession, lastSession } = firstAndLastSession;
    return processSessionComparisonData(domains, firstSession, lastSession);
  }, [domains, firstAndLastSession]);

  if (!hasSessionData) {
    return (
      <CardContent>
        <div className="flex h-[350px] items-center justify-center text-muted-foreground">
          Not enough session data available for comparison
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent>
      <ProgressLegend />
      <div className="h-[350px] w-full">
        <ProgressRadarChart data={sessionComparisonData} />
      </div>
    </CardContent>
  );
};
