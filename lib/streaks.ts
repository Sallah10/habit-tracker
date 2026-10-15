// lib/streaks.ts
// Streak logic lives here so it's easy to unit test (see lib/streaks.test.ts).
// Days are compared as UTC YYYY-MM-DD to match how we format logDate everywhere else.

const dayKey = (date: Date): string => date.toISOString().split('T')[0];

const uniqueSortedDays = (logDates: string[]): string[] =>
  Array.from(new Set(logDates)).sort();

// Counts the run of days ending today (or yesterday - I don't want to zero your
// streak in the morning before you've logged anything yet).
export function getCurrentStreak(logDates: string[], today: Date = new Date()): number {
  const days = new Set(logDates);

  const cursor = new Date(today);
  if (!days.has(dayKey(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    if (!days.has(dayKey(cursor))) return 0;
  }

  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

// Longest run of consecutive days anywhere in the history.
export function getLongestStreak(logDates: string[]): number {
  const days = uniqueSortedDays(logDates);
  if (days.length === 0) return 0;

  let longest = 1;
  let run = 1;

  for (let i = 1; i < days.length; i += 1) {
    const prev = new Date(`${days[i - 1]}T00:00:00.000Z`);
    prev.setUTCDate(prev.getUTCDate() + 1);

    if (dayKey(prev) === days[i]) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
  }

  return longest;
}
