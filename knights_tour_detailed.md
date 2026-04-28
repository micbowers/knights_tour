# Knight’s Tour — Comprehensive Guide

## Overview
The Knight’s Tour is a classic chess-based mathematical problem where a knight visits every square exactly once.

## Knight Movement
- Moves in an L-shape:
  - 2 squares in one direction, then 1 perpendicular
- Can jump over pieces

## Board Requirements
- Standard board: 8×8 (64 squares)
- Requires 63 moves

## Types of Tours
### Open Tour
Ends on a square not reachable from the start

### Closed Tour
Ends one move away from the start (forms a loop)

## Mathematical Framing
- Hamiltonian Path (open)
- Hamiltonian Cycle (closed)
- Graph representation:
  - Squares = nodes
  - Moves = edges

## History
- Origin: 9th century India
- Spread through Persian/Arabic math
- Euler formalized analysis (1759)

## Algorithms

### 1. Backtracking
- Recursive search
- Exponential complexity

### 2. Warnsdorff’s Rule
- Move to square with fewest onward moves
- Highly efficient heuristic

### 3. Divide & Conquer
- Build from smaller boards

## Complexity
- ~1.22×10^15 solutions (open tours on 8×8)

## Variations
- Non-square boards
- Magic tours
- 3D tours

## Teaching Value
- Pattern recognition
- Strategic planning
- Graph thinking
- Intro to AI heuristics

## Example Strategy Insight
Avoid early moves that trap future movement options.

## Summary
A simple rule set creates a deeply complex and rich mathematical problem.
