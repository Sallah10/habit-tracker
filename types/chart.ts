// types/chart.ts
export interface DailyData {
  name: string;
  total: number;
}

export interface PlatformData {
  name: string;
  desktop?: number;
  mobile?: number;
  total: number;
}

export interface ChartData {
  daily: DailyData[];
  platforms: PlatformData[];
}