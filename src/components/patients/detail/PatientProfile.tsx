
import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { LineChartIcon, User, AlertCircle, InfoIcon } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { TrendData } from '@/services/patient';
import NormativeService, { NormativeComparisonData } from '@/services/normative';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface PatientProfileProps {
  patientAgeGroup: string;
  patientAdhdSubtype: string | null;
  avgDomainScores: {
    memory: number;
    attention: number;
    impulse_control: number;
    executive_function: number;
  };
  trendGraph: TrendData[];
  totalSessions: number;
  firstSessionDate: string | null;
  lastSessionDate: string | null;
  age: number;
  gender: string;
  hasTrendData: boolean;
  patientId: string;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({
  patientAgeGroup,
  patientAdhdSubtype,
  avgDomainScores,
  trendGraph,
  totalSessions,
  firstSessionDate,
  lastSessionDate,
  age,
  gender,
  hasTrendData,
  patientId
}) => {
  const [normativeData, setNormativeData] = useState<Record<string, NormativeComparisonData>>({});
  const [isLoadingNormative, setIsLoadingNormative] = useState(true);

  // Fetch normative data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (patientId) {
        setIsLoadingNormative(true);
        try {
          const data = await NormativeService.fetchAllNormativeData(patientId);
          setNormativeData(data);
        } catch (error) {
          console.error("Failed to fetch normative data:", error);
        } finally {
          setIsLoadingNormative(false);
        }
      }
    };

    fetchData();
  }, [patientId]);

  // Format date for XAxis
  const formatXAxis = (tickItem: string) => {
    try {
      return format(parseISO(tickItem), "MMM d");
    } catch (e) {
      return tickItem; // Fallback if parsing fails
    }
  };

  // Format score for Tooltip and YAxis
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
  
  // Define chart colors for each domain
  const domainColors = {
    attention: "#8884d8", // Purple for attention
    memory: "#82ca9d",    // Green for memory
    impulse: "#ffc658",   // Yellow for impulse control
    executive: "#ff7300"  // Orange for executive function
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

  // Render normative data tooltip content
  const renderNormativeTooltip = (domain: string) => {
    const apiDomain = mapDomainToApiKey(domain);
    const data = normativeData[apiDomain];
    
    if (isLoadingNormative) {
      return <p className="text-xs animate-pulse">Loading normative data...</p>;
    }
    
    if (!data) {
      return <p className="text-xs text-muted-foreground">No normative data available</p>;
    }
    
    const { normative_comparison } = data;
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center border-b pb-1">
          <span className="text-sm font-medium">Normative Comparison</span>
          <Badge variant="outline" className="text-xs">
            {data.age_group}
          </Badge>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Percentile:</span>
            <span className={`text-xs font-medium ${getPercentileColor(normative_comparison.percentile)}`}>
              {normative_comparison.percentile.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Z-Score:</span>
            <span className={`text-xs font-medium ${getZScoreColor(normative_comparison.z_score)}`}>
              {normative_comparison.z_score.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Mean Score:</span>
            <span className="text-xs font-medium">{normative_comparison.mean.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Standard Deviation:</span>
            <span className="text-xs font-medium">{normative_comparison.standard_deviation.toFixed(2)}</span>
          </div>
        </div>
        
        {normative_comparison.reference && (
          <div className="pt-1 border-t text-[10px] text-muted-foreground italic">
            Reference: {normative_comparison.reference} (n={normative_comparison.sample_size})
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card */}
        <Card className="glass">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold">{gender}</h2>
              <p className="text-muted-foreground">{gender}</p>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-muted-foreground mb-1">Age</h3>
                <p className="font-medium">{age} years</p>
              </div>

              <div>
                <h3 className="text-sm text-muted-foreground mb-1">
                  ADHD Subtype
                </h3>
                <Badge variant="outline">
                  {patientAdhdSubtype ?? "N/A"}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm text-muted-foreground mb-1">
                  Total Sessions
                </h3>
                <p className="font-medium">{totalSessions}</p>
              </div>

              <div>
                <h3 className="text-sm text-muted-foreground mb-1">
                  First Session
                </h3>
                <p className="font-medium">
                  {firstSessionDate
                    ? format(
                        parseISO(firstSessionDate),
                        "MMM d, yyyy"
                      )
                    : "N/A"}
                </p>
              </div>

              <div>
                <h3 className="text-sm text-muted-foreground mb-1">
                  Last Session
                </h3>
                <p className="font-medium">
                  {lastSessionDate
                    ? format(
                        parseISO(lastSessionDate),
                        "MMM d, yyyy"
                      )
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Card */}
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
                          {renderNormativeTooltip('memory')}
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
                          {renderNormativeTooltip('attention')}
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
                          {renderNormativeTooltip('impulse_control')}
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
                          {renderNormativeTooltip('executive_function')}
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
      </div>
      
      {/* Trend Graph in Profile Tab */}
      <div className="mt-6">
        <Card className="glass">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Cognitive Score Trends</h3>
              <LineChartIcon className="h-5 w-5 text-muted-foreground" />
            </div>

            {!hasTrendData ? (
              <div className="p-8 text-center h-64 flex flex-col justify-center items-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  No session data available to display trends.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Trends will appear after the patient completes sessions.
                </p>
              </div>
            ) : (
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trendGraph}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <defs>
                      <linearGradient id="colorAttention" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={domainColors.attention} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={domainColors.attention} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={domainColors.memory} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={domainColors.memory} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorImpulse" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={domainColors.impulse} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={domainColors.impulse} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExecutive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={domainColors.executive} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={domainColors.executive} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis 
                      dataKey="session_date" 
                      tickFormatter={formatXAxis}
                      axisLine={false}
                      tickLine={false}
                      tickMargin={10} 
                      fontSize={12}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis 
                      fontSize={12}
                      tickMargin={5}
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        boxShadow: 'var(--shadow)',
                        borderRadius: 'var(--radius)',
                        color: 'hsl(var(--foreground))'
                      }}
                      formatter={(value: number) => [`${formatScore(value)}`, '']}
                      labelFormatter={(label: string) => format(parseISO(label), "MMM d, yyyy")}
                    />
                    <Legend />
                    <ReferenceLine y={60} stroke="hsl(var(--muted))" strokeDasharray="3 3" />
                    <Area 
                      type="monotone" 
                      dataKey="attention_score" 
                      stroke={domainColors.attention} 
                      name="Attention"
                      fillOpacity={1}
                      fill="url(#colorAttention)"
                      strokeWidth={2}
                      activeDot={{ r: 6, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="memory_score" 
                      stroke={domainColors.memory} 
                      name="Memory"
                      fillOpacity={1}
                      fill="url(#colorMemory)"
                      strokeWidth={2}
                      activeDot={{ r: 6, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="impulse_score" 
                      stroke={domainColors.impulse} 
                      name="Impulse"
                      fillOpacity={1}
                      fill="url(#colorImpulse)"
                      strokeWidth={2}
                      activeDot={{ r: 6, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="executive_score" 
                      stroke={domainColors.executive} 
                      name="Executive"
                      fillOpacity={1}
                      fill="url(#colorExecutive)"
                      strokeWidth={2}
                      activeDot={{ r: 6, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper functions for color coding based on percentile and z-score
const getPercentileColor = (percentile: number) => {
  if (percentile < 16) return "text-red-500";
  if (percentile < 50) return "text-amber-500";
  if (percentile < 85) return "text-green-500";
  return "text-emerald-600";
};

const getZScoreColor = (zScore: number) => {
  if (zScore < -2) return "text-red-500";
  if (zScore < -1) return "text-red-400";
  if (zScore < 0) return "text-amber-400";
  if (zScore < 1) return "text-amber-500";
  if (zScore < 2) return "text-green-500";
  return "text-emerald-600";
};
