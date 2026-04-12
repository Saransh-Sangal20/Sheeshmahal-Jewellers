# Sheeshmahal Jewellers - Website

A modern, elegant jewellery showroom website for **Sheeshmahal Jewellers**, a trusted jewellery store in Varanasi, India. Built as a fully static frontend application — no backend or database required.

---

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero banner, shop by category, featured pieces, customer reviews marquee, CTA |
| Gallery | `/gallery` | Full jewellery listing with category filters (Gold, Silver, Diamond, Platinum) |
| About | `/about` | Store story, values, and promise section |
| Contact | `/contact` | Store address, phone, hours + customer review submission form |
| Location | `/location` | Google Maps embed with directions and landmark info |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React (Create React App + CRACO) |
| Styling | Tailwind CSS, shadcn/ui |
| Animations | Framer Motion |
| Icons | Lucide React |
| Data | Static JSON files + localStorage |

> **No backend, no database, no server** — the entire site runs as a static frontend.

---

## Project Structure

```
/app
├── frontend/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── craco.config.js
│   └── src/
│       ├── App.js                  # React Router setup
│       ├── App.css                 # Custom CSS (hover effects, WhatsApp pulse animation)
│       ├── index.css               # Tailwind config, fonts, CSS variables
│       ├── assets/
│       │   ├── logo.png            # Sheeshmahal Jewellers logo
│       │   ├── about.png           # About page hero image
│       │   └── about2.png          # About page showroom image
│       ├── components/
│       │   ├── Navbar.jsx          # Sticky nav with mobile hamburger menu
│       │   ├── Footer.jsx          # "Why shop with us", social links, contact info
│       │   ├── ReviewCard.jsx      # Individual review card (used in homepage marquee)
│       │   ├── JewelleryCard.jsx   # Individual jewellery card (used in gallery grid)
│       │   ├── WhatsAppWidget.jsx  # Floating WhatsApp chat button (all pages)
│       │   └── ScrollToTop.js      # Scrolls to top on route change
│       ├── pages/
│       │   ├── HomePage.jsx        # Hero, categories, featured, reviews, CTA
│       │   ├── GalleryPage.jsx     # Jewellery grid with category filter
│       │   ├── AboutPage.jsx       # Story, values, promise
│       │   ├── ContactPage.jsx     # Contact info + review submission form
│       │   └── LocationPage.jsx    # Google Maps iframe + directions
│       └── components/ui/          # shadcn/ui components (button, input, dialog, etc.)
│
│   └── public/
│       └── data/
│           ├── jewellery.json      # All jewellery items (edit this to update gallery)
│           └── reviews.json        # Base customer reviews (edit this to add permanent reviews)
```

---

## Data Management

Since there's no backend or database, all data lives in **JSON files** and **localStorage**.

### Jewellery Items — `public/data/jewellery.json`

To add, edit, or remove jewellery items, simply modify this file:

```json
{
  "id": "j1",
  "name": "Royal Gold Necklace",
  "category": "Gold",
  "description": "Exquisite 22 karat gold necklace with traditional Varanasi craftsmanship.",
  "imageUrl": "https://example.com/image.jpg",
  "createdAt": "2025-04-12T00:00:00.000Z"
}
```

| Field | Description |
|-------|-------------|
| `id` | Unique identifier (any string, must be unique) |
| `name` | Display name of the jewellery piece |
| `category` | Category for filtering — `Gold`, `Silver`, `Diamond`, or `Platinum` |
| `description` | Short description shown on cards |
| `imageUrl` | Direct URL to the jewellery image |
| `createdAt` | Date string (used for ordering) |

> **Adding a new category?** Just use a new category name in any item — the gallery filter will automatically pick it up.

### Customer Reviews — `public/data/reviews.json`

Permanent reviews that always show on the homepage. Edit this file to add or remove them:

```json
{
  "id": "r1",
  "name": "Priya Sharma",
  "rating": 5,
  "comment": "Absolutely stunning collection!",
  "createdAt": "2025-04-12T00:00:00.000Z",
  "approved": true
}
```

### User-Submitted Reviews — `localStorage`

When visitors submit a review through the Contact page form:
- The review is saved to `localStorage` under the key `userReviews`
- It immediately appears in the homepage reviews marquee alongside the JSON reviews
- These reviews persist in the visitor's browser but are not shared across devices

> To make a user-submitted review permanent, copy it from the browser's localStorage into `reviews.json`.

---

## Features

### WhatsApp Chat Widget
A floating green WhatsApp button appears on every page (bottom-right corner):
- Shows **"Chat with us!"** tooltip on hover
- Opens WhatsApp chat to **+91 98395 55066** with a pre-filled message
- Includes a pulse animation to draw attention

### Review Form
The Contact page includes a review form where customers can:
- Enter their name
- Select a 1-5 star rating
- Write a review comment
- Submit — the review is saved locally and appears on the homepage

### Gallery Filters
The Gallery page supports filtering by category:
- **All** — shows every item
- **Gold**, **Silver**, **Diamond**, **Platinum** — filters by category
- Categories are extracted automatically from the jewellery data

### Responsive Design
- Desktop navigation with category links
- Mobile hamburger menu with slide-out drawer
- All pages are fully responsive

---

## Design

- **Theme:** Stone, amber, and dark palette — minimal and elegant
- **Fonts:** Playfair Display (serif headings) + Manrope (sans-serif body)
- **Animations:** Framer Motion for page transitions and scroll reveals
- **Icons:** Lucide React
- **Components:** shadcn/ui (buttons, inputs, dialogs, tabs, sheets)

---

## Installation & Setup

### Prerequisites

- **Node.js 18+** — [Download](https://nodejs.org/)
- **Yarn** — `npm install -g yarn`

> No Python, MongoDB, or any backend setup required.

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd sheeshmahal-jewellers
```

### 2. Install Dependencies

```bash
cd frontend
yarn install
```

### 3. Run the Application

```bash
yarn start
```

The app opens at **http://localhost:3000**

### 4. Build for Production

```bash
yarn build
```

The optimized production build is output to the `frontend/build/` folder. This can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages, etc.)

---

## Quick Command Reference

| Action | Command |
|--------|---------|
| Install dependencies | `cd frontend && yarn install` |
| Start development server | `cd frontend && yarn start` |
| Build for production | `cd frontend && yarn build` |
| Add a new dependency | `cd frontend && yarn add <package-name>` |

---

## Deployment

Since this is a fully static site, you can deploy it to any static hosting provider:

- **Vercel** — `vercel deploy` from the `frontend/` folder
- **Netlify** — connect your repo and set build command to `yarn build`, publish directory to `build`
- **GitHub Pages** — use `gh-pages` package
- **Any web server** — just serve the contents of `frontend/build/`

---

## Contact

**Sheeshmahal Jewellers**
Nati Imli, Ramkatora, Near Rani Sati Mandir, Varanasi, Uttar Pradesh 221001
Phone: +91 98395 55066

- [Instagram](https://www.instagram.com/sheeshmahal__jewellers)
- [Facebook](https://www.facebook.com/share/1AzM9fEE9j/)
- [WhatsApp](https://wa.me/919839555066)
- [Google Maps](https://www.google.com/maps/place/Sheeshmahal+Jewellers)

---

## License

Private — Sheeshmahal Jewellers. All rights reserved.
