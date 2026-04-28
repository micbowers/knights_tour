// "Did You Know?" cards shown in the side rail. Collapsible. New facts
// surface on each tour completion (in order). Order matters: earlier
// facts are friendlier and earned first.

export const FACTS = [
  {
    title: "Older than chess.",
    body: "The Knight's Tour appears in 9th-century India, predating modern chess by centuries.",
  },
  {
    title: "Euler liked it too.",
    body: "Mathematician Leonhard Euler analyzed this puzzle in 1759 — it helped invent graph theory.",
  },
  {
    title: "A truly enormous number.",
    body: "On an 8×8 board, there are about 1.22 × 10¹⁵ different open tours. That's more than the number of seconds since the dinosaurs.",
  },
  {
    title: "The trick has a name.",
    body: "Always moving to the square with fewest exits is called Warnsdorff's Rule (1823). You've been using it whenever you picked the 'tightest' square.",
  },
  {
    title: "You walked a Hamiltonian path.",
    body: "When you visit every square exactly once, you're walking a Hamiltonian path. Mathematicians prove these exist (or don't) for all kinds of shapes.",
  },
  {
    title: "Closed vs open.",
    body: "A closed tour ends one knight's-move from where you started, forming a loop. Closed tours are rarer than open ones.",
  },
  {
    title: "No 5×5 loop exists.",
    body: "There's no closed tour on a 5×5 board. Mathematicians proved it — the parity doesn't work out.",
  },
  {
    title: "Magic tours.",
    body: "On 8×8, some tours form a magic square when you write the move numbers in the squares — every row and column sums to the same number.",
  },
  {
    title: "Beyond two dimensions.",
    body: "There are knight's tours on 3D cubes and even 4D hypercubes. Same rule, more dimensions.",
  },
  {
    title: "AI uses heuristics too.",
    body: "Warnsdorff's Rule is a heuristic — a shortcut rule of thumb. It's how computers solve problems when checking every option would take too long.",
  },
];

export function getFact(index) {
  return FACTS[index % FACTS.length];
}
