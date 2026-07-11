# AlgoViz – Interactive DSA Visualizer

<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white">
  <img src="https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
</p>

A React app that visualizes **Merge Sort, Quick Sort, BFS, DFS, and Dijkstra's algorithm**
step-by-step, with live controls for animation speed, array size, and graph density —
matches the project as described on the resume.

## How the animation works

Every algorithm is implemented as a JS **generator function**. Instead of just computing
the final answer, each `yield` emits a "step" (a snapshot of the array/graph state + what's
being compared/swapped/visited right now). The UI collects all steps into an array and plays
through them on a timer, so the exact same code both computes the answer *and* drives the
animation — no separate "fake" animation logic.

- `src/algorithms/sorting.js` — Merge Sort & Quick Sort as generators
- `src/algorithms/graph.js` — grid graph generator (guaranteed connected via a randomized
  spanning tree) + BFS/DFS/Dijkstra as generators
- `src/components/SortingVisualizer.jsx` — animated bar chart
- `src/components/GraphVisualizer.jsx` — SVG grid graph with visited/current/distance overlays
- `src/components/Controls.jsx` — algorithm picker, speed/size/density sliders, play/pause

## Correctness

Algorithm logic was verified with functional tests (20 random trials each for sorting,
full-graph connectivity checks for BFS/DFS, distance checks for Dijkstra) — see the test
script referenced in the setup notes below if you want to re-run it.

## Stack

React 18 (Vite), plain CSS (no charting library — bars and graph are hand-drawn SVG/divs to
keep full control over the animation).

## Setup

```bash
npm install
npm run dev     # runs on :5175
```

## Features

- **Sorting mode**: Merge Sort & Quick Sort, adjustable array size (5–80 bars), adjustable
  speed, color-coded comparisons/swaps/sorted state
- **Graph mode**: BFS / DFS / Dijkstra on a randomly generated grid graph, adjustable density,
  Dijkstra shows live shortest-distance labels as it relaxes edges
- Responsive layout (controls stack vertically on mobile)
- "Generate New" button to regenerate the array/graph without reloading

## Talking points for interviews

- Why generators are a clean fit for algorithm visualization (separates "what happens" from
  "how fast/when it's shown").
- Merge Sort O(n log n) guaranteed vs Quick Sort O(n log n) average / O(n²) worst case —
  the visualizer makes the difference in comparison count visible.
- Graph connectivity guarantee: a random spanning tree is built first (so every node is
  reachable), then extra edges are layered on based on the density slider.
- Dijkstra implemented with a linear-scan "find min unvisited" step (O(V²)) — a natural
  segue into discussing a priority-queue-based O((V+E) log V) version.
   ---
## 🌐 Connect with Me

<p align="left">
  <a href="mailto:yradhaec04@gmail.com">
    <img src="https://img.shields.io/badge/Gmail-Contact_Me-EA4335?style=for-the-badge&logo=gmail&logoColor=white" />
  </a>
  <a href="https://github.com/Radha0401">
    <img src="https://img.shields.io/badge/GitHub-Visit_Profile-100000?style=for-the-badge&logo=github&logoColor=white" />
  </a>
</p>
