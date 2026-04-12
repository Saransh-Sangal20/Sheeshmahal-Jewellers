# Sheeshmahal Jewellers - Website

A modern, minimal jewellery showroom website for **Sheeshmahal Jewellers**, a physical store located in Varanasi, India. Built to showcase the store's jewellery collection, provide store information, and manage content through an admin panel.

---

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero banner, shop by category, featured pieces, customer reviews, CTA |
| Gallery | `/gallery` | Full jewellery listing with category filters (Gold, Silver, Diamond, Platinum) |
| About | `/about` | Store story, values, and promise section |
| Contact | `/contact` | Store address, phone, hours + customer review submission form |
| Location | `/location` | Google Maps embed with directions and landmark info |
| Admin Login | `/admin/login` | Secret admin login page (JWT authentication) |
| Admin Dashboard | `/admin/dashboard` | Manage jewellery items (CRUD) and moderate customer reviews |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Tailwind CSS, shadcn/ui, Framer Motion, Lucide React |
| Backend | FastAPI (Python), Motor (async MongoDB driver) |
| Database | MongoDB |
| Auth | JWT (admin only) — PyJWT + bcrypt |

---

## Project Structure

```
/app
├── backend/
│   ├── .env                  # MongoDB URL, DB name, JWT secret, CORS
│   ├── server.py             # All API routes, models, auth, seed data (fully commented)
│   ├── requirements.txt      # Python dependencies
│   └── tests/
│       └── test_api.py       # Backend API tests (pytest)
│
├── frontend/
│   ├── .env                  # Backend URL for API calls
│   ├── package.json          # Node dependencies
│   └── src/
│       ├── App.js            # React Router setup
│       ├── App.css           # Custom CSS (hover effects, animations)
│       ├── index.css          # Tailwind config, fonts, CSS variables, scrollbar
│       ├── components/
│       │   ├── Navbar.jsx         # Sticky nav with mobile hamburger menu
│       │   ├── Footer.jsx         # "Why shop with us", social links, contact info
│       │   ├── ProtectedRoute.jsx # Verifies JWT before allowing admin access
│       │   ├── ReviewCard.jsx     # Individual review card (used in marquee)
│       │   └── JewelleryCard.jsx  # Individual jewellery card (used in gallery)
│       ├── pages/
│       │   ├── HomePage.jsx       # Hero, categories, featured, reviews, CTA
│       │   ├── GalleryPage.jsx    # Jewellery grid with category filter
│       │   ├── AboutPage.jsx      # Story, values, promise
│       │   ├── ContactPage.jsx    # Contact info + review submission form
│       │   ├── LocationPage.jsx   # Google Maps iframe + directions
│       │   ├── AdminLoginPage.jsx # Admin email/password login
│       │   └── AdminDashboard.jsx # Tabs: jewellery CRUD + review moderation
│       └── components/ui/         # shadcn/ui components (button, input, dialog, etc.)
│
└── memory/
    ├── PRD.md                # Product requirements document
    └── test_credentials.md   # Admin login credentials for testing
```

---

## API Endpoints

### Public (no auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/` | Health check |
| `GET` | `/api/jewellery` | List all jewellery (optional `?category=Gold`) |
| `GET` | `/api/jewellery/categories` | Get all categories |
| `GET` | `/api/jewellery/{item_id}` | Get single jewellery item |
| `GET` | `/api/reviews` | Get approved reviews only |
| `POST` | `/api/reviews` | Submit a review (pending admin approval) |

### Admin (JWT token required in `Authorization: Bearer <token>` header)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/login` | Login, returns JWT token |
| `GET` | `/api/admin/verify` | Verify if token is valid |
| `POST` | `/api/jewellery` | Create new jewellery item |
| `PUT` | `/api/jewellery/{item_id}` | Update jewellery item |
| `DELETE` | `/api/jewellery/{item_id}` | Delete jewellery item |
| `GET` | `/api/admin/reviews` | Get all reviews (including pending) |
| `PUT` | `/api/admin/reviews/{review_id}?approved=true` | Approve or reject a review |
| `DELETE` | `/api/admin/reviews/{review_id}` | Delete a review |

---

## Database Collections

### `admins`
```json
{
  "id": "uuid",
  "email": "admin@jewellery.com",
  "password": "$2b$12$...",
  "name": "Admin",
  "createdAt": "2026-01-28T07:52:47.513511+00:00"
}
```

### `jewellery`
```json
{
  "id": "uuid",
  "name": "Royal Gold Necklace",
  "category": "Gold",
  "description": "Exquisite 22 karat gold necklace...",
  "imageUrl": "https://images.pexels.com/...",
  "createdAt": "2026-01-28T07:52:47.513511+00:00"
}
```

### `reviews`
```json
{
  "id": "uuid",
  "name": "Priya Sharma",
  "rating": 5,
  "comment": "Absolutely stunning collection!...",
  "approved": true,
  "createdAt": "2026-01-28T07:52:47.513511+00:00"
}
```

---

## Seed Data

On first server start (when collections are empty), the app automatically creates:

- **1 Admin account** — `admin@jewellery.com` / `Admin@123`
- **6 Jewellery items** — Gold (3), Diamond (1), Silver (1), Platinum (1)
- **4 Customer reviews** — All pre-approved with 4-5 star ratings

Seed data **never overwrites** existing data. It only runs when a collection is completely empty.

---

## Environment Variables

### Backend (`/app/backend/.env`)
| Variable | Description |
|----------|-------------|
| `MONGO_URL` | MongoDB connection string |
| `DB_NAME` | Database name |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `CORS_ORIGINS` | Allowed origins for CORS (default: `*`) |

### Frontend (`/app/frontend/.env`)
| Variable | Description |
|----------|-------------|
| `REACT_APP_BACKEND_URL` | Backend API base URL (used for all API calls) |

---

## Admin Panel

Access the admin panel at `/admin/login` (not linked from the public site).

**Features:**
- **Jewellery Tab** — Add, edit, delete jewellery items with name, category, description, and image URL
- **Reviews Tab** — View all reviews, approve/reject pending reviews, delete reviews
- **Logout** — Clears session and redirects to login

---

## Design

- **Theme:** Stone, amber, and dark palette — minimal and elegant
- **Fonts:** Playfair Display (serif headings) + Manrope (sans-serif body)
- **Animations:** Framer Motion for page transitions and scroll reveals
- **Icons:** Lucide React
- **Components:** shadcn/ui (buttons, inputs, dialogs, tabs, sheets, selects)
- **Responsive:** Mobile-first with hamburger menu navigation

---

## License

Private — Sheeshmahal Jewellers. All rights reserved.
