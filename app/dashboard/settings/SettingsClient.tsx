"use client";
import { useState } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/password-input";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { getPlatformIconPath } from "@/lib/platforms";
import { avatarColor, initials } from "@/lib/avatar";

type Habit = { id: string; platform: string; goalDuration: number };

export function SettingsClient({
  email,
  initialName,
  hasPassword,
  habits,
}: {
  email: string;
  initialName: string;
  hasPassword: boolean;
  habits: Habit[];
}) {
  const { update } = useSession();

  // Profile
  const [name, setName] = useState(initialName);
  const [savingName, setSavingName] = useState(false);

  // Goals
  const [goals, setGoals] = useState<Habit[]>(habits);
  const [savingGoals, setSavingGoals] = useState(false);

  // Password
  const [passwordSet, setPasswordSet] = useState(hasPassword);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const displayName = name.trim() || initialName;

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    const clean = name.trim();
    if (!clean) {
      toast.error("Please enter a name");
      return;
    }
    setSavingName(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: clean }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save your profile");

      // Push the new name into the session so the nav updates immediately.
      await update({ name: clean });
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save your profile");
    } finally {
      setSavingName(false);
    }
  }

  async function saveGoals(e: React.FormEvent) {
    e.preventDefault();
    setSavingGoals(true);
    try {
      const res = await fetch("/api/habits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goals }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save your goals");
      toast.success("Goals updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save your goals");
    } finally {
      setSavingGoals(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not change your password");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSet(true);
      toast.success(passwordSet ? "Password changed" : "Password set - you can now sign in with email");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change your password");
    } finally {
      setSavingPassword(false);
    }
  }

  async function deleteAccount() {
    const res = await fetch("/api/account", { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(data.error || "Could not delete your account");
      return;
    }
    toast.success("Account deleted");
    await signOut({ callbackUrl: "/" });
  }

  return (
    <section className="general">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 pb-16">
        <PageHeader title="Settings" subtitle="Your name, goals and account." />

        {/* ---- Profile ---- */}
        <form onSubmit={saveProfile} className="panel flex flex-col gap-5">
          <h2 className="text-xl font-semibold text-white">Profile</h2>

          <div className="flex items-center gap-4">
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-[#26252F]"
              style={{ backgroundColor: avatarColor(email) }}
              aria-hidden="true"
            >
              {initials(displayName)}
            </span>
            <div>
              <p className="font-medium text-white">{displayName || "You"}</p>
              <p className="text-sm text-gray-400">{email}</p>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="label">
              Display name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              placeholder="Your name"
              className="field"
            />
            <p className="mt-2 text-xs text-gray-500">
              Your avatar shows your initials - we never store a photo.
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={savingName} className="font-semibold">
              {savingName ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Saving...
                </>
              ) : (
                "Save profile"
              )}
            </Button>
          </div>
        </form>

        {/* ---- Goals ---- */}
        <form onSubmit={saveGoals} className="panel flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-semibold text-white">Daily goals</h2>
            <p className="mt-1 text-sm text-gray-400">
              The minutes you&apos;re aiming to stay under, per app.
            </p>
          </div>

          {goals.length === 0 ? (
            <p className="text-sm text-gray-400">
              You&apos;re not tracking any apps yet. Pick some from the dashboard.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {goals.map((habit) => (
                <div key={habit.id} className="flex items-center gap-4">
                  <Image src={getPlatformIconPath(habit.platform)} alt="" width={24} height={24} />
                  <span className="flex-1 text-white">{habit.platform}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={5}
                      max={600}
                      step={5}
                      value={habit.goalDuration}
                      onChange={(e) =>
                        setGoals((prev) =>
                          prev.map((g) =>
                            g.id === habit.id ? { ...g, goalDuration: Number(e.target.value) } : g
                          )
                        )
                      }
                      className="field w-24 text-right"
                      aria-label={`${habit.platform} goal in minutes`}
                    />
                    <span className="text-sm text-gray-400">min</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {goals.length > 0 && (
            <div className="flex justify-end">
              <Button type="submit" disabled={savingGoals} className="font-semibold">
                {savingGoals ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Saving...
                  </>
                ) : (
                  "Save goals"
                )}
              </Button>
            </div>
          )}
        </form>

        {/* ---- Password ---- */}
        <form onSubmit={savePassword} className="panel flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {passwordSet ? "Change password" : "Set a password"}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {passwordSet
                ? "Enter your current password, then choose a new one."
                : "You signed up with Google. Set a password to also sign in with email."}
            </p>
          </div>

          {passwordSet && (
            <div>
              <label htmlFor="currentPassword" className="label">
                Current password
              </label>
              <PasswordInput
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                className="field"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="newPassword" className="label">
              New password
            </label>
            <PasswordInput
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="field"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="label">
              Confirm new password
            </label>
            <PasswordInput
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Repeat your new password"
              className="field"
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={savingPassword} className="font-semibold">
              {savingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Saving...
                </>
              ) : passwordSet ? (
                "Change password"
              ) : (
                "Set password"
              )}
            </Button>
          </div>
        </form>

        {/* ---- Danger zone ---- */}
        <div className="panel flex flex-col gap-4 border-red-500/25">
          <div>
            <h2 className="text-xl font-semibold text-white">Delete account</h2>
            <p className="mt-1 text-sm text-gray-400">
              This permanently removes your account, your goals and every log. It
              can&apos;t be undone.
            </p>
          </div>
          <div className="flex justify-end">
            <ConfirmDialog
              title="Delete your account?"
              description="All of your logs, goals and settings will be permanently deleted. This cannot be undone."
              confirmLabel="Delete account"
              destructive
              onConfirm={deleteAccount}
              trigger={
                <button className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/20">
                  Delete account
                </button>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
