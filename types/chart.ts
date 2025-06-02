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

// types/chart.ts
export interface HabitData {
  date: string
  completed: number    // Actual time spent (matches duration in SocialMediaLog)
  total: number        // Goal time (matches goalDuration in SocialMediaHabit)
  platform: {
    desktop: number    // Time spent on desktop
    mobile: number     // Time spent on mobile
  }
  mood?: string        // Optional: matches SocialMediaLog.mood
  activity?: string    // Optional: matches SocialMediaLog.activity
  wasProductive?: boolean // Converted from SocialMediaLog.wasProductive string
}