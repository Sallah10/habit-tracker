import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";
import { SettingsClient } from "./SettingsClient";

export const metadata = { title: "Settings - HabiTapp" };

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/dashboard/settings");
  }

  const [user, habits] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, password: true },
    }),
    prisma.socialMediaHabit.findMany({
      where: { userId: session.user.id },
      orderBy: { platform: "asc" },
      select: { id: true, platform: true, goalDuration: true },
    }),
  ]);

  return (
    <SettingsClient
      email={user?.email ?? session.user.email ?? ""}
      initialName={user?.name ?? ""}
      hasPassword={Boolean(user?.password)}
      habits={habits.map((h) => ({
        id: h.id,
        platform: h.platform,
        goalDuration: h.goalDuration ?? 60,
      }))}
    />
  );
}
