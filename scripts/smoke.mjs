// scripts/smoke.mjs
// End-to-end smoke test against a running server.
//   npm run build && npm start   (in another terminal)
//   npm run smoke
// It registers a throwaway user, signs in, writes a log, checks the dashboard,
// then deletes everything it created. Safe to run against a dev database.
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const BASE = process.env.BASE_URL || "http://localhost:3100";
const email = `smoke+${Date.now()}@example.com`;
const password = "SmokeTest123";

const cookies = new Map();
let passed = 0;
let failed = 0;
let userId = null;

const recordCookies = (res) => {
  const raw = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  for (const line of raw) {
    const [pair] = line.split(";");
    const idx = pair.indexOf("=");
    cookies.set(pair.slice(0, idx).trim(), pair.slice(idx + 1).trim());
  }
};

const cookieHeader = () =>
  Array.from(cookies, ([k, v]) => `${k}=${v}`).join("; ");

async function call(path, options = {}) {
  const res = await fetch(BASE + path, {
    ...options,
    redirect: "manual",
    headers: {
      ...(options.headers || {}),
      ...(cookies.size ? { cookie: cookieHeader() } : {})
    }
  });
  recordCookies(res);
  return res;
}

function check(name, condition, detail = "") {
  if (condition) {
    passed += 1;
    console.log(`  PASS  ${name}`);
  } else {
    failed += 1;
    console.log(`  FAIL  ${name} ${detail}`);
  }
}

async function run() {
  console.log(`Smoke testing ${BASE}\n`);

  const home = await call("/");
  check("GET / returns 200", home.status === 200, `(got ${home.status})`);
  const homeHtml = await home.text();
  check("home page renders the app name", homeHtml.includes("HabiTapp"));

  const manifest = await call("/manifest.webmanifest");
  check("GET /manifest.webmanifest returns 200", manifest.status === 200, `(got ${manifest.status})`);
  const manifestJson = await manifest.json().catch(() => ({}));
  check("manifest is standalone", manifestJson.display === "standalone");
  check("manifest ships icons", Array.isArray(manifestJson.icons) && manifestJson.icons.length >= 2);

  const sw = await call("/sw.js");
  check("GET /sw.js returns 200", sw.status === 200, `(got ${sw.status})`);

  const guard = await call("/api/logs");
  check("GET /api/logs without a session is 401", guard.status === 401, `(got ${guard.status})`);

  const guardPost = await call("/api/logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ platform: "Instagram", logDate: new Date().toISOString() })
  });
  check("POST /api/logs without a session is 401", guardPost.status === 401, `(got ${guardPost.status})`);

  const weak = await call("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Smoke", email, password: "short" })
  });
  check("register rejects a short password with 400", weak.status === 400, `(got ${weak.status})`);

  const signup = await call("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Smoke Test", email, password })
  });
  const signupBody = await signup.json().catch(() => ({}));
  check("register creates the user with 201", signup.status === 201, `(got ${signup.status})`);
  userId = signupBody?.user?.id || null;
  check("register never returns the password", !JSON.stringify(signupBody).includes(password));

  const csrfRes = await call("/api/auth/csrf");
  const { csrfToken } = await csrfRes.json();

  const login = await call("/api/auth/callback/credentials", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ csrfToken, email, password, json: "true" }).toString()
  });
  check("credentials sign-in succeeds", login.status === 200 || login.status === 302, `(got ${login.status})`);

  const sessionRes = await call("/api/auth/session");
  const session = await sessionRes.json();
  check("session belongs to the smoke user", session?.user?.email === email, `(got ${session?.user?.email})`);

  // Send a bogus userId on purpose - the server must ignore it and use the session.
  const logRes = await call("/api/logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      platform: "Instagram",
      duration: 42,
      logDate: new Date().toISOString(),
      mood: "Happy",
      activity: "Browsing",
      wasProductive: "no",
      userId: "some-other-user-id"
    })
  });
  const logBody = await logRes.json().catch(() => ({}));
  check("POST /api/logs creates a log with 201", logRes.status === 201, `(got ${logRes.status})`);
  check("log is stored as not productive", logBody?.wasProductive === "no", `(got ${logBody?.wasProductive})`);
  check("server ignored the client-supplied userId", logBody?.habit?.userId === userId, `(got ${logBody?.habit?.userId})`);

  const list = await call("/api/logs");
  const logs = await list.json().catch(() => []);
  check("GET /api/logs returns our log", Array.isArray(logs) && logs.some((l) => l.id === logBody?.id));

  const dashboard = await call("/dashboard");
  check("GET /dashboard renders for a signed-in user", dashboard.status === 200, `(got ${dashboard.status})`);
  const dashHtml = await dashboard.text();
  check("dashboard shows a streak", /current streak/i.test(dashHtml));

  const signedOut = new Map(cookies);
  cookies.clear();
  const tracker = await call("/tracker");
  check("GET /tracker bounces anonymous users to login", tracker.status === 307 || tracker.status === 302, `(got ${tracker.status})`);
  const onboarding = await call("/onboarding");
  check("GET /onboarding bounces anonymous users to login", onboarding.status === 307 || onboarding.status === 302, `(got ${onboarding.status})`);
  const onboardApi = await call("/api/onboarding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ habits: [{ platform: "Instagram", goalDuration: 90 }] })
  });
  check("POST /api/onboarding without a session is 401", onboardApi.status === 401, `(got ${onboardApi.status})`);
  cookies.clear();
  for (const [k, v] of signedOut) cookies.set(k, v);

  console.log(`\n${passed} passed, ${failed} failed`);
}

async function cleanup() {
  if (!userId) return;
  await prisma.socialMediaLog.deleteMany({ where: { habit: { userId } } });
  await prisma.socialMediaHabit.deleteMany({ where: { userId } });
  await prisma.user.delete({ where: { id: userId } });
  console.log(`cleaned up smoke user ${email}`);
}

try {
  await run();
} catch (error) {
  failed += 1;
  console.error("smoke test crashed:", error);
} finally {
  try {
    await cleanup();
  } catch (error) {
    console.error("cleanup failed:", error);
  }
  await prisma.$disconnect();
  process.exit(failed === 0 ? 0 : 1);
}
