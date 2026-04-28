// Generate the OG card PNG used for social link previews
// (WhatsApp, Slack, Twitter, etc.). Square 1200×1200 with the
// cartoon knight on a Bone-white background, brand-aligned.
//
// Run: node generate-og.mjs
// Output: public/og-card.png

import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';

const SIZE = 1200;

// Same knight as src/ui/components/knightSvg.js, scaled up to fill
// the square with breathing room. Composed against a Bone background.
// Friendly chibi knight: round helmet with a T-visor, big eyes,
// tall purple plume, and an Ember collar. Designed to read clearly
// at WhatsApp-thumbnail size while still showing brand colors.
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" fill="#F2EFE8"/>

  <g transform="translate(${SIZE/2} ${SIZE/2})">
    <!-- Drop shadow -->
    <ellipse cx="0" cy="430" rx="320" ry="34" fill="#1E2530" opacity="0.18"/>

    <!-- Plume (tall sweeping flame in Perception Purple, with lighter inner highlight). -->
    <path d="M -90 -400
             Q -160 -540, -80 -560
             Q -50 -555, -30 -510
             Q 0 -550, 30 -510
             Q 50 -555, 80 -560
             Q 160 -540, 90 -400
             Q 50 -340, 0 -370
             Q -50 -340, -90 -400 Z"
          fill="#9447D6"/>
    <path d="M -50 -430
             Q -90 -510, -40 -520
             Q -10 -490, 0 -440
             Q 10 -490, 40 -520
             Q 90 -510, 50 -430
             Q 30 -390, 0 -410
             Q -30 -390, -50 -430 Z"
          fill="#B86CE0"/>

    <!-- Plume base / helmet crest -->
    <rect x="-90" y="-405" width="180" height="28" rx="8" fill="#1E2530"/>

    <!-- Helmet (round) -->
    <ellipse cx="0" cy="-90" rx="320" ry="300" fill="#1E2530"/>

    <!-- T-shape visor opening -->
    <rect x="-200" y="-110" width="400" height="60" rx="6" fill="#F2EFE8"/>
    <rect x="-30" y="-50" width="60" height="80" rx="4" fill="#F2EFE8"/>

    <!-- Eyes -->
    <circle cx="-110" cy="-80" r="22" fill="#1E2530"/>
    <circle cx=" 110" cy="-80" r="22" fill="#1E2530"/>
    <!-- Eye shine -->
    <circle cx="-104" cy="-86" r="6" fill="#FFFFFF"/>
    <circle cx=" 116" cy="-86" r="6" fill="#FFFFFF"/>

    <!-- Smile arc under visor (cream so it reads against the dark helmet). -->
    <path d="M -55 70 Q 0 115 55 70"
          stroke="#F2EFE8" stroke-width="10" fill="none" stroke-linecap="round"/>

    <!-- Shoulders / collar -->
    <path d="M -340 230
             Q -300 170, -180 170
             L 180 170
             Q 300 170, 340 230
             L 360 410
             L -360 410 Z"
          fill="#1E2530"/>

    <!-- Saddle blanket / belt in Ember -->
    <rect x="-300" y="320" width="600" height="56" fill="#D4501A"/>
    <line x1="-260" y1="348" x2="260" y2="348" stroke="#F5C400" stroke-width="6"/>
  </g>
</svg>
`.trim();

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: SIZE },
  background: '#F2EFE8',
});
const png = resvg.render().asPng();
writeFileSync('public/og-card.png', png);
console.log(`✓ wrote public/og-card.png (${png.length} bytes)`);
