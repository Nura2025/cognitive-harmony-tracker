
import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { TrendData } from '@/services/patient';
import SessionService from '@/services/session';

interface ExecutiveTabProps {
  session: TrendData;
  expandedDomain: string | null;
  toggleDomainDetails: (domain: string) => void;
  getScoreColor: (score: number) => string;
  formatScore: (score: number) => number;
  formatPercentile: (percentile: number) => string;
  getClassificationStyle: (classification: string) => string;
}

export const ExecutiveTab: React.FC<ExecutiveTabProps> = ({
  session,
  expandedDomain,
  toggleDomainDetails,
  getScoreColor,
  formatScore,
  formatPercentile,
  getClassificationStyle
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [executiveDetails, setExecutiveDetails] = useState<any>(null);
  
  // Get the session ID from the TrendData structure
  const sessionId = session.id;

  useEffect(() => {
    // Only fetch when executive domain is expanded
    if (expandedDomain && expandedDomain.includes('executive') && sessionId) {
      setLoading(true);
      setError(null);
      
      SessionService.getSessionDomainDetails(sessionId, 'executive_function')
        .then(data => {
          setExecutiveDetails(data);
          console.log('Fetched executive function details:', data);
        })
        .catch(err => {
          console.error('Error fetching executive function details:', err);
          setError('Failed to load executive function details.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [expandedDomain, sessionId]);

  // Fallback to session data if API fetch fails or isn't expanded yet
  const details = executiveDetails || session.executive_details;

  if (!details) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
        <p>No detailed executive function data available for this session</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Loading executive function details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-3 gap-3 bg-muted/40 p-3 rounded-md">
        <div className="text-center p-2 bg-background rounded shadow-sm">
          <div className="text-xs text-muted-foreground">Overall Score</div>
          <div className={`text-xl font-bold ${getScoreColor(details.overall_score)}`}>
            {formatScore(details.overall_score)}
          </div>
        </div>
        <div className="text-center p-2 bg-background rounded shadow-sm">
          <div className="text-xs text-muted-foreground">Percentile</div>
          <div className="text-xl font-bold">
            {formatPercentile(details.percentile)}
          </div>
        </div>
        <div className="text-center p-2 bg-background rounded shadow-sm">
          <div className="text-xs text-muted-foreground">Classification</div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getClassificationStyle(details.classification)}`}>
            {details.classification}
          </span>
        </div>
      </div>
      
      <div>
        <div className="font-medium mb-3 text-sm">Domain Contributions</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(details.components || {}).map(([key, value]) => (
            <div key={key} className="border rounded-md p-3 bg-background shadow-sm">
              <div className="flex justify-between">
                <span className="font-medium capitalize">{key.replace(/_contribution/g, '').replace(/_/g, ' ')}</span>
                <span className={`font-bold ${getScoreColor(typeof value === 'number' ? value : 0)}`}>
                  {typeof value === 'number' ? formatScore(value) : String(value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {details.profile_pattern && (
        <div>
          <div className="text-sm font-medium mb-2">Profile Pattern</div>
          <div className="bg-muted/20 p-3 rounded-md">
            <p className="text-sm">{details.profile_pattern}</p>
          </div>
        </div>
      )}
      
      {typeof details.data_completeness !== 'undefined' && (
        <div>
          <div className="text-sm font-medium mb-2">Data Completeness</div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${typeof details.data_completeness === 'number' ? details.data_completeness * 100 : details.data_completeness}%` }}
            ></div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {typeof details.data_completeness === 'number' 
              ? `${Math.round(details.data_completeness * 100)}% complete` 
              : `${details.data_completeness}% complete`}
          </div>
        </div>
      )}
    </div>
  );
};
