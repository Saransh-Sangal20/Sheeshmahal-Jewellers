# Sheeshmahal Jewellers - Product Requirements Document

## Problem Statement
Build a jewellery showroom website for a physical store named "Sheeshmahal Jewellers" located in Varanasi, India. The website showcases the store's jewellery collection, provides store information, and includes an admin panel for managing content.

## User Personas
1. **Customer** - Browses jewellery collection, reads reviews, finds store location/contact
2. **Store Admin** - Manages jewellery listings and moderates customer reviews

## Core Requirements
- Modern, minimal theme (stone/amber/dark palette)
- No shopping cart or checkout functionality
- Pages: Home, Gallery, About Us, Contact Us, Location
- Review section with local display + Google reviews link
- Footer with social media links and "Why shop with us"
- Admin Panel with JWT authentication for CRUD on jewellery items
- Google Maps embed on Location page

## Tech Stack
- **Frontend:** React, Tailwind CSS, shadcn/ui, Framer Motion, Lucide React
- **Backend:** FastAPI (Python), Motor (async MongoDB driver), PyJWT, bcrypt
- **Database:** MongoDB
- **Auth:** JWT (admin only)

## Architecture
```
Frontend (React :3000) --> /api proxy --> Backend (FastAPI :8001) --> MongoDB
```

## Key API Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/jewellery | No | List all jewellery |
| GET | /api/jewellery/categories | No | Get categories |
| GET | /api/reviews | No | Get approved reviews |
| POST | /api/reviews | No | Submit review |
| POST | /api/admin/login | No | Admin login |
| GET | /api/admin/verify | Yes | Verify token |
| POST | /api/jewellery | Yes | Create jewellery |
| PUT | /api/jewellery/{id} | Yes | Update jewellery |
| DELETE | /api/jewellery/{id} | Yes | Delete jewellery |
| GET | /api/admin/reviews | Yes | All reviews |
| PUT | /api/admin/reviews/{id} | Yes | Approve/reject |
| DELETE | /api/admin/reviews/{id} | Yes | Delete review |

## What's Implemented (April 6, 2026)
- All public pages (Home, Gallery, About, Contact, Location)
- Full admin dashboard with jewellery CRUD and review management
- JWT authentication for admin
- Seed data (6 jewellery items, 4 reviews, 1 admin account)
- Google Maps iframe embed
- Review submission with approval workflow
- Comprehensive comments in backend code
- E2E testing passed: 100% backend (20/20), 100% frontend

## Admin Credentials
- Email: admin@jewellery.com
- Password: Admin@123

## Backlog (P2)
- Enhanced admin dashboard (image upload via object storage)
- SEO & meta tags for all pages
- Additional design polish per user feedback
