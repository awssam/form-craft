'use client';

import React from 'react';
import InfoCard from './InfoCard';
import { LineChartIcon } from 'lucide-react';

import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
const chartData = [
  { month: 'January', submissions: 20 },
  { month: 'February', submissions: 30 },
  { month: 'March', submissions: 70 },
  { month: 'April', submissions: 50 },
  { month: 'May', submissions: 40 },
  { month: 'June', submissions: 80 },
  { month: 'July', submissions: 100 },
  { month: 'August', submissions: 80 },
  { month: 'September', submissions: 20 },
  { month: 'October', submissions: 30 },
  { month: 'November', submissions: 10 },
  { month: 'December', submissions: 0 },
];

const chartConfig = {
  desktop: {
    label: 'Submissions',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function Component() {
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

const SubmissionsOvertimeLineChart = () => {
  return (
    <InfoCard
      className="col-span-full flex flex-col gap-2 row-span-2 md:[grid-column:7/14] max-h-[400px]"
      title={'Submissions Overtime'}
      icon={LineChartIcon}
      contentClassName="p-2"
      description={'Showing data for the year'}
      renderData={() => <Component />}
    />
  );
};

export default SubmissionsOvertimeLineChart;
