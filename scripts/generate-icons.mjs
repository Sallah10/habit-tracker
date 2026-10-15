// scripts/generate-icons.mjs
// Turns our wide transparent wordmark (app/assets/HabiTapp.png) into square
// PWA/app icons. Run with: npm run icons
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SOURCE = "app/assets/HabiTapp.png";
const BRAND = { r: 38, g: 37, b: 47, alpha: 1 }; // #26252F - same as the navbar

async function buildIcon({ size, out, logoRatio }) {
  const logo = await sharp(SOURCE)
    .resize({ width: Math.round(size * logoRatio) })
    .toBuffer();

  await mkdir(out.substring(0, out.lastIndexOf("/")), { recursive: true });

  await sharp({
    create: { width: size, height: size, channels: 4, background: BRAND }
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(out);

  console.log(`wrote ${out} (${size}x${size})`);
}

await buildIcon({ size: 192, out: "public/icons/icon-192.png", logoRatio: 0.72 });
await buildIcon({ size: 512, out: "public/icons/icon-512.png", logoRatio: 0.72 });
// maskable needs the logo inside the inner 80% safe zone
await buildIcon({ size: 512, out: "public/icons/maskable-512.png", logoRatio: 0.55 });
await buildIcon({ size: 512, out: "app/icon.png", logoRatio: 0.72 });
await buildIcon({ size: 180, out: "app/apple-icon.png", logoRatio: 0.72 });
