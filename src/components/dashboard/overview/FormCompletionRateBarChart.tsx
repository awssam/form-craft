'use client';

import React from 'react';
import InfoCard from './InfoCard';
import { BarChart as BarChartIcon } from 'lucide-react';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
const chartData = [
  { form: 'Feedback', completionRate: 75 }, // Example completion rate
  { form: 'Registration form with a long ass name', completionRate: 85 },
  { form: 'Inquiry', completionRate: 60 },
  { form: 'Survey', completionRate: 90 },
  { form: 'Newsletter', completionRate: 70 },
];

const chartConfig = {
  completionRate: {
    label: 'Completion Rate ',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function Component() {
  return (
    <ChartContainer config={chartConfig} className="w-full h-full min-h-[200px] max-h-[300px]">
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="form"
          tickLine={false}
          //   tickMargin={10}
          tickFormatter={(v) => v?.trim()?.slice(0, 10) + '...'}
          axisLine={false}
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          domain={[0, 100]} // Assuming completion rates are between 0% and 100%
          tickFormatter={(value) => `${value}%`} // Format ticks as percentages
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel className="bg-slate-950" labelClassName="text-slate-50" />}
        />
        <Bar dataKey="completionRate" fill="hsl(var(--chart-1))" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}

const FormCompletionRateBarChart = () => {
  return (
    <InfoCard
      className="col-span-full md:col-span-6 flex flex-col  gap-2 md:[grid-row:3] max-h-[400px]"
      title={'Completion Rate By Form'}
      icon={BarChartIcon}
      contentClassName="p-0"
      description={'Showing data for the last 6 months.'}
      renderData={() => <Component />}
    />
  );
};

export default FormCompletionRateBarChart;
