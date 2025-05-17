"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#ffffff",
  },
  mobile: {
    label: "Mobile",
    color: "#D9D9D9",
  },
} satisfies ChartConfig

import { ChartData } from "@/types/chart"

// interface ComponentProps {
//   data: {
//     daily: { name: string; total: number }[];
//     platforms: { name: string; total: number }[];
//   }
// }

export const Component: React.FC<{ data: ChartData }> = ({ data }) => {
  // app/components/ChartComponent.tsx
  if (!data.platforms || data.platforms.length === 0) {
    return (
      <div className="text-white p-4 text-center">
        No platform data available
      </div>
    );
  }
  const platformChartData = data.platforms.map(platform => ({
    name: platform.name,
    desktop: platform.total * 0.6, // Example distribution
    mobile: platform.total * 0.4,  // Example distribution
    total: platform.total
  }));

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={platformChartData}
        width={500}
        height={300}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        className="h-72">
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
