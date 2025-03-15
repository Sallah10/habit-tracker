"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';

export interface LogEntry {
  id: string;
  logDate: string;
  platform: SocialPlatform;
  duration: number;
  mood: Mood;
  activity: ActivityType;
  wasProductive: boolean;
}

type SocialPlatform = 'Instagram' | 'Facebook' | 'Twitter' | 'TikTok' | 'LinkedIn';
type Mood = 'Happy' | 'Neutral' | 'Sad' | 'Anxious';
type ActivityType = 'Browsing' | 'Surfing' | 'Posting' | 'Messaging' | 'Research';

interface FormData {
  logDate: string;
  platform: SocialPlatform;
  duration: string;
  mood: Mood;
  activity: ActivityType;
  wasProductive: string;
}

const SocialMediaTracker: React.FC = () => {
  const { data: session } = useSession();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [formData, setFormData] = useState<FormData>({
    logDate: new Date().toISOString().split('T')[0],
    platform: 'Instagram',
    duration: '',
    mood: 'Neutral',
    activity: 'Browsing',
    wasProductive: 'yes',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!session?.user?.id) {
      alert('You must be logged in to log activity.');
      return;
    }

    const newLog = {
      ...formData,
      duration: parseInt(formData.duration),
      wasProductive: formData.wasProductive === 'yes',
    };

    try {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newLog,
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save log');
      }

      const savedLog = await response.json();
      setLogs([...logs, savedLog]);
      setFormData({
        ...formData,
        duration: '',
      });
    } catch (error) {
      console.error('Error saving log:', error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Process data for the chart
  const chartData = logs.reduce((acc: { logDate: string; duration: number }[], log) => {
    const date = log.logDate;
    const existing = acc.find(item => item.logDate === date);
    if (existing) {
      existing.duration += log.duration;
    } else {
      acc.push({ logDate: date, duration: log.duration });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.logDate).getTime() - new Date(b.logDate).getTime());

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
                  value={formData.logDate}
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
                  value={formData.duration}
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
                  value={formData.wasProductive}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <button
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
                      <td className="p-2">{log.logDate}</td>
                      <td className="p-2">{log.platform}</td>
                      <td className="p-2">{log.duration}</td>
                      <td className="p-2">{log.mood}</td>
                      <td className="p-2">{log.activity}</td>
                      <td className="p-2">{log.wasProductive}</td>
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