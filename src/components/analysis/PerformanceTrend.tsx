
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { formatDuration } from '@/utils/dataProcessing';

interface TrendDataPoint {
  date: string;
  score: number;
  duration?: number;
}

interface PerformanceTrendProps {
  data: TrendDataPoint[];
  title: string;
  description?: string;
  showDuration?: boolean;
}

export const PerformanceTrend: React.FC<PerformanceTrendProps> = ({
  data,
  title,
  description,
  showDuration = false
}) => {
  return (
    <Card className="glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 5, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                {showDuration && (
                  <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                  </linearGradient>
                )}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickFormatter={(date) => {
                  const parts = date.split('-');
                  return `${parts[1]}/${parts[2]}`;
                }}
                stroke="hsl(var(--muted-foreground))"
                tickMargin={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                stroke="hsl(var(--muted-foreground))"
                tickMargin={10}
              />
              {showDuration && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 'dataMax + 500']}
                  stroke="hsl(var(--muted-foreground))"
                  tickMargin={10}
                  tickFormatter={(seconds) => `${Math.floor(seconds / 60)}m`}
                />
              )}
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  boxShadow: 'var(--shadow)',
                  borderRadius: 'var(--radius)',
                  color: 'hsl(var(--foreground))'
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'score') return [`${value}%`, 'Score'];
                  if (name === 'duration') return [formatDuration(value), 'Duration'];
                  return [value, name];
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                name="score"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorScore)"
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
              />
              {showDuration && (
                <Area
                  type="monotone"
                  dataKey="duration"
                  name="duration"
                  stroke="hsl(var(--muted-foreground))"
                  fillOpacity={1}
                  fill="url(#colorDuration)"
                  strokeWidth={1.5}
                  dot={{ r: 0 }}
                  activeDot={{ r: 4, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                  yAxisId="right"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
