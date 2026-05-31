# GyanSagar — The Learning Management System

> *"Gyan Sagar" (ज्ञानसागर) — Ocean of Knowledge in Nepali and Sanskrit.*

GyanSagar is a full-stack, production-grade Learning Management System (LMS) built as a final year project for the **Bachelor of Science in Computer Science and Information Technology** program at **Tribhuvan University, Prithvi Narayan Campus, Pokhara**. It connects instructors and learners in a modern, intuitive, and scalable digital learning environment.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
  - [Student Features](#student-features)
  - [Teacher / Instructor Features](#teacher--instructor-features)
  - [Admin Panel Features](#admin-panel-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Algorithms](#algorithms)
- [Limitations & Future Work](#limitations--future-work)

---

## Overview

GyanSagar is designed to address the lack of a centralized, modern, and accessible digital learning platform in Nepal. Unlike legacy systems like Moodle (which suffer from complexity) or global platforms like Udemy (which are inaccessible and expensive for local instructors), GyanSagar is a self-hosted, lightweight, and easy-to-use marketplace-style LMS.

Instructors can create and publish structured, video-based courses. Students can browse, purchase, and systematically progress through those courses at their own pace — all from a clean, fully responsive web interface.

---

## Features

### Student Features

- **Registration & Authentication** — Secure sign-up with email verification link sent via Nodemailer. Forgot-password flow with a secure, time-limited reset link.
- **Role Selection** — Users select their role (Teacher or Student) during the login process, enabling role-based routing and access control.
- **Course Browsing** — Browse all published courses with category-based filtering and search.
- **Course Purchase** — Secure one-click course enrollment via Stripe Checkout. Stripe webhooks automatically provision access upon successful payment.
- **Video Streaming** — HLS-based adaptive video streaming powered by Mux. Video quality dynamically adjusts to the student's network conditions for smooth, uninterrupted playback.
- **Chapter Completion Tracking** — Mark individual chapters as complete or uncomplete. Progress percentage is recalculated in real-time.
- **Personalized Dashboard** — View all enrolled courses, completion percentages, and per-course progress at a glance.
- **Course Recommendation System** — Courses are dynamically recommended based on the **Apriori algorithm (Association Rule Mining)** using cross-user purchasing patterns and historical data.

### Teacher / Instructor Features

- **Course Creation & Management** — Create courses with title, description, category, thumbnail, and price via a simple, intuitive interface accessible at `/teacher/courses`.
- **Chapter Management** — Create, edit, reorder, and delete chapters. Drag-and-drop reordering powered by `@hello-pangea/dnd`.
- **Video Upload & Streaming** — Upload chapter videos via UploadThing. Each upload automatically triggers Mux asset creation for HLS transcoding and streaming.
- **Rich Text Descriptions** — Chapter descriptions support rich text formatting via React Quill editor.
- **File Attachments** — Attach supplementary materials (PDFs, documents) to individual chapters.
- **Publish Controls** — Independently toggle published/unpublished status for each course and chapter.
- **Analytics Dashboard** — Track total revenue and per-course enrollment data with interactive charts (Recharts). Best-selling courses are ranked using a custom **QuickSort algorithm** by enrollment count.
- **Revenue Model** — The platform takes a **5% commission** on every course purchase. Teachers receive **95% of every sale** as their direct earnings.
- **Student Progress Insights** — View detailed analytics per course including enrolled students, their individual progress percentages, completed chapters, and last active dates.

### Admin Panel Features

The Admin Panel (`/admin`) is a secure, role-restricted dashboard accessible only to users with the `ADMIN` role in the database (verified via Prisma DB at the layout level), or via a temporary `admin_authorized` cookie from the `/admin-login` page.

- **Content Moderation Queue** — Review and approve teacher-uploaded courses before they go live on the platform. The admin can approve or reject submissions from a centralized moderation interface at `/admin/courses`.
- **Platform-Wide Revenue Analytics** — A comprehensive revenue overview dashboard at `/admin/revenue` showing the platform's total earnings, commission collected, and teacher payouts across all courses and purchases.
- **Account Recovery Logs** — A security monitoring interface at `/admin/recovery` that tracks all password reset requests across the platform, flagging suspicious or unusual account recovery activities.

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **UI Library** | React 18 |
| **Styling** | Tailwind CSS v4, shadcn/ui (Radix UI) |
| **Database** | PostgreSQL (NeonDB — serverless) |
| **ORM** | Prisma v5 |
| **Authentication** | NextAuth.js v5 (Credentials Provider + JWT) |
| **Email** | Nodemailer (SMTP — verification & password reset) |
| **Video** | Mux (Upload, HLS Transcoding & Streaming) |
| **Payments** | Stripe (Checkout + Webhooks) |
| **File Uploads** | UploadThing (CDN-hosted thumbnails, videos, attachments) |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod validation |
| **Drag & Drop** | @hello-pangea/dnd |
| **State Management** | Zustand |
| **Deployment** | Vercel (globally distributed edge network) |

---

## System Architecture

GyanSagar is structured into the following major components:

- **Frontend** — Next.js App Router pages and React components for the student portal, chapter viewer, instructor course editor, and analytics dashboard.
- **API Routes** — Next.js Route Handlers serving as the backend REST API for CRUD operations on courses, chapters, user progress, and purchases.
- **Authentication** — NextAuth.js middleware with JWT-based session management, role-based routing, email verification, and forgot-password token flows.
- **Database** — Prisma Client connected to a NeonDB PostgreSQL serverless database.
- **Video Pipeline** — UploadThing (upload) → Mux SDK (HLS transcoding) → MuxPlayer React component (student streaming).
- **Payment Pipeline** — Stripe Checkout Session → Stripe Webhook (`checkout.session.completed`) → Prisma `Purchase` record creation → Course access granted.
- **Email Pipeline** — Nodemailer SMTP → Verification emails on registration → Password reset emails on request.

---

## Getting Started

### Prerequisites

- Node.js v18+
- A PostgreSQL database (e.g., [NeonDB](https://neon.tech) free tier)
- Accounts for: Stripe, Mux, UploadThing, and an SMTP email provider

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sandeshsubedi9/gyan-sagar.git
   cd gyan-sagar
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your `.env` file** with your database URL, API keys, and SMTP credentials (see the services listed in the Tech Stack above).

4. **Push the Prisma schema to your database:**
   ```bash
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Starts the dev server with Turbopack |
| `npm run build` | Builds the app for production |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint |

---

## Algorithms

### QuickSort — Best-Selling Course Ranking

A custom QuickSort algorithm (implemented from scratch) ranks courses on the instructor analytics dashboard by total enrollment count in descending order.

- **Time Complexity:** O(n log n) average, O(n²) worst case
- **Space Complexity:** O(log n) due to recursive call stack

### Apriori Algorithm — Course Recommendation System

Association Rule Mining using the Apriori algorithm analyzes cross-user purchasing patterns. Students see course suggestions based on what other students with similar purchase histories have enrolled in.

### Progress Calculation

Course progress is calculated as:
```
Progress (%) = (Completed Chapters / Total Published Chapters) × 100
```
Stored and updated in the `UserProgress` model via upsert on every chapter completion toggle.

---

## Limitations & Future Work

### Current Limitations
- No live/synchronous classes
- No quizzes, assignments, or graded assessments
- No discussion forums or community features
- No certificate generation upon completion
- Interface is English-only (no Nepali language support)

### Planned Future Enhancements
- **Quiz & Assessment Module** — Chapter-level quizzes with automated grading
- **Live Classes** — WebRTC or third-party conferencing (Agora / Daily.co)
- **Discussion Forums** — Course-level peer interaction boards
- **Certificate Generation** — Auto-generated PDF certificates on course completion
- **Nepali Language (i18n)** — Full internationalization support
- **AI Course Recommendations** — Collaborative filtering for personalized discovery
- **Mobile App** — React Native iOS & Android applications
- **Subscription Model** — Monthly subscription for unlimited course access

---

## Project Info

| | |
|---|---|
| **Institution** | Tribhuvan University, Institute of Science and Technology |
| **Campus** | Prithvi Narayan Campus, Bagar Pokhara |
| **Program** | Bachelor of Science in Computer Science and Information Technology (BScCSIT) |
| **Team** | Sangam Mainali, Amrit Bashyal |
| **Supervisor** | Dev Timilsina, Department of Computer Science |
