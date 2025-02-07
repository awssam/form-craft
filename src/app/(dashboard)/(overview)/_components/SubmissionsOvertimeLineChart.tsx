'use client';

import React from 'react';

import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
  desktop: {
    label: 'Submissions',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

interface LineChartProps {
  chartData: {
    month: string;
    submissions: number;
  }[];
}

export function SubmissionsOvertimeLineChart({ chartData }: LineChartProps) {
  return (
    <ChartContainer config={chartConfig} className="w-full h-full min-h-[200px] max-h-[230px]">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel className="bg-slate-950" labelClassName="text-slate-50" />}
        />
        <Line
          dataKey="submissions"
          type="natural"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={{
            fill: 'var(--color-desktop)',
          }}
          activeDot={{
            r: 6,
          }}
        />
      </LineChart>
    </ChartContainer>
  );
}
