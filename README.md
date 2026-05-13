# Wanderlust Travel — React + TypeScript

A cinematic, editorial travel website built with React and TypeScript.

## Features
- Hero section with animated background and stats
- Destination search bar (where, date, experience type)
- Tabbed destination grid with scroll-triggered animations
- Experience cards with hover interactions
- Testimonials section
- Newsletter signup with state management
- Responsive footer

## Tech Stack
- **React 18** with hooks (`useState`, `useEffect`, `useRef`)
- **TypeScript** with full type definitions for all data models
- **Vite** for fast dev/build
- No external CSS frameworks — pure inline styles with CSS variables

## Getting Started

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Build for Production

```bash
npm run build
npm run preview
```

## Key TypeScript Interfaces

```ts
interface Destination { id, name, region, rating, reviews, price, badge?, gradient }
interface Experience  { id, name, description, count, iconColor, iconPath }
interface Testimonial { id, quote, author, location, initials, avatarColor, textColor }
```

## Custom Hooks
- `useIntersect(ref)` — triggers scroll-based entrance animations via IntersectionObserver
