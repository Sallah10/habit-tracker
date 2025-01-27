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

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ]

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

// interface DashboardProps {
//   chartData: {
//     dailyData: { name: string; total: number }[];
//     platformData: { name: string; total: number }[];
//     activityData: { name: string; value: number }[];
//   };
// }
interface ComponentProps {
  data: {
    daily: { name: string; total: number }[];
    platforms: { name: string; total: number }[];
  }
}
// export function Component()
export const Component: React.FC<ComponentProps> = ({ data }) => {
  // const Dashboard: React.FC<DashboardProps> = ({ chartData }) =>{

  // }
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data.platforms}
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
