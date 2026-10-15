// lib/usage.test.ts
import { describe, it, expect } from 'vitest';
import { getPlatformUsage, getTotalMinutes, formatDuration } from './usage';

const logs = [
  { duration: 30, habit: { platform: 'Instagram' } },
  { duration: 60, habit: { platform: 'TikTok' } },
  { duration: 15, habit: { platform: 'Instagram' } }
];

describe('getPlatformUsage', () => {
  it('sums durations per platform, biggest first', () => {
    expect(getPlatformUsage(logs)).toEqual([
      { platform: 'TikTok', duration: 60 },
      { platform: 'Instagram', duration: 45 }
    ]);
  });

  it('falls back to Unknown when the habit is missing', () => {
    expect(getPlatformUsage([{ duration: 10, habit: null }])).toEqual([
      { platform: 'Unknown', duration: 10 }
    ]);
  });

  it('returns an empty list for no logs', () => {
    expect(getPlatformUsage([])).toEqual([]);
  });
});

describe('getTotalMinutes', () => {
  it('adds everything up', () => {
    expect(getTotalMinutes(logs)).toBe(105);
  });
});

describe('formatDuration', () => {
  it('formats hours and minutes', () => {
    expect(formatDuration(90)).toBe('1h 30m');
  });

  it('drops the hours when there are none', () => {
    expect(formatDuration(45)).toBe('45m');
  });
});
