import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export interface LogEntry {
  id: number;
  date: string;
  // name: string;
  // total: number;
  platform: SocialPlatform;
  timeSpent: string;
  mood: Mood;
  activity: ActivityType;
  wasProductiveTime: 'yes' | 'no';

}


type SocialPlatform = 'Instagram' | 'Facebook' | 'Twitter' | 'TikTok' | 'LinkedIn';
type Mood = 'Happy' | 'Neutral' | 'Sad' | 'Anxious';
type ActivityType = 'Browsing' | 'Surfing' | 'Posting' | 'Messaging' | 'Research';

export function getDailyUsageData(logs: LogEntry[]) {
  return logs.reduce((acc: { name: string; total: number }[], log) => {
    const existingDay = acc.find(item => item.name === log.date);
    if (existingDay) {
      existingDay.total += Number(log.timeSpent);
    } else {
      acc.push({ name: log.date, total: Number(log.timeSpent) });
    }
    return acc.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  }, []);
}