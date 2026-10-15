// lib/platforms.ts
// One place for platform names + their default icon paths, so the API, the
// tracker form and focus mode don't each keep their own copy of the mapping.
export const PLATFORMS = [
  'Instagram',
  'Facebook',
  'Twitter',
  'TikTok',
  'LinkedIn',
  'Youtube',
  'Snapchat',
  'Discord'
] as const;

export type Platform = (typeof PLATFORMS)[number];

const ICON_PATHS: Record<string, string> = {
  Instagram: '/default/instagram.png',
  Facebook: '/default/facebook.png',
  Twitter: '/default/tweeter.png',
  TikTok: '/default/tiktok.png',
  Youtube: '/default/youtube.png',
  Snapchat: '/default/snapchat.png',
  Discord: '/default/discord.png'
};

export function getPlatformIconPath(platform: string): string {
  return ICON_PATHS[platform] || '/default/social.png';
}
