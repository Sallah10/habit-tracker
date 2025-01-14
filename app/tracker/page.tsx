"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Instagram, Twitter, Facebook, Youtube, Clock, Timer, TrendingUp } from "lucide-react";

type SocialPlatform = 'instagram' | 'twitter' | 'facebook' | 'youtube' | 'tiktok' | 'other';

type SocialHabit = {
    id: string,
    platform: SocialPlatform,
    timeGoal: number, // in minutes
    actualTime: number,
    mood: 'productive' | 'neutral' | 'distracting',
    notes: string,
    date: string
};

export default function SocialMediaTracker() {
    const [habits, setHabits] = useState<SocialHabit[]>([]);
    const [newHabit, setNewHabit] = useState({
        platform: 'instagram' as SocialPlatform,
        timeGoal: 30,
        actualTime: 0,
        mood: 'neutral' as 'productive' | 'neutral' | 'distracting',
        notes: ''
    });

    const getPlatformIcon = (platform: SocialPlatform) => {
        switch (platform) {
            case 'instagram': return <Instagram className="h-5 w-5" />;
            case 'twitter': return <Twitter className="h-5 w-5" />;
            case 'facebook': return <Facebook className="h-5 w-5" />;
            case 'youtube': return <Youtube className="h-5 w-5" />;
            default: return <Clock className="h-5 w-5" />;
        }
    };

    const addSocialHabit = () => {
        const habit: SocialHabit = {
            id: Date.now().toString(),
            ...newHabit,
            date: new Date().toISOString().split('T')[0]
        };

        setHabits([...habits, habit]);
        setNewHabit({
            platform: 'instagram',
            timeGoal: 30,
            actualTime: 0,
            mood: 'neutral',
            notes: ''
        });
    };

    const getMoodColor = (mood: string) => {
        switch (mood) {
            case 'productive': return 'text-green-500';
            case 'distracting': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Track Social Media Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Select
                            value={newHabit.platform}
                            onValueChange={(value: SocialPlatform) =>
                                setNewHabit({ ...newHabit, platform: value })}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="twitter">Twitter</SelectItem>
                                <SelectItem value="facebook">Facebook</SelectItem>
                                <SelectItem value="youtube">YouTube</SelectItem>
                                <SelectItem value="tiktok">TikTok</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>

                        <Input
                            type="number"
                            placeholder="Time goal (minutes)"
                            value={newHabit.timeGoal}
                            onChange={(e) => setNewHabit({
                                ...newHabit,
                                timeGoal: parseInt(e.target.value)
                            })}
                            className="w-[150px]"
                        />
                    </div>

                    <Select
                        value={newHabit.mood}
                        onValueChange={(value: 'productive' | 'neutral' | 'distracting') =>
                            setNewHabit({ ...newHabit, mood: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="How did it affect your productivity?" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="productive">Productive</SelectItem>
                            <SelectItem value="neutral">Neutral</SelectItem>
                            <SelectItem value="distracting">Distracting</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        placeholder="Notes (optional)"
                        value={newHabit.notes}
                        onChange={(e) => setNewHabit({ ...newHabit, notes: e.target.value })}
                    />

                    <Button onClick={addSocialHabit} className="w-full">
                        <Timer className="mr-2 h-4 w-4" />
                        Log Social Media Time
                    </Button>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <CardHeader>
                    <CardTitle>Your Habits:</CardTitle>
                </CardHeader>
                {habits.map(habit => (
                    <Card key={habit.id}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    {getPlatformIcon(habit.platform)}
                                    <span className="capitalize">{habit.platform}</span>
                                </div>
                                <span className={getMoodColor(habit.mood)}>
                                    {habit.mood}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Goal: {habit.timeGoal} minutes
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Actual: {habit.actualTime} minutes
                                    </p>
                                </div>
                                <TrendingUp className={`h-5 w-5 ${habit.actualTime <= habit.timeGoal ? 'text-green-500' : 'text-red-500'
                                    }`} />
                            </div>
                            {habit.notes && (
                                <p className="text-sm text-gray-500 mt-2">{habit.notes}</p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}