// app/manifest.ts
import type { MetadataRoute } from 'next';

// Next turns this into /manifest.webmanifest automatically.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HabiTapp - Social Media Habit Tracker',
    short_name: 'HabiTapp',
    description: 'Track your social media habits, spot your streaks and take your time back.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#26252F',
    theme_color: '#26252F',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: '/icons/maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  };
}
