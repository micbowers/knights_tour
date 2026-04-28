// Strategy tips shown in the side rail. Voice: direct, specific, mentor.
// One displayed at a time. Rotates on the user's "↻" tap or every 30s.

export const TIPS = [
  "Head for corners early. They're the hardest squares to reach later.",
  "Count your options each turn. The square with fewest onward moves usually wins.",
  "Stuck? That's information. Step back to an earlier branch and try a different path.",
  "On a 5×5, no closed tour exists — that's a math fact. Open tours only.",
  "The L-shape works in 8 directions. Look for moves you might be missing.",
  "Symmetric starts (corner, center) often beat starts near an edge.",
  "If a square only has one way in, visit it before that way is blocked.",
  "Edges and corners reach fewer squares than the middle. Plan around that.",
  "When two moves look equal, pick the one that keeps more future options open.",
  "Your finished tour is a shape. Look at it — does it make sense?",
  "Bigger boards have more solutions, not fewer. 8×8 is friendlier than 5×5 in some ways.",
  "Try starting from a different square. Some starts close cleanly; others trap you.",
];

export function pickTip(seed = Date.now()) {
  return TIPS[seed % TIPS.length];
}
