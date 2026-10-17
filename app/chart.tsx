"use client"

import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// One honest series: minutes logged per day, with the daily goal as a marker.
// (The old desktop/mobile split was fake - we never tracked device.)
const chartConfig = {
  minutes: {
    label: "Minutes",
    color: "#FF6F61",
  },
} satisfies ChartConfig

export interface DailyMinutes {
  date: string
  minutes: number
}

interface UsageChartProps {
  data: DailyMinutes[]
  goal?: number
}

export const Component: React.FC<UsageChartProps> = ({ data, goal }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        No logs yet. Add your first one to see the trend.
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 16, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#3F3E4D" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#A0AEC0", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#3F3E4D" }}
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString("en-US", { day: "numeric", month: "short" })
            }
            minTickGap={16}
          />
          <YAxis
            tick={{ fill: "#A0AEC0", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#3F3E4D" }}
            width={40}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })
                }
              />
            }
            cursor={{ fill: "rgba(255,255,255,0.05)", radius: 4 }}
          />
          {goal ? (
            <ReferenceLine
              y={goal}
              stroke="#A0AEC0"
              strokeDasharray="4 4"
              label={{ value: "goal", position: "insideTopRight", fill: "#A0AEC0", fontSize: 11 }}
            />
          ) : null}
          <Bar
            dataKey="minutes"
            fill="var(--color-minutes)"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
