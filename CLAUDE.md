# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (Vite)
npm run build    # Build for production
npm run preview  # Preview production build
```

## Architecture

This is a single-page React application that visualizes an engineering career progression spectrum. The visualization shows how engineers progress from junior through senior, then branch toward Staff Engineer or Engineering Manager tracks.

### Key Files

- `spectrum-v2.jsx` - The entire application: a single `CareerSpectrum` component containing all data, constants, and rendering logic
- `src/main.jsx` - Entry point that renders `CareerSpectrum` into the DOM

### Data Model (all in spectrum-v2.jsx)

- `NODES` - Career stage nodes with `id`, `branch`, `phase`, `title`, and `items` (responsibilities)
- `BRANCHES` - Five responsibility branches: ic (Individual Contribution), delivery, tradeoff, people, process
- `PHASES` - Seven career phases from Junior (p0) through Staff/EM (p6)
- `TRACKS` - Two terminal tracks: Staff Engineer and Engineering Manager, each drawing from specific branches

### Visualization Logic

The SVG-based visualization calculates node positions using:
- `getBranchY(branch, phase)` - Y position based on branch divergence after Senior phase
- `buildBranchPath(branch)` - Bezier curves connecting nodes in a branch
- `buildTrackPaths()` - Divergence paths from phase 5 nodes to terminal Staff/EM positions

Phases 0-2 (Junior through Senior) keep all branches at the same Y position (`midY`). After Senior, branches spread vertically according to `BRANCH_Y_OFFSETS`.
