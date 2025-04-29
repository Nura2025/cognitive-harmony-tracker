
import React from 'react';
import { InfoIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { NormativeTooltip } from './NormativeTooltip';
import { NormativeComparisonData } from '@/services/normative';

interface DomainScoresProps {
  avgDomainScores: {
    memory: number;
    attention: number;
    impulse_control: number;
    executive_function: number;
  };
  totalSessions: number;
  normativeData: Record<string, NormativeComparisonData>;
  isLoadingNormative: boolean;
}

// Format score for display and determine color based on value
const formatScore = (score: number) => {
  return Math.round(score * 10) / 10; // Round to 1 decimal place
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-blue-600";
  if (score >= 40) return "text-yellow-600";
  return "text-red-600";
};

// Map domain keys to API domain names
const mapDomainToApiKey = (domainKey: string): string => {
  switch(domainKey) {
    case 'memory': return 'memory';
    case 'attention': return 'attention';
    case 'executive_function': return 'executivefunction';
    case 'impulse_control': return 'behavioral';
    default: return domainKey;
  }
};

export const DomainScores: React.FC<DomainScoresProps> = ({
  avgDomainScores,
  totalSessions,
  normativeData,
  isLoadingNormative
}) => {
  return (
    <Card className="glass">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">
          Average Domain Scores
        </h3>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-sm">Memory</p>
              <div className="flex items-center">
                <p className={`text-sm font-medium ${getScoreColor(avgDomainScores?.memory ?? 0)}`}>
                  {formatScore(avgDomainScores?.memory ?? 0)}
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="ml-1.5 focus:outline-none">
                        <InfoIcon className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="w-64">
                      <NormativeTooltip 
                        domain='memory' 
                        data={normativeData['memory']} 
                        isLoading={isLoadingNormative} 
                      />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <Progress 
              value={avgDomainScores?.memory ?? 0} 
              className="h-2"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-sm">Attention</p>
              <div className="flex items-center">
                <p className={`text-sm font-medium ${getScoreColor(avgDomainScores?.attention ?? 0)}`}>
                  {formatScore(avgDomainScores?.attention ?? 0)}
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="ml-1.5 focus:outline-none">
                        <InfoIcon className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="w-64">
                      <NormativeTooltip 
                        domain='attention' 
                        data={normativeData['attention']} 
                        isLoading={isLoadingNormative} 
                      />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <Progress
              value={avgDomainScores?.attention ?? 0}
              className="h-2"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-sm">Impulse Control</p>
              <div className="flex items-center">
                <p className={`text-sm font-medium ${getScoreColor(avgDomainScores?.impulse_control ?? 0)}`}>
                  {formatScore(avgDomainScores?.impulse_control ?? 0)}
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="ml-1.5 focus:outline-none">
                        <InfoIcon className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="w-64">
                      <NormativeTooltip 
                        domain='impulse_control' 
                        data={normativeData['behavioral']} 
                        isLoading={isLoadingNormative} 
                      />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <Progress
              value={avgDomainScores?.impulse_control ?? 0}
              className="h-2"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-sm">Executive Function</p>
              <div className="flex items-center">
                <p className={`text-sm font-medium ${getScoreColor(avgDomainScores?.executive_function ?? 0)}`}>
                  {formatScore(avgDomainScores?.executive_function ?? 0)}
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="ml-1.5 focus:outline-none">
                        <InfoIcon className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="w-64">
                      <NormativeTooltip 
                        domain='executive_function' 
                        data={normativeData['executivefunction']} 
                        isLoading={isLoadingNormative} 
                      />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <Progress
              value={avgDomainScores?.executive_function ?? 0}
              className="h-2"
            />
          </div>
        </div>

        {totalSessions === 0 && (
          <Alert className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Sessions</AlertTitle>
            <AlertDescription>
              This patient has no recorded sessions yet. Scores will be updated after the first session.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
