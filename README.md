# Navisphere Logistics

A full-stack logistics/freight tracking platform: two React apps backed by a
shared Supabase project. Customers track shipments and submit inquiries on a
public site; staff manage orders and status updates from a separate admin
dashboard.

**Live:** [navispherelogistics.com](https://navispherelogistics.com) · Admin dashboard is staff-only (Supabase Auth login)

## Stack

| | |
|---|---|
| **Public site** (`customer-site`) | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| **Admin dashboard** (`admin-dashboard`) | Vite, React 19, TypeScript, Tailwind CSS v4, React Router |
| **Backend** | Supabase — Postgres, Row Level Security, Auth |
| **Email** | Resend (contact form notifications) |
| **Hosting** | Vercel (both apps deployed independently from this monorepo) |

## What's in each app

**`customer-site`** — the public marketing site:
- Home, About, Services, Contact pages
- Live order tracking: enter a tracking number, see a route-progress bar through
  the shipment's stages plus a detailed status history, backed by a Postgres RPC
  function so the public anon key can never read customer PII directly off the
  `orders` table
- Contact form that saves to the database and emails a notification via Resend
- Per-IP rate limiting on the tracking lookup, implemented in `proxy.ts`

**`admin-dashboard`** — staff-only order management:
- Supabase Auth login (any authenticated user is treated as staff — no public
  signup)
- Overview stats, searchable/filterable/paginated order list
- Create orders with line items, add/edit/delete tracking status updates
- Contact message inbox

**`supabase`** — the shared schema: tables, RLS policies, triggers (auto-generated
tracking numbers, auto-synced order status from the latest tracking update), and
the public RPC function, as versioned SQL migrations.
