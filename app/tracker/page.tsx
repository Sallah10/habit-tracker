"use client"
import React, { useState } from 'react';
import { PlusCircle, Clock, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type SocialPlatform = 'instagram' | 'twitter' | 'facebook' | 'youtube' | 'tiktok' | 'other';

type Mood = 'productive' | 'neutral' | 'distracting';

interface SocialHabit {
    id: string;
    platform: SocialPlatform;
    timeGoal: number;
    actualTime: number;
    mood: Mood;
    notes: string;
    date: string;
}

interface LogEntry {
    id: string;
    habitId: string;
    minutes: number;
    date: string;
    mood: Mood;
    notes: string;
}
const HabitTracker = () => {
    const [habits, setHabits] = useState([]);
    const [newHabit, setNewHabit] = useState({
        platform: '',
        targetMinutes: ''
    });
    const [logs, setLogs] = useState([]);
    const [newLog, setNewLog] = useState({
        habitId: '',
        date: new Date().toISOString().split('T')[0],
        minutes: '',
        notes: ''
    });

    const addHabit = (e) => {
        e.preventDefault();
        if (!newHabit.platform || !newHabit.targetMinutes) return;

        setHabits([...habits, {
            id: Date.now(),
            platform: newHabit.platform,
            targetMinutes: parseInt(newHabit.targetMinutes),
            createdAt: new Date()
        }]);

        setNewHabit({ platform: '', targetMinutes: '' });
    };

    const addLog = (e) => {
        e.preventDefault();
        if (!newLog.habitId || !newLog.minutes) return;

        setLogs([...logs, {
            id: Date.now(),
            habitId: newLog.habitId,
            date: newLog.date,
            minutes: parseInt(newLog.minutes),
            notes: newLog.notes
        }]);

        setNewLog({
            ...newLog,
            minutes: '',
            notes: ''
        });
    };

    const deleteHabit = (habitId) => {
        setHabits(habits.filter(habit => habit.id !== habitId));
        setLogs(logs.filter(log => log.habitId !== habitId));
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            {/* Add New Habit Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PlusCircle className="w-5 h-5" />
                        Add New Social Media Habit
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={addHabit} className="space-y-4">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Social Media Platform"
                                className="flex-1 p-2 border rounded"
                                value={newHabit.platform}
                                onChange={(e) => setNewHabit({ ...newHabit, platform: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Daily Target (minutes)"
                                className="w-48 p-2 border rounded"
                                value={newHabit.targetMinutes}
                                onChange={(e) => setNewHabit({ ...newHabit, targetMinutes: e.target.value })}
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Add Habit
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Log Time Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Log Time Spent
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={addLog} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <select
                                className="p-2 border rounded"
                                value={newLog.habitId}
                                onChange={(e) => setNewLog({ ...newLog, habitId: e.target.value })}
                            >
                                <option value="">Select Platform</option>
                                {habits.map(habit => (
                                    <option key={habit.id} value={habit.id}>
                                        {habit.platform}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="date"
                                className="p-2 border rounded"
                                value={newLog.date}
                                onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Minutes Spent"
                                className="p-2 border rounded"
                                value={newLog.minutes}
                                onChange={(e) => setNewLog({ ...newLog, minutes: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Notes (optional)"
                                className="p-2 border rounded"
                                value={newLog.notes}
                                onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Log Time
                        </button>
                    </form>
                </CardContent>
            </Card>

            {/* Habits List */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Habits</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {habits.map(habit => {
                            const todayLogs = logs.filter(log =>
                                log.habitId === habit.id &&
                                log.date === new Date().toISOString().split('T')[0]
                            );
                            const todayMinutes = todayLogs.reduce((sum, log) => sum + log.minutes, 0);

                            return (
                                <div key={habit.id} className="flex items-center justify-between p-4 border rounded">
                                    <div>
                                        <h3 className="font-semibold">{habit.platform}</h3>
                                        <p className="text-sm text-gray-600">
                                            Target: {habit.targetMinutes} minutes/day |
                                            Today: {todayMinutes} minutes
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => deleteHabit(habit.id)}
                                        className="p-2 text-red-500 hover:text-red-600"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default HabitTracker;