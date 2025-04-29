
import React, { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TrendData } from '@/services/patient';
import { SessionFilters } from './sessions/SessionFilters';
import { SessionCard } from './sessions/SessionCard';
import { SessionPagination } from './sessions/SessionPagination';

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
            <SessionFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              scoreFilter={scoreFilter}
              setScoreFilter={setScoreFilter}
              dateRangeFilter={dateRangeFilter}
              setDateRangeFilter={setDateRangeFilter}
              sortOrder={sortOrder}
              toggleSortOrder={toggleSortOrder}
            />
            
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
              <SessionCard 
                key={idx}
                session={session}
                idx={idx}
                indexOfFirstSession={indexOfFirstSession}
                sessionsPerPage={sessionsPerPage}
                totalPages={totalPages}
                sortOrder={sortOrder}
                selectedSessionIndex={selectedSessionIndex}
                expandedDomain={expandedDomain}
                toggleSessionDetails={toggleSessionDetails}
                toggleDomainDetails={toggleDomainDetails}
                getScoreColor={getScoreColor}
                formatScore={formatScore}
                formatPercentile={formatPercentile}
                getClassificationStyle={getClassificationStyle}
              />
            ))}
            
            {/* Pagination */}
            <SessionPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              changePage={changePage}
            />
            
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
