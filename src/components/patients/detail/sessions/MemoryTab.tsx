
import React from 'react';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { TrendData } from '@/services/patient';

interface MemoryTabProps {
  session: TrendData;
  expandedDomain: string | null;
  toggleDomainDetails: (domain: string) => void;
  getScoreColor: (score: number) => string;
  formatScore: (score: number) => number;
  formatPercentile: (percentile: number) => string;
  getClassificationStyle: (classification: string) => string;
}

export const MemoryTab: React.FC<MemoryTabProps> = ({
  session,
  expandedDomain,
  toggleDomainDetails,
  getScoreColor,
  formatScore,
  formatPercentile,
  getClassificationStyle
}) => {
  if (!session.memory_details) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
        <p>No detailed memory data available for this session</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-3 gap-3 bg-muted/40 p-3 rounded-md">
        <div className="text-center p-2 bg-background rounded shadow-sm">
          <div className="text-xs text-muted-foreground">Overall Score</div>
          <div className={`text-xl font-bold ${getScoreColor(session.memory_details.overall_score)}`}>
            {formatScore(session.memory_details.overall_score)}
          </div>
        </div>
        <div className="text-center p-2 bg-background rounded shadow-sm">
          <div className="text-xs text-muted-foreground">Percentile</div>
          <div className="text-xl font-bold">
            {formatPercentile(session.memory_details.percentile)}
          </div>
        </div>
        <div className="text-center p-2 bg-background rounded shadow-sm">
          <div className="text-xs text-muted-foreground">Classification</div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getClassificationStyle(session.memory_details.classification)}`}>
            {session.memory_details.classification}
          </span>
        </div>
      </div>
      
      <div>
        <div className="font-medium mb-3 text-sm">Components</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-3 bg-background shadow-sm">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Working Memory</span>
              <span className={`font-bold ${getScoreColor(session.memory_details.components.working_memory.score)}`}>
                {formatScore(session.memory_details.components.working_memory.score)}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => toggleDomainDetails('working_memory')}
            >
              {expandedDomain === 'working_memory' ? 'Hide Details' : 'Show Details'}
              {expandedDomain === 'working_memory' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </Button>
            
            {expandedDomain === 'working_memory' && (
              <div className="mt-2 animate-fade-in">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(session.memory_details.components.working_memory.components || {}).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="capitalize">{key.replace(/_/g, ' ')}</TableCell>
                        <TableCell>
                          {typeof value === 'number' ? formatScore(value as number) : String(value)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          
          <div className="border rounded-md p-3 bg-background shadow-sm">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Visual Memory</span>
              <span className={`font-bold ${getScoreColor(session.memory_details.components.visual_memory.score)}`}>
                {formatScore(session.memory_details.components.visual_memory.score)}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => toggleDomainDetails('visual_memory')}
            >
              {expandedDomain === 'visual_memory' ? 'Hide Details' : 'Show Details'}
              {expandedDomain === 'visual_memory' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </Button>
            
            {expandedDomain === 'visual_memory' && (
              <div className="mt-2 animate-fade-in">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(session.memory_details.components.visual_memory.components || {}).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="capitalize">{key.replace(/_/g, ' ')}</TableCell>
                        <TableCell>
                          {typeof value === 'number' ? formatScore(value as number) : String(value)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-medium mb-2">Tasks Used</div>
          <div className="flex flex-wrap gap-2">
            {session.memory_details.tasks_used?.map((task, i) => (
              <span key={i} className="bg-primary/10 px-2 py-1 rounded-full text-xs font-medium text-primary">
                {task}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium mb-2">Data Completeness</div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${session.memory_details.data_completeness}%` }}
            ></div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {session.memory_details.data_completeness}% complete
          </div>
        </div>
      </div>
    </div>
  );
}
