// Friendly cartoon knight (horse-head silhouette with brand-colored
// plume and saddle accent). Scalable; sized via CSS on the wrapping
// element. 120×120 viewBox.

export function knightSvg() {
  return `
<svg class="knight-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <ellipse cx="60" cy="108" rx="34" ry="5" fill="#1E2530" opacity="0.18"/>

  <path d="M 36 105
           L 32 78
           Q 30 50, 50 32
           Q 60 23, 74 27
           Q 86 32, 92 46
           L 96 60
           Q 97 67, 90 69
           L 78 71
           Q 72 73, 70 80
           L 76 105
           Z"
        fill="#1E2530"/>

  <path d="M 32 62
           Q 28 52, 36 40
           Q 30 40, 26 50
           Q 24 60, 32 62 Z
           M 36 48
           Q 30 38, 40 30
           Q 34 30, 30 38
           Q 28 46, 36 48 Z"
        fill="#9447D6"/>

  <path d="M 49 28 L 53 16 L 60 27 Z" fill="#1E2530"/>
  <path d="M 50 26 L 53 18 L 58 26 Z" fill="#9447D6"/>

  <circle cx="68" cy="42" r="3" fill="#F2EFE8"/>
  <circle cx="68" cy="42" r="1.4" fill="#1E2530"/>

  <rect x="80" y="56" width="9" height="2.4" rx="1.2" fill="#F2EFE8" opacity="0.85"/>

  <path d="M 40 92 Q 60 96 78 92 L 76 102 Q 60 105 42 102 Z" fill="#D4501A"/>
  <line x1="46" y1="97" x2="74" y2="97" stroke="#F5C400" stroke-width="1.2"/>
</svg>
  `.trim();
}
