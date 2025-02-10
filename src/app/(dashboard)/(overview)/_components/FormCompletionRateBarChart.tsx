'use client';

import React from 'react';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
  completionRate: {
    label: 'Completion Rate ',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

interface FormCompletionRateBarChartProps {
  chartData: {
    formId: string;
    formName: string | undefined;
    completionRate: number;
  }[];
}

function FormCompletionRateBarChart({ chartData }: FormCompletionRateBarChartProps) {
  return (
    <ChartContainer config={chartConfig} className="w-full h-full min-h-[200px] max-h-[230px]">
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="formName"
          tickLine={false}
          //   tickMargin={10}
          // tickFormatter={(v) => v?.trim()?.slice(0, 10) + '...'}
          axisLine={false}
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`} // Format ticks as percentages
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel className="bg-slate-950" labelClassName="text-slate-50" />}
        />
        <Bar dataKey="completionRate" fill="hsl(var(--chart-1))" radius={8} maxBarSize={60} />
      </BarChart>
    </ChartContainer>
  );
}

export default FormCompletionRateBarChart;
