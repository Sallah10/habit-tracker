"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Session {
    platform: string;
    startTime: Date;
}

const SmartSocialTracker = () => {
    const [activeSession, setActiveSession] = useState<Session | null>(null);
    const [suggestedTime, setSuggestedTime] = useState(null);
    const [lastUsage, setLastUsage] = useState({});

    // Start tracking session
    const startSession = (platform: string) => {
        setActiveSession({
            platform,
            startTime: new Date(),
        });
    };

    // End tracking session
    const endSession = async () => {
        if (!activeSession) return;

        const endTime = new Date();
        const duration = Math.round((endTime - activeSession.startTime) / 1000 / 60); // minutes
        try {
            await logSession({
                platform: activeSession.platform,
                duration,
                timestamp: endTime,
            });

            // Update last usage
            setLastUsage(prev => ({
                ...prev,
                [activeSession.platform]: {
                    duration,
                    timestamp: endTime,
                }
            }));

        } catch (error) {
            console.error('Error logging session:', error);
        }

        setActiveSession(null);
    };

    // Suggest time based on patterns
    const suggestTimeForPlatform = (platform: string) => {
        // Get current time
        const currentHour = new Date().getHours();

        // Time suggestions based on typical patterns
        const suggestions = {
            morning: { start: 6, end: 12, avg: 15 },
            afternoon: { start: 12, end: 18, avg: 25 },
            evening: { start: 18, end: 23, avg: 35 }
        };

        let suggestedMinutes;
        if (currentHour >= 6 && currentHour < 12) {
            suggestedMinutes = suggestions.morning.avg;
        } else if (currentHour >= 12 && currentHour < 18) {
            suggestedMinutes = suggestions.afternoon.avg;
        } else {
            suggestedMinutes = suggestions.evening.avg;
        }

        return suggestedMinutes;
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Quick Track</CardTitle>
                </CardHeader>
                <CardContent>
                    {activeSession ? (
                        <div className="space-y-4">
                            <Alert>
                                <AlertDescription>
                                    Currently tracking: {activeSession.platform}
                                    <br />
                                    Started: {activeSession.startTime.toLocaleTimeString()}
                                </AlertDescription>
                            </Alert>

                            <Button
                                onClick={endSession}
                                className="w-full"
                                variant="destructive"
                            >
                                End Session
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {['Instagram', 'Facebook', 'Twitter', 'TikTok'].map(platform => (
                                <div key={platform} className="flex items-center space-x-2">
                                    <Button
                                        onClick={() => startSession(platform)}
                                        className="w-full"
                                    >
                                        Start {platform}
                                    </Button>

                                    {lastUsage[platform] && (
                                        <span className="text-sm text-gray-500">
                                            Last: {lastUsage[platform].duration}m
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-6">
                        <h3 className="font-medium mb-2">Quick Add Time</h3>
                        {['Instagram', 'Facebook', 'Twitter', 'TikTok'].map(platform => (
                            <div key={platform} className="flex items-center space-x-2 mb-2">
                                <Input
                                    type="number"
                                    placeholder="Minutes"
                                    className="w-24"
                                    defaultValue={suggestTimeForPlatform(platform)}
                                />
                                <span className="flex-grow">{platform}</span>
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        // Log quick time entry
                                    }}
                                >
                                    Add
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SmartSocialTracker;