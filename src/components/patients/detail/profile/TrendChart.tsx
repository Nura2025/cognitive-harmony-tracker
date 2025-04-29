
import React from 'react';
import { LineChartIcon, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format, parseISO } from 'date-fns';
import { TrendData } from '@/services/patient';
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

interface TrendChartProps {
  trendGraph: TrendData[];
  hasTrendData: boolean;
}

export const TrendChart: React.FC<TrendChartProps> = ({ 
  trendGraph,
  hasTrendData 
}) => {
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
  
  // Define chart colors for each domain
  const domainColors = {
    attention: "#8884d8", // Purple for attention
    memory: "#82ca9d",    // Green for memory
    impulse: "#ffc658",   // Yellow for impulse control
    executive: "#ff7300"  // Orange for executive function
  };

  return (
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
  );
};
