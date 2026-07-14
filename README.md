# Peyaraful Crowdfunding Platform

A full-stack crowdfunding platform built with the MERN stack, enabling creators to launch campaigns and supporters to back them with a credit-based system.

**Live Client:** https://peyaraful-crowdfunding.netlify.app
**Live Server:** https://peyaraful-crowdfunding-server.onrender.com

## Admin Credentials

| Field | Value |
|-------|-------|
| Email | admin@peyaraful.com |
| Password | admin123 |

## Features

- **Role-Based Access Control** — Three distinct roles (Supporter, Creator, Admin) with separate dashboards and permissions
- **Google OAuth Sign-In** — Real Google Sign-In on both login and register pages using `@react-oauth/google`
- **Credit-Based Contribution System** — Supporters purchase credit packages via Stripe and use credits to back campaigns
- **Campaign Management** — Creators can add, update, and delete campaigns with image URLs, categories, and funding goals
- **Contribution Workflow** — Supporters contribute credits, creators approve or reject, with automatic credit refund on rejection
- **Stripe Payment Integration** — Client-side Stripe Checkout for purchasing credit packages (100/$10, 300/$25, 800/$60, 1500/$110)
- **Withdrawal System** — Creators withdraw earned credits at a 20:1 rate (20 credits = $1) with admin approval workflow
- **Real-Time Notifications** — Bell icon with popup for campaign status, contribution, and withdrawal updates
- **Server-Side Search & Filtering** — Explore page with MongoDB-powered search by title/creator and category filtering
- **Admin Dashboard** — Manage users, approve/reject campaigns, process withdrawal requests, handle reported campaigns with suspend/delete
- **Framer Motion Animations** — Scroll-triggered animations on homepage sections (hero, stats, how-it-works, CTA)
- **Responsive Design** — Fully responsive across mobile, tablet, and desktop with collapsible sidebar and hamburger menu
- **Swiper Sliders** — Auto-playing hero banner with 3 slides and testimonial carousel on homepage
- **Report System** — Supporters can report inappropriate campaigns; admin can suspend or delete reported campaigns
- **JWT Authentication** — Secure token-based auth with `access-token` in localStorage and automatic session persistence on reload

## Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion, Swiper, React Toastify
- **Backend:** Node.js, Express, Mongoose, TypeScript
- **Database:** MongoDB (Atlas)
- **Auth:** Custom JWT + Google OAuth 2.0
- **Payment:** Stripe Checkout (client-side)
