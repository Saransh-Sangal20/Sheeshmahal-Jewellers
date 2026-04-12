# Sheeshmahal Jewellers - PRD

## Original Problem Statement
Remove backend from the Sheeshmahal Jewellers website. Make it completely frontend-based. Replace MongoDB with JSON files in a separate folder. Keep the design identical. Remove auth completely. Review form on contact page should still work - reviews added via the form should appear on homepage.

## Architecture
- **Frontend Only**: React (Create React App with CRACO)
- **Data Source**: Static JSON files in `/frontend/public/data/`
- **User Reviews**: localStorage + JSON file merge
- **No Backend**: No FastAPI, no MongoDB, no auth

## What's Been Implemented (Jan 2026)
- Removed all backend API calls (axios) from frontend pages
- Created `/frontend/public/data/jewellery.json` (6 items) and `/frontend/public/data/reviews.json` (4 reviews)
- Updated `App.js` - removed admin routes, ProtectedRoute import
- Updated `HomePage.jsx` - fetches from local JSON, merges localStorage reviews
- Updated `GalleryPage.jsx` - fetches from local JSON, client-side category filtering
- Updated `ContactPage.jsx` - review form saves to localStorage instead of API
- Admin pages (AdminLoginPage, AdminDashboard, ProtectedRoute) are no longer routed but files still exist

## Data Files
- `/frontend/public/data/jewellery.json` - Jewellery items (add/edit here to update gallery)
- `/frontend/public/data/reviews.json` - Base reviews (add/edit here to add permanent reviews)
- `localStorage["userReviews"]` - User-submitted reviews from the contact form

## Pages
- `/` - Homepage (hero, categories, featured pieces, reviews marquee, CTA)
- `/gallery` - Gallery with category filter (All, Gold, Diamond, Silver, Platinum)
- `/about` - About page with story and values
- `/contact` - Contact info + review form
- `/location` - Google Maps embed + directions

## Backlog
- P0: None (all core features working)
- P1: Delete unused admin files (AdminLoginPage.jsx, AdminDashboard.jsx, ProtectedRoute.jsx)
- P2: Consider adding more jewellery items and categories to JSON
