// prisma/seed.js
// Creates a demo account with ~5 weeks of realistic logs so anyone opening the
// app sees charts, totals and streaks instead of an empty dashboard.
//
//   npx prisma db seed
//
// Demo login: demo@habit.app / Demo1234
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const DEMO_EMAIL = "demo@habit.app";
const DEMO_PASSWORD = "Demo1234";

// Platform mix, weighted so "most used apps" has a clear ranking.
// goalDuration is the daily target the dashboard measures against.
const PLATFORMS = [
  { platform: "Instagram", goalDuration: 90 },
  { platform: "TikTok", goalDuration: 60 },
  { platform: "Youtube", goalDuration: 120 },
  { platform: "Twitter", goalDuration: 45 },
  { platform: "Discord", goalDuration: 60 },
];

const MOODS = ["Happy", "Neutral", "Sad", "Anxious"];
const ACTIVITIES = ["Browsing", "Surfing", "Posting", "Messaging", "Research"];

// Deterministic pseudo-random so re-seeding produces the same story.
let seed = 42;
const rand = () => {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
};
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

// UTC day key, matching lib/streaks.ts.
const dayKey = (d) => d.toISOString().split("T")[0];

async function main() {
  console.log("Seeding demo account...");

  // Wipe any previous demo user so `db seed` is repeatable.
  const existing = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
  if (existing) {
    await prisma.socialMediaLog.deleteMany({ where: { habit: { userId: existing.id } } });
    await prisma.socialMediaHabit.deleteMany({ where: { userId: existing.id } });
    await prisma.user.delete({ where: { id: existing.id } });
    console.log("Removed existing demo user.");
  }

  const password = await bcrypt.hash(DEMO_PASSWORD, 10);
  const user = await prisma.user.create({
    data: { email: DEMO_EMAIL, name: "Demo User", password },
  });
  console.log(`Created ${user.email}`);

  // Build habits first (logs reference them).
  const habits = {};
  for (const p of PLATFORMS) {
    habits[p.platform] = await prisma.socialMediaHabit.create({
      data: {
        platform: p.platform,
        icon: `/default/${p.platform.toLowerCase()}.png`,
        goalDuration: p.goalDuration,
        userId: user.id,
      },
    });
  }

  // 35 days of history. Skip a block ~2 weeks back so "best streak" beats
  // "current streak" and the chart shows a real gap, not a flat line.
  const logs = [];
  const totalDays = 35;
  const gapStart = 12; // days ago
  const gapEnd = 15; // inclusive, so a 4-day hole

  for (let daysAgo = totalDays - 1; daysAgo >= 0; daysAgo -= 1) {
    if (daysAgo >= gapStart && daysAgo <= gapEnd) continue;

    const date = new Date();
    date.setUTCDate(date.getUTCDate() - daysAgo);
    date.setUTCHours(12, 0, 0, 0);

    // Not every platform every day - keeps it believable.
    for (const p of PLATFORMS) {
      if (rand() < 0.45) continue;

      // Durations hover around each platform's goal, with some noise.
      const base = p.goalDuration;
      const duration = Math.max(5, Math.round(base * (0.4 + rand() * 1.2)));

      const productive = rand() < 0.35;
      logs.push({
        habitId: habits[p.platform].id,
        logDate: date,
        duration,
        mood: pick(MOODS),
        activity: pick(ACTIVITIES),
        wasProductive: productive ? "yes" : "no",
        note: null,
      });
    }
  }

  await prisma.socialMediaLog.createMany({ data: logs });
  console.log(`Created ${logs.length} logs across ${PLATFORMS.length} platforms.`);

  // Report what the dashboard will show, so I can sanity-check the seed.
  const days = new Set(logs.map((l) => dayKey(l.logDate)));
  let current = 0;
  const cursor = new Date();
  if (!days.has(dayKey(cursor))) cursor.setUTCDate(cursor.getUTCDate() - 1);
  while (days.has(dayKey(cursor))) {
    current += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  console.log(`\nDemo account ready:`);
  console.log(`  email:    ${DEMO_EMAIL}`);
  console.log(`  password: ${DEMO_PASSWORD}`);
  console.log(`  days with logs: ${days.size}`);
  console.log(`  current streak: ${current}`);
  console.log(`  total logs: ${logs.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
