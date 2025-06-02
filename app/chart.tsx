"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Only updated the colors - everything else remains identical
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#6366f1",  // Softer indigo
  },
  mobile: {
    label: "Mobile",
    color: "#f472b6",  // Softer pink
  },
  hover: {
    color: "#e2e8f0",  // Light gray for hover
  }
} satisfies ChartConfig

interface HabitData {
  date: string;
  completed: number;
  total: number;
  platform?: {
    desktop: number;
    mobile: number;
  };
}

interface HabitTrackerProps {
  data: HabitData[];
}

export const Component: React.FC<HabitTrackerProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-white p-4 text-center">
        No habit data available
      </div>
    );
  }

  // Process data for the chart
  const chartData = data.map(item => ({
    date: item.date,
    desktop: item.platform?.desktop || 0,
    mobile: item.platform?.mobile || 0,
    total: item.total,
    completed: item.completed
  }));

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          barCategoryGap="15%"
          barGap={2}
        >
          <CartesianGrid
            vertical={false}
            stroke="#3F3E4D"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="date"
            tick={{ fill: '#A0AEC0' }}
            tickLine={false}
            axisLine={{ stroke: '#3F3E4D' }}
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
            }
          />
          <YAxis
            tick={{ fill: '#A0AEC0' }}
            tickLine={false}
            axisLine={{ stroke: '#3F3E4D' }}
            tickCount={6}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            cursor={{
              fill: '#1F2937',
              radius: 4
            }}
          />
          <ChartLegend
            content={<ChartLegendContent />}
            wrapperStyle={{ paddingTop: '20px' }}
          />
          <Bar
            dataKey="desktop"
            fill={chartConfig.desktop.color}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
          <Bar
            dataKey="mobile"
            fill={chartConfig.mobile.color}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}