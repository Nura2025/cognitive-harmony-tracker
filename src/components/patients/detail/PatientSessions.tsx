
import React, { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ChevronDown, ChevronUp, Search, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendData } from '@/services/patient';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PatientSessionsProps {
  trendGraph: TrendData[];
  hasTrendData: boolean;
}

export const PatientSessions: React.FC<PatientSessionsProps> = ({ trendGraph, hasTrendData }) => {
  const [selectedSessionIndex, setSelectedSessionIndex] = useState<number | null>(null);
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc"); // Default to newest first
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<string>("all");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 3;
  
  // First, sort the sessions by date
  const sortedSessions = useMemo(() => {
    if (!trendGraph?.length) return [];
    
    return [...trendGraph].sort((a, b) => {
      const dateA = new Date(a.session_date).getTime();
      const dateB = new Date(b.session_date).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [trendGraph, sortOrder]);
  
  // Apply filters (search and score)
  const filteredSessions = useMemo(() => {
    if (!sortedSessions?.length) return [];
    
    let filtered = [...sortedSessions];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(session => {
        const date = format(parseISO(session.session_date), "MMM d, yyyy").toLowerCase();
        return date.includes(query);
      });
    }
    
    // Apply score filter
    if (scoreFilter !== "all") {
      const minScore = parseInt(scoreFilter);
      filtered = filtered.filter(session => {
        // Filter based on average of all scores
        const avgScore = (session.memory_score + session.attention_score + 
                         session.impulse_score + session.executive_score) / 4;
        return avgScore >= minScore;
      });
    }
    
    // Apply date range filter
    if (dateRangeFilter !== "all") {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (dateRangeFilter) {
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "quarter":
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case "year":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(session => {
        const sessionDate = new Date(session.session_date);
        return sessionDate >= cutoffDate;
      });
    }
    
    return filtered;
  }, [sortedSessions, searchQuery, scoreFilter, dateRangeFilter]);
  
  // Get current sessions for pagination
  const totalPages = Math.ceil((filteredSessions?.length || 0) / sessionsPerPage);
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = filteredSessions?.slice(indexOfFirstSession, indexOfLastSession) || [];

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, scoreFilter, dateRangeFilter, sortOrder]);

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

  // Handle pagination
  const changePage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setSelectedSessionIndex(null); // Reset selected session when changing pages
  };
  
  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  return (
    <Card className="glass shadow-md border-0">
      <CardHeader className="pb-2 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Session Details</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleSortOrder}
              className="flex items-center gap-1 text-xs"
            >
              {sortOrder === "desc" ? "Newest First" : "Oldest First"}
              {sortOrder === "desc" ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
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
            {/* Search and filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search"
                  placeholder="Search sessions..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={scoreFilter} onValueChange={setScoreFilter}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" /> 
                    <SelectValue placeholder="Filter by score" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All scores</SelectItem>
                  <SelectItem value="80">Excellent (80+)</SelectItem>
                  <SelectItem value="60">Good (60+)</SelectItem>
                  <SelectItem value="40">Average (40+)</SelectItem>
                  <SelectItem value="0">All scores</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Filter by date" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="week">Past week</SelectItem>
                  <SelectItem value="month">Past month</SelectItem>
                  <SelectItem value="quarter">Past 3 months</SelectItem>
                  <SelectItem value="year">Past year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* No results message */}
            {filteredSessions.length === 0 && (
              <div className="text-center p-8 border rounded-md bg-muted/20">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <h3 className="font-medium text-lg">No matching sessions</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search query.</p>
                <div className="flex justify-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setScoreFilter("all");
                      setDateRangeFilter("all");
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              </div>
            )}
            
            {/* Session cards */}
            {currentSessions.map((session, idx) => (
              <div 
                key={idx} 
                className="border rounded-md overflow-hidden shadow-sm transition-all hover:shadow-md"
              >
                <div 
                  className={`p-3 hover:bg-accent/30 transition-colors cursor-pointer ${selectedSessionIndex === idx ? 'bg-accent/50' : 'bg-card'}`}
                  onClick={() => toggleSessionDetails(idx)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">
                        {format(parseISO(session.session_date), "MMM d, yyyy")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Session {sortOrder === "desc" 
                          ? totalPages * sessionsPerPage - indexOfFirstSession - idx 
                          : indexOfFirstSession + idx + 1}
                      </p>
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
                      
                      {/* Memory Tab */}
                      <TabsContent value="memory" className="space-y-4 animate-fade-in">
                        {session.memory_details ? (
                          <div className="space-y-4">
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
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                            <p>No detailed memory data available for this session</p>
                          </div>
                        )}
                      </TabsContent>
                      
                      {/* Attention Tab */}
                      <TabsContent value="attention" className="space-y-4 animate-fade-in">
                        {session.attention_details ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-3 bg-muted/40 p-3 rounded-md">
                              <div className="text-center p-2 bg-background rounded shadow-sm">
                                <div className="text-xs text-muted-foreground">Overall Score</div>
                                <div className={`text-xl font-bold ${getScoreColor(session.attention_details.overall_score)}`}>
                                  {formatScore(session.attention_details.overall_score)}
                                </div>
                              </div>
                              <div className="text-center p-2 bg-background rounded shadow-sm">
                                <div className="text-xs text-muted-foreground">Percentile</div>
                                <div className="text-xl font-bold">
                                  {formatPercentile(session.attention_details.percentile)}
                                </div>
                              </div>
                              <div className="text-center p-2 bg-background rounded shadow-sm">
                                <div className="text-xs text-muted-foreground">Classification</div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getClassificationStyle(session.attention_details.classification)}`}>
                                  {session.attention_details.classification}
                                </span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="font-medium mb-3 text-sm">Components</div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border rounded-md p-3 bg-background shadow-sm">
                                  <div className="flex justify-between">
                                    <span className="font-medium">Crop Score</span>
                                    <span className={`font-bold ${getScoreColor(session.attention_details.components.crop_score)}`}>
                                      {formatScore(session.attention_details.components.crop_score)}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="border rounded-md p-3 bg-background shadow-sm">
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
                      
                      {/* Impulse Tab */}
                      <TabsContent value="impulse" className="space-y-4 animate-fade-in">
                        {session.impulse_details ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-3 bg-muted/40 p-3 rounded-md">
                              <div className="text-center p-2 bg-background rounded shadow-sm">
                                <div className="text-xs text-muted-foreground">Overall Score</div>
                                <div className={`text-xl font-bold ${getScoreColor(session.impulse_details.overall_score)}`}>
                                  {formatScore(session.impulse_details.overall_score)}
                                </div>
                              </div>
                              <div className="text-center p-2 bg-background rounded shadow-sm">
                                <div className="text-xs text-muted-foreground">Percentile</div>
                                <div className="text-xl font-bold">
                                  {formatPercentile(session.impulse_details.percentile)}
                                </div>
                              </div>
                              <div className="text-center p-2 bg-background rounded shadow-sm">
                                <div className="text-xs text-muted-foreground">Classification</div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getClassificationStyle(session.impulse_details.classification)}`}>
                                  {session.impulse_details.classification}
                                </span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="font-medium mb-3 text-sm">Components</div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(session.impulse_details.components || {}).map(([key, value]) => (
                                  <div key={key} className="border rounded-md p-3 bg-background shadow-sm">
                                    <div className="flex justify-between">
                                      <span className="font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                                      <span className={`font-bold ${getScoreColor(typeof value === 'number' ? value : 0)}`}>
                                        {typeof value === 'number' ? formatScore(value) : String(value)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm font-medium mb-2">Games Used</div>
                                <div className="flex flex-wrap gap-2">
                                  {session.impulse_details.games_used?.map((game, i) => (
                                    <span key={i} className="bg-primary/10 px-2 py-1 rounded-full text-xs font-medium text-primary">
                                      {game}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-sm font-medium mb-2">Data Completeness</div>
                                <div className="w-full bg-muted rounded-full h-2.5">
                                  <div 
                                    className="bg-primary h-2.5 rounded-full" 
                                    style={{ width: `${session.impulse_details.data_completeness}%` }}
                                  ></div>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {session.impulse_details.data_completeness}% complete
                                </div>
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
                      
                      {/* Executive Tab */}
                      <TabsContent value="executive" className="space-y-4 animate-fade-in">
                        {session.executive_details ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-3 bg-muted/40 p-3 rounded-md">
                              <div className="text-center p-2 bg-background rounded shadow-sm">
                                <div className="text-xs text-muted-foreground">Overall Score</div>
                                <div className={`text-xl font-bold ${getScoreColor(session.executive_details.overall_score)}`}>
                                  {formatScore(session.executive_details.overall_score)}
                                </div>
                              </div>
                              <div className="text-center p-2 bg-background rounded shadow-sm">
                                <div className="text-xs text-muted-foreground">Percentile</div>
                                <div className="text-xl font-bold">
                                  {formatPercentile(session.executive_details.percentile)}
                                </div>
                              </div>
                              <div className="text-center p-2 bg-background rounded shadow-sm">
                                <div className="text-xs text-muted-foreground">Classification</div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getClassificationStyle(session.executive_details.classification)}`}>
                                  {session.executive_details.classification}
                                </span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="font-medium mb-3 text-sm">Domain Contributions</div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {Object.entries(session.executive_details.components || {}).map(([key, value]) => (
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
                            
                            <div>
                              <div className="text-sm font-medium mb-2">Profile Pattern</div>
                              <div className="bg-muted/20 p-3 rounded-md">
                                <p className="text-sm">{session.executive_details.profile_pattern}</p>
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
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 1 && changePage(currentPage - 1)}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, current page, last page, and pages around current
                    if (
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            isActive={page === currentPage}
                            onClick={() => changePage(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    
                    // Show ellipsis for skipped pages
                    if (page === 2 && currentPage > 3) {
                      return <PaginationEllipsis key="ellipsis-start" />;
                    }
                    
                    if (page === totalPages - 1 && currentPage < totalPages - 2) {
                      return <PaginationEllipsis key="ellipsis-end" />;
                    }
                    
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => currentPage < totalPages && changePage(currentPage + 1)}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
            
            {/* Show empty state if filtered has results but current page has none */}
            {filteredSessions.length > 0 && currentSessions.length === 0 && (
              <div className="text-center p-8">
                <p className="text-muted-foreground">No sessions on this page.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

