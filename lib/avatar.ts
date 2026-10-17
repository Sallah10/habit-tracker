// Deterministic per-user avatar: initials + a stable colour derived from a seed
// (we use the email). No image storage needed.

const COLORS = ["#FF6F61", "#F79009", "#12B76A", "#2E90FA", "#9E77ED", "#F670C7"];

export function initials(name?: string | null): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";

  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + last).toUpperCase() || "U";
}

export function avatarColor(seed?: string | null): string {
  const value = seed || "user";
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return COLORS[hash % COLORS.length];
}
