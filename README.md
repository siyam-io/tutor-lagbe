# Tutor Lagbe (টিউটর লাগবে) 🎓

> **Bangladesh's Premier Full-Stack Tutoring & Tuition Marketplace Platform**  
> Connecting students, parents, and verified expert tutors across Bangladesh seamlessly.

[![Next.js](https://img.shields.io/badge/Next.js-15%20App%20Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.19-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.14-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-4169E1?style=for-the-badge&logo=postgresql)](https://neon.tech/)

---

live link -[https://tutor-lagbe-eight.vercel.app]

## 🌟 Key Features

### 👨‍🎓 For Students & Parents
- **Advanced Tutor Search & Discovery:** Filter by Subject, Medium (Bangla Medium, English Version, English Medium), Class/Level, Location (District & Thana), Gender, and Salary.
- **Tuition Job Board:** Post tuition requirements with detailed curriculum, days per week, timing, and expected budget.
- **Review & Accept Applications:** View tutor proposals, credentials, and select the best candidate.
- **Direct Booking:** Book demo/regular sessions directly from a tutor's schedule slots.
- **Ratings & Reviews:** Leave verified feedback and ratings after sessions.
- **Wishlist:** Bookmark favorite tutors for quick access.

### 👨‍🏫 For Tutors
- **Verified Tutor Profiles:** Showcase educational qualifications, institution (BUET, DU, DMC, etc.), subjects, teaching experience, and salary preferences.
- **Blue Badge Verification:** Submit NID and university credentials for administrative verification.
- **Browse & Apply to Tuitions:** Filter through tuition openings across Bangladesh and submit tailored cover letters.
- **Tutor Dashboard:** Track application statuses, active student bookings, earnings analytics, and schedule calendar.
- **Earnings & Payouts:** Track balance and submit withdrawal requests (bKash, Nagad, Bank transfer).

### 🛠️ For Administrators
- **Complete Management Dashboard:** Platform KPIs, revenue metrics, active tuitions, and registered users.
- **Tutor Verification Queue:** Review submitted NID/student ID documents, approve or reject credentials with real-time badges.
- **Tuition & Booking Governance:** Manage reported posts, disputes, and oversee escrow payments.

---

## 🏗️ Architecture & Tech Stack

```
tutor-lagbe/
├── frontend/             # Next.js 15 App Router Frontend
│   ├── src/app/          # 31+ Optimized pages (Student/Tutor/Admin portals)
│   ├── src/components/   # Reusable UI components & layouts
│   ├── src/store/        # Zustand state management
│   └── src/lib/          # API Axios clients & utilities
├── backend/              # Node.js + Express REST API Backend
│   ├── src/controllers/  # Business logic controllers
│   ├── src/middleware/   # Auth (JWT), Rate limiting & Zod validators
│   ├── src/routes/       # Modular REST endpoints
│   ├── prisma/           # Prisma schema & database migrations
│   └── scripts/          # Realistic database migration & seeding scripts
├── shared/               # Shared TypeScript domain types & interfaces
└── render.yaml           # One-click Render deployment blueprint
```

### Technology Highlights
- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Zustand.
- **Backend:** Express.js, TypeScript, Prisma ORM, JSON Web Tokens (JWT), Bcrypt, Helmet, Express Rate Limit.
- **Database:** PostgreSQL (Neon Serverless DB with connection pooling).
- **Design System:** Neumorphic & Botanical Organic surfaces with Bengali typography fallback.

---

## 🔑 Ready Demo Test Accounts

The platform comes pre-seeded with realistic Bangladeshi educational data. You can log in using any of the following accounts:

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@gmail.com` | `123456` | Full administrative control & verification management |
| **Verified Tutor** | `tutor@gmail.com` | `123456` | Nafis Fuad (BUET CSE, Approved Verified Profile) |
| **Student / Parent** | `student@gmail.com` | `123456` | Tanvir Rahman (Student & tuition post manager) |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ or 20+
- PostgreSQL database (or free [Neon.tech](https://neon.tech) connection string)

### 1. Clone the repository
```bash
git clone https://github.com/siyam-io/tutor-lagbe.git
cd tutor-lagbe
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
cd ..
```

### 3. Setup Environment Variables

Create `.env` in `backend/`:
```env
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
```

Create `.env.local` in `frontend/`:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
BACKEND_API_URL="http://localhost:5000"
```

### 4. Database Setup & Seeding
```bash
cd backend
# Push schema to database
npx prisma db push

# Seed realistic Bangladeshi tutors, students, and tuition posts
npx tsx scripts/migrate_realistic_data.ts
cd ..
```

### 5. Run Development Servers
```bash
# Start backend (Port 5000)
npm --prefix backend run dev

# Start frontend (Port 3000)
npm --prefix frontend run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment Guide

### Deploy Backend on [Render](https://render.com)
1. Create a new **Web Service** on Render and connect your GitHub repository.
2. Configure settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
3. Add Environment Variables:
   - `DATABASE_URL`: `your-neon-postgresql-url`
   - `JWT_SECRET`: `your-secret-key`
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `https://your-frontend.vercel.app`

### Deploy Frontend on [Vercel](https://vercel.com)
1. Import repository into Vercel.
2. Select **Next.js** framework preset.
3. Set **Root Directory** to `frontend`.
4. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: `https://your-render-backend.onrender.com/api`
   - `BACKEND_API_URL`: `https://your-render-backend.onrender.com`
5. Click **Deploy**.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
