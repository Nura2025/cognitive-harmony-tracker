
import React from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { getDomainName } from '@/utils/dataProcessing';

interface DomainChartProps {
  domain: string;
  data: Array<{ date: string; value: number }>;
}

export const DomainChart: React.FC<DomainChartProps> = ({ domain, data }) => {
  return (
    <div className="h-[180px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 15, right: 5, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            stroke="hsl(var(--muted-foreground))"
            tickMargin={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            stroke="hsl(var(--muted-foreground))"
            tickMargin={8}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              boxShadow: 'var(--shadow)',
              borderRadius: 'var(--radius)',
              color: 'hsl(var(--foreground))'
            }}
            formatter={(value: number) => [`${value}%`, getDomainName(String(domain))]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={`hsl(var(--cognitive-${String(domain)}))`}
            strokeWidth={2}
            activeDot={{ r: 6, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
            dot={{ r: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
