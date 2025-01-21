// "use client";
// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Instagram, Twitter, Facebook, Youtube, Clock, Timer, TrendingUp } from "lucide-react";

// type SocialPlatform = 'instagram' | 'twitter' | 'facebook' | 'youtube' | 'tiktok' | 'other';

// type SocialHabit = {
//     id: string,
//     platform: SocialPlatform,
//     timeGoal: number, // in minutes
//     actualTime: number,
//     mood: 'productive' | 'neutral' | 'distracting',
//     notes: string,
//     date: string
// };

// export default function SocialMediaTracker() {
//     const [habits, setHabits] = useState<SocialHabit[]>([]);
//     const [newHabit, setNewHabit] = useState({
//         platform: 'instagram' as SocialPlatform,
//         timeGoal: 30,
//         actualTime: 0,
//         mood: 'neutral' as 'productive' | 'neutral' | 'distracting',
//         notes: ''
//     });

//     const getPlatformIcon = (platform: SocialPlatform) => {
//         switch (platform) {
//             case 'instagram': return <Instagram className="h-5 w-5" />;
//             case 'twitter': return <Twitter className="h-5 w-5" />;
//             case 'facebook': return <Facebook className="h-5 w-5" />;
//             case 'youtube': return <Youtube className="h-5 w-5" />;
//             default: return <Clock className="h-5 w-5" />;
//         }
//     };

//     const addSocialHabit = () => {
//         const habit: SocialHabit = {
//             id: Date.now().toString(),
//             ...newHabit,
//             date: new Date().toISOString().split('T')[0]
//         };

//         setHabits([...habits, habit]);
//         setNewHabit({
//             platform: 'instagram',
//             timeGoal: 30,
//             actualTime: 0,
//             mood: 'neutral',
//             notes: ''
//         });
//     };

//     const getMoodColor = (mood: string) => {
//         switch (mood) {
//             case 'productive': return 'text-green-500';
//             case 'distracting': return 'text-red-500';
//             default: return 'text-gray-500';
//         }
//     };

//     return (
//         <div className="max-w-4xl mx-auto p-4 space-y-6">
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Track Social Media Usage</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     <div className="flex items-center space-x-4">
//                         <div className='flex flex-col gap-2'>
//                             <CardTitle className="text-sm self-center">Select Platform:</CardTitle>
//                             <Select
//                                 value={newHabit.platform}
//                                 onValueChange={(value: SocialPlatform) =>
//                                     setNewHabit({ ...newHabit, platform: value })}
//                             >
//                                 <SelectTrigger className="w-[150px] md:w-[200px]">
//                                     <SelectValue placeholder="Select platform" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="instagram">Instagram</SelectItem>
//                                     <SelectItem value="twitter">Twitter</SelectItem>
//                                     <SelectItem value="facebook">Facebook</SelectItem>
//                                     <SelectItem value="youtube">YouTube</SelectItem>
//                                     <SelectItem value="tiktok">TikTok</SelectItem>
//                                     <SelectItem value="other">Other</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                         <div className='flex flex-col gap-2'>
//                             <CardTitle className='text-sm self-center'>Time spent:</CardTitle>
//                             <Input
//                                 type="number"
//                                 placeholder="Time goal (minutes)"
//                                 value={newHabit.timeGoal}
//                                 onChange={(e) => setNewHabit({
//                                     ...newHabit,
//                                     timeGoal: parseInt(e.target.value)
//                                 })}
//                                 className="max-w-[150px] md:w-[150px]"
//                             />
//                         </div>
//                     </div>

//                     <CardTitle className='text-sm'>Select Mood:</CardTitle>
//                     <Select
//                         value={newHabit.mood}
//                         onValueChange={(value: 'productive' | 'neutral' | 'distracting') =>
//                             setNewHabit({ ...newHabit, mood: value })}
//                     >
//                         <SelectTrigger>
//                             <SelectValue placeholder="How did it affect your productivity?" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem value="productive">Productive</SelectItem>
//                             <SelectItem value="neutral">Neutral</SelectItem>
//                             <SelectItem value="distracting">Distracting</SelectItem>
//                         </SelectContent>
//                     </Select>

//                     <Input
//                         placeholder="Notes (optional)"
//                         value={newHabit.notes}
//                         onChange={(e) => setNewHabit({ ...newHabit, notes: e.target.value })}
//                     />

//                     <Button onClick={addSocialHabit} className="w-full">
//                         <Timer className="mr-2 h-4 w-4" />
//                         Log Social Media Time
//                     </Button>
//                 </CardContent>
//             </Card>

//             <div className="space-y-2">
//                 <CardHeader>
//                     <CardTitle className='text-sm'>Your Habits&apos; Log(s):</CardTitle>
//                 </CardHeader>
//                 {habits.map(habit => (
//                     <Card key={habit.id}>
//                         <CardHeader>
//                             <CardTitle className="flex justify-between items-center">
//                                 <div className="flex items-center space-x-2">
//                                     {getPlatformIcon(habit.platform)}
//                                     <span className="capitalize">{habit.platform}</span>
//                                 </div>
//                                 <span className={getMoodColor(habit.mood)}>
//                                     {habit.mood}
//                                 </span>
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="flex justify-between items-center">
//                                 <div>
//                                     <p className="text-sm text-gray-500">
//                                         Time Spent: {habit.timeGoal} minutes
//                                     </p>
//                                     {/* <p className="text-sm text-gray-500">
//                                         Goal: {habit.timeGoal} minutes
//                                     </p> */}
//                                     {/* <p className="text-sm text-gray-500">
//                                         Actual: {habit.actualTime} minutes
//                                     </p> */}
//                                 </div>
//                                 <TrendingUp className={`h-5 w-5 ${habit.actualTime <= habit.timeGoal ? 'text-green-500' : 'text-red-500'
//                                     }`} />
//                             {habit.notes && (
//                                 <p className="text-sm text-gray-500 mt-2">{habit.notes}</p>
//                             )}
//                         </CardContent>
//                     </Card>
//                 ))}
//             </div>
//         </div>
//     );
// }
// Types and interfaces
"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Plus } from 'lucide-react';
// import { getDailyUsageData} from '@/utils/chart-data-export';

export interface LogEntry {
  id: number;
  date: string;
  platform: SocialPlatform;
  timeSpent: string;
  mood: Mood;
  activity: ActivityType;
  wasProductiveTime: 'yes' | 'no';

}

type SocialPlatform = 'Instagram' | 'Facebook' | 'Twitter' | 'TikTok' | 'LinkedIn';
type Mood = 'Happy' | 'Neutral' | 'Sad' | 'Anxious';
type ActivityType = 'Browsing' | 'Surfing' | 'Posting' | 'Messaging' | 'Research';

interface ChartDataPoint {
  date: string;
  timeSpent: number;
}

interface FormData {
  date: string;
  platform: SocialPlatform;
  timeSpent: string;
  mood: Mood;
  activity: ActivityType;
  wasProductiveTime: 'yes' | 'no';
}

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

const SocialMediaTracker: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split('T')[0],
    platform: 'Instagram',
    timeSpent: '',
    mood: 'Neutral',
    activity: 'Browsing',
    wasProductiveTime: 'no'
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // const newLogs = 
    setLogs([...logs, { ...formData, id: Date.now() }]);
    setFormData({
      ...formData,
      timeSpent: '',
    });

    // const dailyData = getDailyUsageData(newLogs);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  // Process data for the chart
  const chartData: ChartDataPoint[] = logs.reduce((acc: ChartDataPoint[], log) => {
    const date = log.date;
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.timeSpent = Number(existing.timeSpent) + Number(log.timeSpent);
    } else {
      acc.push({ date, timeSpent: Number(log.timeSpent) });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          {/* Social Media Usage Logger */}
          <CardTitle>HabiTapp Logger</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Platform</label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Twitter">Twitter</option>
                  <option value="TikTok">TikTok</option>
                  <option value="LinkedIn">LinkedIn</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Time Spent (minutes)</label>
                <input
                  type="number"
                  name="timeSpent"
                  value={formData.timeSpent}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mood</label>
                <select
                  name="mood"
                  value={formData.mood}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="Happy">Happy</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Sad">Sad</option>
                  <option value="Anxious">Anxious</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Activity Type</label>
                <select
                  name="activity"
                  value={formData.activity}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="Browsing">Browsing</option>
                  <option value="Surfing">Surfing</option>
                  <option value="Posting">Posting</option>
                  <option value="Messaging">Messaging</option>
                  <option value="Research">Research</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Was it productive time?</label>
                <select
                  name="wasProductiveTime"
                  value={formData.wasProductiveTime}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <button
              // bg-blue-500
              type="submit"
              className="flex items-center justify-center w-full p-2 bg-[#26252F]  text-white rounded hover:bg-[#7e7c96] "
            >
              <Plus className="w-4 h-4 mr-2" />
              Log Activity
            </button>
          </form>
        </CardContent>
      </Card>

      {logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Usage Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <LineChart
                width={800}
                height={400}
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="timeSpent"
                  stroke="#8884d8"
                  name="Time Spent (minutes)"
                />
              </LineChart>
            </div>
          </CardContent>
        </Card>
      )}

      {logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Platform</th>
                    <th className="text-left p-2">Time (min)</th>
                    <th className="text-left p-2">Mood</th>
                    <th className="text-left p-2">Activity</th>
                    <th className="text-left p-2">Productive?</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id} className="border-t">
                      <td className="p-2">{log.date}</td>
                      <td className="p-2">{log.platform}</td>
                      <td className="p-2">{log.timeSpent}</td>
                      <td className="p-2">{log.mood}</td>
                      <td className="p-2">{log.activity}</td>
                      <td className="p-2">{log.wasProductiveTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SocialMediaTracker;