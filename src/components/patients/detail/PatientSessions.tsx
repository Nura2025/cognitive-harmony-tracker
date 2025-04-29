
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendData } from '@/services/patient';

interface PatientSessionsProps {
  trendGraph: TrendData[];
  hasTrendData: boolean;
}

export const PatientSessions: React.FC<PatientSessionsProps> = ({ trendGraph, hasTrendData }) => {
  const [selectedSessionIndex, setSelectedSessionIndex] = useState<number | null>(null);
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

  // Format score for display
  const formatScore = (score: number) => {
    return Math.round(score * 10) / 10; // Round to 1 decimal place
  };

  // Determine color based on score value
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };
  
  // Format percentile with suffix
  const formatPercentile = (percentile: number): string => {
    if (percentile > 10 && percentile < 20) return `${percentile}th`;
    const lastDigit = percentile % 10;
    switch (lastDigit) {
      case 1: return `${percentile}st`;
      case 2: return `${percentile}nd`;
      case 3: return `${percentile}rd`;
      default: return `${percentile}th`;
    }
  };

  const toggleSessionDetails = (index: number) => {
    if (selectedSessionIndex === index) {
      setSelectedSessionIndex(null);
    } else {
      setSelectedSessionIndex(index);
      setExpandedDomain(null);
    }
  };

  const toggleDomainDetails = (domain: string) => {
    if (expandedDomain === domain) {
      setExpandedDomain(null);
    } else {
      setExpandedDomain(domain);
    }
  };

  const domainNames: Record<string, string> = {
    memory: "Memory",
    attention: "Attention",
    impulse_control: "Impulse Control",
    executive_function: "Executive Function"
  };

  // Format classification with appropriate styling
  const getClassificationStyle = (classification: string) => {
    switch (classification?.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'average':
        return 'bg-yellow-100 text-yellow-800';
      case 'below average':
      case 'poor':
        return 'bg-orange-100 text-orange-800';
      case 'impaired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Session Details</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasTrendData ? (
          <div className="p-8 text-center h-64 flex flex-col justify-center items-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">
              No session data available.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Sessions will appear after the patient completes assessments.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {trendGraph.map((session, idx) => (
              <div 
                key={idx} 
                className="border rounded-md overflow-hidden"
              >
                <div 
                  className={`p-3 hover:bg-accent/50 transition-colors ${selectedSessionIndex === idx ? 'bg-accent/50' : ''}`}
                  onClick={() => toggleSessionDetails(idx)}
                >
                  <div className="flex justify-between items-center cursor-pointer">
                    <div>
                      <p className="text-sm font-medium">
                        {format(parseISO(session.session_date), "MMM d, yyyy")}
                      </p>
                      <p className="text-xs text-muted-foreground">Session {idx + 1}</p>
                    </div>
                    <div className="flex items-center space-x-2 lg:space-x-4">
                      <div className="grid grid-cols-4 gap-2 md:gap-4">
                        <div className="text-center">
                          <span className="text-xs text-muted-foreground block">Attention</span>
                          <p className={`text-sm font-medium ${getScoreColor(session.attention_score)}`}>
                            {formatScore(session.attention_score)}
                          </p>
                        </div>
                        <div className="text-center">
                          <span className="text-xs text-muted-foreground block">Memory</span>
                          <p className={`text-sm font-medium ${getScoreColor(session.memory_score)}`}>
                            {formatScore(session.memory_score)}
                          </p>
                        </div>
                        <div className="text-center">
                          <span className="text-xs text-muted-foreground block">Impulse</span>
                          <p className={`text-sm font-medium ${getScoreColor(session.impulse_score)}`}>
                            {formatScore(session.impulse_score)}
                          </p>
                        </div>
                        <div className="text-center">
                          <span className="text-xs text-muted-foreground block">Executive</span>
                          <p className={`text-sm font-medium ${getScoreColor(session.executive_score)}`}>
                            {formatScore(session.executive_score)}
                          </p>
                        </div>
                      </div>
                      {selectedSessionIndex === idx ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                </div>
                
                {selectedSessionIndex === idx && (
                  <div className="px-3 pb-3 pt-0">
                    <Tabs defaultValue="memory" className="w-full">
                      <TabsList className="grid grid-cols-4 mb-4">
                        <TabsTrigger value="memory">Memory</TabsTrigger>
                        <TabsTrigger value="attention">Attention</TabsTrigger>
                        <TabsTrigger value="impulse">Impulse</TabsTrigger>
                        <TabsTrigger value="executive">Executive</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="memory" className="space-y-4">
                        {session.memory_details ? (
                          <div className="space-y-4">
                            <div className="flex justify-between bg-muted/50 p-3 rounded-md">
                              <div>
                                <div className="text-sm font-medium">Overall Score</div>
                                <div className={`text-lg font-bold ${getScoreColor(session.memory_details.overall_score)}`}>
                                  {formatScore(session.memory_details.overall_score)}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">Percentile</div>
                                <div className="text-lg font-bold">
                                  {formatPercentile(session.memory_details.percentile)}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium">Classification</div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getClassificationStyle(session.memory_details.classification)}`}>
                                  {session.memory_details.classification}
                                </span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="font-medium mb-2">Components</div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border rounded-md p-3">
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
                                    <div className="mt-2">
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
                                                {typeof value === 'number' ? formatScore(value) : value}
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="border rounded-md p-3">
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
                                    <div className="mt-2">
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
                                                {typeof value === 'number' ? formatScore(value) : value}
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
                            
                            <div>
                              <div className="text-sm font-medium mb-1">Tasks Used</div>
                              <div className="flex flex-wrap gap-2">
                                {session.memory_details.tasks_used?.map((task, i) => (
                                  <span key={i} className="bg-muted px-2 py-1 rounded text-xs">
                                    {task}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-sm font-medium mb-1">Data Completeness</div>
                              <div className="w-full bg-muted rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{ width: `${session.memory_details.data_completeness}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {session.memory_details.data_completeness}% complete
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                            <p>No detailed memory data available for this session</p>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="attention" className="space-y-4">
                        {session.attention_details ? (
                          <div className="space-y-4">
                            <div className="flex justify-between bg-muted/50 p-3 rounded-md">
                              <div>
                                <div className="text-sm font-medium">Overall Score</div>
                                <div className={`text-lg font-bold ${getScoreColor(session.attention_details.overall_score)}`}>
                                  {formatScore(session.attention_details.overall_score)}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">Percentile</div>
                                <div className="text-lg font-bold">
                                  {formatPercentile(session.attention_details.percentile)}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium">Classification</div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getClassificationStyle(session.attention_details.classification)}`}>
                                  {session.attention_details.classification}
                                </span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="font-medium mb-2">Components</div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border rounded-md p-3">
                                  <div className="flex justify-between">
                                    <span className="font-medium">Crop Score</span>
                                    <span className={`font-bold ${getScoreColor(session.attention_details.components.crop_score)}`}>
                                      {formatScore(session.attention_details.components.crop_score)}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="border rounded-md p-3">
                                  <div className="flex justify-between">
                                    <span className="font-medium">Sequence Score</span>
                                    <span className={`font-bold ${getScoreColor(session.attention_details.components.sequence_score)}`}>
                                      {formatScore(session.attention_details.components.sequence_score)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                            <p>No detailed attention data available for this session</p>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="impulse" className="space-y-4">
                        {session.impulse_details ? (
                          <div className="space-y-4">
                            <div className="flex justify-between bg-muted/50 p-3 rounded-md">
                              <div>
                                <div className="text-sm font-medium">Overall Score</div>
                                <div className={`text-lg font-bold ${getScoreColor(session.impulse_details.overall_score)}`}>
                                  {formatScore(session.impulse_details.overall_score)}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">Percentile</div>
                                <div className="text-lg font-bold">
                                  {formatPercentile(session.impulse_details.percentile)}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium">Classification</div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getClassificationStyle(session.impulse_details.classification)}`}>
                                  {session.impulse_details.classification}
                                </span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="font-medium mb-2">Components</div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(session.impulse_details.components).map(([key, value]) => (
                                  <div key={key} className="border rounded-md p-3">
                                    <div className="flex justify-between">
                                      <span className="font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                                      <span className={`font-bold ${getScoreColor(value as number)}`}>
                                        {formatScore(value as number)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-sm font-medium mb-1">Games Used</div>
                              <div className="flex flex-wrap gap-2">
                                {session.impulse_details.games_used?.map((game, i) => (
                                  <span key={i} className="bg-muted px-2 py-1 rounded text-xs">
                                    {game}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-sm font-medium mb-1">Data Completeness</div>
                              <div className="w-full bg-muted rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{ width: `${session.impulse_details.data_completeness}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {session.impulse_details.data_completeness}% complete
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                            <p>No detailed impulse control data available for this session</p>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="executive" className="space-y-4">
                        {session.executive_details ? (
                          <div className="space-y-4">
                            <div className="flex justify-between bg-muted/50 p-3 rounded-md">
                              <div>
                                <div className="text-sm font-medium">Overall Score</div>
                                <div className={`text-lg font-bold ${getScoreColor(session.executive_details.overall_score)}`}>
                                  {formatScore(session.executive_details.overall_score)}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">Percentile</div>
                                <div className="text-lg font-bold">
                                  {formatPercentile(session.executive_details.percentile)}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium">Classification</div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getClassificationStyle(session.executive_details.classification)}`}>
                                  {session.executive_details.classification}
                                </span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="font-medium mb-2">Domain Contributions</div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {Object.entries(session.executive_details.components).map(([key, value]) => (
                                  <div key={key} className="border rounded-md p-3">
                                    <div className="flex justify-between">
                                      <span className="font-medium capitalize">{key.replace(/_contribution/g, '').replace(/_/g, ' ')}</span>
                                      <span className={`font-bold ${getScoreColor(value as number)}`}>
                                        {formatScore(value as number)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-sm font-medium mb-1">Profile Pattern</div>
                              <div className="bg-muted/50 p-3 rounded-md">
                                <p>{session.executive_details.profile_pattern}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                            <p>No detailed executive function data available for this session</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
