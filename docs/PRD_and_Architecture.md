# Product Requirement Document (PRD) & Technical Architecture
## Project: Tutor Lagbe (টিউটর লাগবে)

This document serves as the absolute source of truth for the "Tutor Lagbe" platform. Any developer or AI agent can use this document to understand the specifications, user flows, database schema, API contracts, and exact page layouts required to complete this project.

---

## 1. Project Overview
**Tutor Lagbe** is a tutor matching platform tailored for the Bangladeshi market. It connects students and parents with qualified tutors for home tuitions, online classes, and group studies. 

### Key Stakeholders
1. **Student / Parent:** Searches for tutors, views profiles, requests bookings, tracks upcoming sessions, and reviews tutors.
2. **Tutor:** Creates a detailed professional profile, manages schedule/slots, accepts/rejects tuition requests, and tracks earnings.
3. **Admin:** Verifies tutor certificates/profiles, manages platform users, monitors bookings, and reviews reports.

---

## 2. Technical Stack
* **Frontend:** Next.js (App Router, Tailwind CSS for UI)
* **Backend:** Node.js + Express.js (REST API, TypeScript preferred)
* **Database:** PostgreSQL (Managed via Prisma ORM)
* **State Management:** Zustand (for client-side global state)
* **Authentication:** JWT (JSON Web Tokens) with Secure Cookies/Headers (for Express-Next.js auth sharing)

---

## 3. Database Schema (Prisma Representation)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  STUDENT
  TUTOR
  ADMIN
}

enum VerificationStatus {
  PENDING
  APPROVED
  REJECTED
}

enum BookingStatus {
  PENDING
  ACCEPTED
  REJECTED
  COMPLETED
}

enum TuitionType {
  ONLINE
  OFFLINE
}

model User {
  id             String        @id @default(uuid())
  name           String
  email          String        @unique
  phone          String?
  password       String
  role           Role          @default(STUDENT)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  
  // Relations
  tutorProfile   TutorProfile?
  bookingsAsStudent Booking[]  @relation("StudentBookings")
  reviewsWritten Review[]      @relation("StudentReviews")
}

model TutorProfile {
  id                 String             @id @default(uuid())
  userId             String             @unique
  user               User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Profile fields
  bio                String?
  photoUrl           String?
  coverPhotoUrl      String?
  subjects           String[]           // e.g., ["Math", "Physics"]
  classes            String[]           // e.g., ["Class 9", "Class 10"]
  mediums            String[]           // e.g., ["Bangla Medium", "English Version"]
  gender             String?
  locationDistrict   String?
  locationArea       String?
  expectedSalary     Float?             // Budget/Price
  experienceYears    Int                @default(0)
  qualification      String?            // e.g., "B.Sc. in CSE from BUET"
  
  // Verification
  verificationStatus VerificationStatus @default(PENDING)
  nidNumber          String?
  documentUrl        String?            // URL of certificate/NID image
  
  // Schedule availability
  availableSlots     String[]           // e.g., ["Sat-10:00", "Sun-15:00"]
  
  // Relations
  bookings           Booking[]
  reviews            Review[]
}

model Booking {
  id             String        @id @default(uuid())
  studentId      String
  student        User          @relation("StudentBookings", fields: [studentId], references: [id])
  tutorProfileId String
  tutor          TutorProfile  @relation(fields: [tutorProfileId], references: [id])
  
  date           DateTime
  timeSlot       String
  tuitionType    TuitionType
  address        String?
  status         BookingStatus @default(PENDING)
  notes          String?
  
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}

model Review {
  id             String        @id @default(uuid())
  studentId      String
  student        User          @relation("StudentReviews", fields: [studentId], references: [id])
  tutorProfileId String
  tutor          TutorProfile  @relation(fields: [tutorProfileId], references: [id])
  
  rating         Int           // 1 to 5
  comment        String?
  createdAt      DateTime      @default(now())
}
```

---

## 4. API Endpoints (Backend Express.js)

### Auth Endpoints
* `POST /api/auth/register` - Register a new student or tutor.
* `POST /api/auth/login` - Login user, return HTTP-Only cookie with JWT.
* `POST /api/auth/logout` - Clear cookie.
* `POST /api/auth/forgot-password` - Trigger reset password OTP/link.
* `POST /api/auth/reset-password` - Complete password reset.

### Tutor Profile Endpoints
* `GET /api/tutors` - Fetch and filter verified tutor profiles.
* `GET /api/tutors/:id` - Fetch detailed profile of a tutor.
* `PUT /api/tutors/profile` - Update profile details (Auth: Tutor).
* `POST /api/tutors/verify` - Upload NID/Certificate files (Auth: Tutor).

### Booking Endpoints
* `POST /api/bookings` - Create a booking request (Auth: Student).
* `GET /api/bookings/student` - Get student's booking history (Auth: Student).
* `GET /api/bookings/tutor` - Get tutor's received requests (Auth: Tutor).
* `PATCH /api/bookings/:id/status` - Accept or reject request (Auth: Tutor).

### Admin Endpoints
* `GET /api/admin/pending-tutors` - List all unverified tutors.
* `PATCH /api/admin/verify-tutor/:id` - Approve/Reject tutor status.

---

## 5. Detailed Page-by-Page Specifications

### Page 1: Landing Page (Homepage)
* **Route:** `/`
* **Layout & UI:**
  * **Hero Section:** Captivating headline ("যোগ্য শিক্ষক খুঁজছেন?"), a visual graphic/illustration, and search bar shortcuts.
  * **Search Tutor:** Compact search form with fields (Subject, Location/Area, Medium) leading to `/find-tutor` with query params.
  * **Popular Subjects:** Visual grid of subject cards (e.g., Mathematics, Physics, English, Chemistry) with icons.
  * **Featured Tutors:** Horizontal carousel of top-rated, approved tutor cards displaying tutor photo, rating stars, name, institution, and price.
  * **Why Choose Us:** Section illustrating platform benefits (Verified Tutors, Fast Booking, Safe Payments).
  * **Testimonials:** Clean cards showing feedback from parents/students.
  * **Footer:** Links to about, contact, social media profiles, and copyright info.

### Page 2: Login Page
* **Route:** `/login`
* **Layout & UI:**
  * Clean, split-pane layout (left: brand illustration, right: interactive login box).
  * Toggle options for **Student Login** vs **Tutor Login**.
  * Input fields: Email, Password.
  * **Google Login:** Button for one-click OAuth login.
  * **Forgot Password:** Text link pointing to password recovery page.
  * **Sign Up Link:** Prominent redirect to `/register`.

### Page 3: Registration Page
* **Route:** `/register`
* **Layout & UI:**
  * Interactive switch to select **Student Account** vs **Tutor Account**.
  * Input Fields: Full Name, Email, Phone Number, Password, Confirm Password.
  * Action button: **Create Account** (triggers registration request and logs the user in).

### Page 4: Find Tutor Page
* **Route:** `/find-tutor`
* **Layout & UI:**
  * Two-column layout (left: filters panel on desktop/top on mobile, right: results list).
  * **Filters Panel:** 
    * Subject (Dropdown/Multi-select)
    * Class (Dropdown)
    * Medium (Bangla, English Version, English Medium)
    * Gender (Male, Female, Any)
    * Location (District, Area input)
    * Budget Slider (Price range)
    * Experience (Minimum years)
  * **Tutor Cards Grid:** Displays matching tutor results showing Photo, Name, Rating stars, Price, Years of Experience, and a prominent **View Profile** button.

### Page 5: Tutor Profile Page
* **Route:** `/tutors/[id]`
* **Layout & UI:**
  * Premium banner design containing:
    * Cover Photo and overlayed Profile Picture.
    * Verification Badge (Approved vs Pending).
    * Aggregate Rating & Reviews count.
  * Tabbed layout or structured sections:
    * **About:** Bio, Qualification (e.g. BUET, DU), and Experience details.
    * **Subjects & Classes:** Badges indicating subjects taught.
    * **Availability Calendar:** Visual calendar showing available slots.
    * **Book Now Card:** Sticky booking card that links to `/booking?tutorId=[id]`.

### Page 6: Booking Page
* **Route:** `/booking`
* **Layout & UI:**
  * Beautiful multi-step booking card.
  * **Step 1:** Select Date (using a calendar picker) and Select Time Slot.
  * **Step 2:** Choose Tuition Type (Online vs Offline) and input exact class address/contact info.
  * **Step 3: Payment Summary:** Breakdown of hourly rate, monthly fee, platform service fee, and total.
  * Action Button: **Book Session** (submits the form to backend).

### Page 7: Scheduling Page
* **Route:** `/schedule`
* **Layout & UI:**
  * Interactive Calendar UI (Monthly / Weekly views).
  * Side panel showing **Available Slots** edit panel (for tutors) or **Upcoming Classes** notifications (for both).
  * Color-coded status events (e.g. Green: confirmed classes, Orange: pending booking requests).

### Page 8: Student Dashboard
* **Route:** `/dashboard/student`
* **Layout & UI:**
  * Left Sidebar navigation: Dashboard, My Bookings, Schedule, Messages, Payments, Reviews, Settings.
  * Main view cards:
    * **Stats:** Upcoming Classes Count, Total Spent, Active Tutors.
    * **Recent Tutors List:** Tutors booked with ratings.
    * **Notifications panel:** Alerts about accepted bookings or session reminders.

### Page 9: Tutor Dashboard
* **Route:** `/dashboard/tutor`
* **Layout & UI:**
  * Left Sidebar navigation: Dashboard, Analytics, Earnings, Requests, Schedule, Settings.
  * Analytics section: Graphical charts displaying **Monthly Income** and **Student Growth** statistics.
  * **Tuition Requests Panel:** Quick Accept / Reject buttons for incoming booking requests.
  * Stats display: Total Earnings, Total Active Students, Upcoming Sessions.

### Page 10: Payment Page
* **Route:** `/payments`
* **Layout & UI:**
  * Payment Summary container showcasing due fees.
  * Grid of local and international payment cards:
    * **bKash, Nagad, Rocket** (Bangladeshi mobile banking buttons).
    * **Visa, Mastercard** (Debit/Credit options).
  * Checkout forms (mocked until Phase 2 API integration).

### Page 11: Chat Page
* **Route:** `/messages`
* **Layout & UI:**
  * Split messenger style.
  * Left: Chat List (list of active tutor/student chats with avatar & last message snippet).
  * Right: Conversation window with instant messaging interface, file upload icon, and a **Video Call** quick link button.

### Page 12: Reviews Page
* **Route:** `/reviews`
* **Layout & UI:**
  * List of all student reviews left for the tutor (including star rating breakdown: 5-star to 1-star bar chart).
  * Interactive **Write Review** text area with interactive interactive star selection.

### Page 13: Notifications Page
* **Route:** `/notifications`
* **Layout & UI:**
  * List of notification cards sorted chronologically.
  * Types: Booking Accepted, Session Reminder, Payment Successful, New Message alert.

### Page 14: Admin Dashboard
* **Route:** `/admin`
* **Layout & UI:**
  * Sidebar: Users, Tutors, Students, Reports, Bookings, Payments, Settings.
  * Statistics Cards: Total Users, Active Tutors, Platform Revenue, Pending Verification Requests.
  * **Tutor Verification Queue:** Table showing pending tutors, NID scan links, certificate links, and Approve / Reject buttons.

### Page 15: Settings Page
* **Route:** `/settings`
* **Layout & UI:**
  * Tabs: Profile Update, Password Change, Notification Preferences, System Preferences (Dark Mode toggle).

### Page 16: About Us
* **Route:** `/about`
* **Layout & UI:**
  * Mission & Vision statements.
  * Founders / Team profile cards.
  * Interactive FAQ accordion (Frequently Asked Questions).

### Page 17: Contact Page
* **Route:** `/contact`
* **Layout & UI:**
  * Two columns:
    * Left: Contact Form (Name, Email, Message submit button).
    * Right: Office Address details, Embedded Google Map placeholder, and Social media link icons.
