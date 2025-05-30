"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Loader2, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';

type SocialPlatform = 'Instagram' | 'Facebook' | 'Twitter' | 'TikTok' | 'LinkedIn';
type Mood = 'Happy' | 'Neutral' | 'Sad' | 'Anxious';
type ActivityType = 'Browsing' | 'Surfing' | 'Posting' | 'Messaging' | 'Research';

interface ApiLogEntry {
  id: string;
  logDate: string;
  duration: number;
  mood: string | null;
  activity: string | null;
  wasProductive: boolean | null;
  habit: {
    platform: SocialPlatform;
  };
}
interface LogEntry {
  id: string;
  logDate: string;
  platform: SocialPlatform;
  duration: number;
  mood: Mood;
  activity: ActivityType;
  wasProductive: boolean;
}

interface FormData {
  logDate: string;
  platform: SocialPlatform;
  duration: number;
  mood: Mood;
  activity: ActivityType;
  wasProductive: 'yes' | 'no';
}

const SocialMediaTracker = () => {
  const { data: session } = useSession();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    logDate: new Date().toISOString().split('T')[0],
    platform: 'Instagram',
    duration: 0,
    mood: 'Neutral',
    activity: 'Browsing',
    wasProductive: 'yes',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/logs?userId=${session.user.id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch logs');
        }

        const data: ApiLogEntry[] = await response.json();

        // Transform API data to match our frontend types
        const typedLogs = data.map((log): LogEntry => ({
          id: log.id,
          logDate: new Date(log.logDate).toISOString().split('T')[0],
          platform: log.habit.platform,
          duration: log.duration,
          mood: log.mood as Mood || 'Neutral', // Default to 'Neutral' if null
          activity: log.activity as ActivityType || 'Browsing', // Default to 'Browsing' if null
          wasProductive: log.wasProductive || false // Default to false if null
        }));

        setLogs(typedLogs);
      } catch (error) {
        console.error('Error fetching logs:', error);
        setError(error instanceof Error ? error.message : 'Failed to load logs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [session]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!session?.user?.id) {
      alert('You must be logged in to log activity.');
      return;
    }

    try {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save log');
      }

      const savedLog: ApiLogEntry = await response.json();

      // Transform the saved log to match our frontend type
      const newLogEntry: LogEntry = {
        id: savedLog.id,
        logDate: new Date(savedLog.logDate).toISOString().split('T')[0],
        platform: savedLog.habit.platform,
        duration: savedLog.duration,
        mood: savedLog.mood as Mood || 'Neutral',
        activity: savedLog.activity as ActivityType || 'Browsing',
        wasProductive: savedLog.wasProductive || false
      };

      setLogs(prev => [newLogEntry, ...prev]);

      // Reset form
      setFormData({
        logDate: new Date().toISOString().split('T')[0],
        platform: 'Instagram',
        duration: 0,
        mood: 'Neutral',
        activity: 'Browsing',
        wasProductive: 'yes',
      });
    } catch (error) {
      console.error('Error saving log:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'duration') {
      if (value === '') {
        setFormData(prev => ({ ...prev, duration: 0 }));
        return;
      }
      if (!/^\d+$/.test(value)) return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? Number(value) : value,
    }));
  };

  const chartData = logs.reduce((acc: { logDate: string; duration: number }[], log) => {
    const date = new Date(log.logDate).toLocaleDateString();
    const existing = acc.find(item => item.logDate === date);
    if (existing) {
      existing.duration += log.duration;
    } else {
      acc.push({ logDate: date, duration: log.duration });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.logDate).getTime() - new Date(b.logDate).getTime());

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
          <p>Error: {error}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>HabiTapp Logger</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="logDate"
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
                  {['Instagram', 'Facebook', 'Twitter', 'TikTok', 'LinkedIn'].map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Time Spent (minutes)</label>
                <input
                  type="number"
                  name="duration"
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
                  {['Happy', 'Neutral', 'Sad', 'Anxious'].map(mood => (
                    <option key={mood} value={mood}>{mood}</option>
                  ))}
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
                  {['Browsing', 'Surfing', 'Posting', 'Messaging', 'Research'].map(activity => (
                    <option key={activity} value={activity}>{activity}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Was it productive?</label>
                <select
                  name="wasProductive"
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
              disabled={isSubmitting}
              className={`flex items-center justify-center w-full p-2 bg-[#26252F] text-white rounded hover:bg-[#7e7c96] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </span>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Log Activity
                </>
              )}
            </button>
          </form>
        </CardContent>
      </Card>

      {logs.length > 0 && (
        <>
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
                  <XAxis dataKey="logDate" />
                  <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="duration"
                    stroke="#8884d8"
                    name="Time Spent (minutes)"
                  />
                </LineChart>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="p-2">Date</th>
                      <th className="p-2">Platform</th>
                      <th className="p-2">Time (min)</th>
                      <th className="p-2">Mood</th>
                      <th className="p-2">Activity</th>
                      <th className="p-2">Productive?</th>
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
                        <td className="p-2">{log.wasProductive ? 'Yes' : 'No'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SocialMediaTracker;