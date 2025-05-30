// "use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Customized colors for dark background
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#93c5fd",  // #4FD1C5Teal for better visibility
  },
  mobile: {
    label: "Mobile",
    color: "#F687B3",  // Pink for contrast
  },
  hover: {
    color: "#D9D9D9",  // White for hover (will adjust opacity)
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

export const HabitTrackerChart: React.FC<HabitTrackerProps> = ({ data }) => {
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
            stroke="#3F3E4D"  // Adjusted for dark background
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="date"
            tick={{ fill: '#A0AEC0' }}  // Light gray for axis labels
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
              fill: 'rgba(255, 255, 255, 0.1)',  // Semi-transparent white
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
            style={{
              transition: 'opacity 0.3s',
              opacity: 1,
            }}
            onMouseOver={() => {
              // Optional: Add hover effects
            }}
          />
          <Bar
            dataKey="mobile"
            fill={chartConfig.mobile.color}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            style={{
              transition: 'opacity 0.3s',
              opacity: 1,
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}