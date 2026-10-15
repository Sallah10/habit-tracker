// lib/streaks.test.ts
import { describe, it, expect } from 'vitest';
import { getCurrentStreak, getLongestStreak } from './streaks';

const today = new Date('2026-03-20T12:00:00.000Z');

describe('getCurrentStreak', () => {
  it('counts consecutive days ending today', () => {
    expect(getCurrentStreak(['2026-03-18', '2026-03-19', '2026-03-20'], today)).toBe(3);
  });

  it('still counts when the last log was yesterday', () => {
    expect(getCurrentStreak(['2026-03-18', '2026-03-19'], today)).toBe(2);
  });

  it('is 0 when nothing was logged today or yesterday', () => {
    expect(getCurrentStreak(['2026-03-10', '2026-03-11'], today)).toBe(0);
  });

  it('ignores duplicate logs on the same day', () => {
    expect(getCurrentStreak(['2026-03-20', '2026-03-20', '2026-03-19'], today)).toBe(2);
  });

  it('is 0 with no logs at all', () => {
    expect(getCurrentStreak([], today)).toBe(0);
  });
});

describe('getLongestStreak', () => {
  it('finds the longest run anywhere in history', () => {
    const days = [
      '2026-01-01',
      '2026-01-02',
      '2026-01-03',
      '2026-02-10',
      '2026-02-11'
    ];
    expect(getLongestStreak(days)).toBe(3);
  });

  it('handles a single log', () => {
    expect(getLongestStreak(['2026-01-01'])).toBe(1);
  });

  it('handles an empty history', () => {
    expect(getLongestStreak([])).toBe(0);
  });
});
