// lib/usage.ts
// Small pure helpers for the usage numbers so the pages (and the tests) can share them.
export type LogWithHabit = {
  duration: number;
  habit: { platform: string } | null;
};

export type PlatformUsage = {
  platform: string;
  duration: number;
};

export function getPlatformUsage(logs: LogWithHabit[]): PlatformUsage[] {
  const totals = logs.reduce((acc, log) => {
    const platform = log.habit?.platform || 'Unknown';
    acc[platform] = (acc[platform] || 0) + log.duration;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(totals)
    .map(([platform, duration]) => ({ platform, duration }))
    .sort((a, b) => b.duration - a.duration);
}

export function getTotalMinutes(logs: LogWithHabit[]): number {
  return logs.reduce((sum, log) => sum + log.duration, 0);
}

export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}
