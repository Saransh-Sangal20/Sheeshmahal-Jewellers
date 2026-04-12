# Sheeshmahal Jewellers - Frontend

React frontend for the Sheeshmahal Jewellers website. This is a fully static application — no backend required.

## Quick Start

```bash
yarn install
yarn start
```

Opens at http://localhost:3000

## Build for Production

```bash
yarn build
```

Output goes to the `build/` folder. Deploy to any static hosting (Vercel, Netlify, GitHub Pages, etc.)

## Data Files

All website data lives in `public/data/`:

- **`jewellery.json`** — Jewellery items shown in Gallery and Homepage. Edit this file to add/remove products.
- **`reviews.json`** — Customer reviews shown on Homepage marquee. Edit this file to add permanent reviews.

User-submitted reviews (via Contact page form) are saved to the browser's `localStorage`.

## Tech Stack

React, Tailwind CSS, shadcn/ui, Framer Motion, Lucide React

## Pages

| Route | Page |
|-------|------|
| `/` | Homepage |
| `/gallery` | Jewellery Gallery with category filters |
| `/about` | About the store |
| `/contact` | Contact info + review form |
| `/location` | Google Maps + directions |
