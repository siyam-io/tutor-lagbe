// ============================================================
// Tutor Lagbe - Shared Types
// Used by both frontend and backend
// ============================================================

// ─── Enums ─────────────────────────────────────────────────
export enum Role {
  STUDENT = "STUDENT",
  TUTOR = "TUTOR",
  ADMIN = "ADMIN",
}

export enum VerificationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum BookingStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum TuitionType {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

// ─── User ──────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  role: Role;
}

export interface LoginPayload {
  email: string;
  password: string;
  role?: Role;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ─── Tutor Profile ─────────────────────────────────────────
export interface TutorProfile {
  id: string;
  userId: string;
  user?: User;
  bio?: string;
  photoUrl?: string;
  coverPhotoUrl?: string;
  subjects: string[];
  classes: string[];
  mediums: string[];
  gender?: string;
  locationDistrict?: string;
  locationArea?: string;
  expectedSalary?: number;
  hourlyRate?: number;
  experienceYears: number;
  qualification?: string;
  institution?: string;
  verificationStatus: VerificationStatus;
  nidNumber?: string;
  documentUrl?: string;
  availableSlots: string[];
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface TutorFilters {
  subject?: string;
  class?: string;
  medium?: string;
  gender?: string;
  locationDistrict?: string;
  locationArea?: string;
  minBudget?: number;
  maxBudget?: number;
  minExperience?: number;
  minRating?: number;
  page?: number;
  limit?: number;
}

// ─── Booking ───────────────────────────────────────────────
export interface Booking {
  id: string;
  studentId: string;
  student?: User;
  tutorProfileId: string;
  tutor?: TutorProfile;
  date: string;
  timeSlot: string;
  tuitionType: TuitionType;
  address?: string;
  status: BookingStatus;
  notes?: string;
  amount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingPayload {
  tutorProfileId: string;
  date: string;
  timeSlot: string;
  tuitionType: TuitionType;
  address?: string;
  notes?: string;
}

// ─── Review ────────────────────────────────────────────────
export interface Review {
  id: string;
  studentId: string;
  student?: User;
  tutorProfileId: string;
  tutor?: TutorProfile;
  rating: number;
  comment?: string;
  createdAt: string;
}

// ─── Message ───────────────────────────────────────────────
export interface Message {
  id: string;
  senderId: string;
  sender?: User;
  receiverId: string;
  receiver?: User;
  content: string;
  fileUrl?: string;
  isRead: boolean;
  createdAt: string;
}

// ─── Notification ──────────────────────────────────────────
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "BOOKING_ACCEPTED" | "SESSION_REMINDER" | "PAYMENT_SUCCESS" | "NEW_MESSAGE";
  isRead: boolean;
  createdAt: string;
}

// ─── Payment ───────────────────────────────────────────────
export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  method: "BKASH" | "NAGAD" | "ROCKET" | "VISA" | "MASTERCARD";
  status: "PENDING" | "COMPLETED" | "FAILED";
  transactionId?: string;
  createdAt: string;
}

// ─── API Response Wrappers ─────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Subject / Class Constants ─────────────────────────────
export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Bengali",
  "ICT",
  "Accounting",
  "Economics",
  "Business Studies",
  "Geography",
  "History",
  "Sociology",
  "Psychology",
  "Computer Science",
] as const;

export const CLASSES = [
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
  "Admission Test",
  "University",
  "Language Learning",
] as const;

export const MEDIUMS = [
  "Bangla Medium",
  "English Version",
  "English Medium",
  "Madrasa",
] as const;

export const DISTRICTS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
  "Gazipur",
  "Narayanganj",
  "Comilla",
  "Bogra",
  "Jessore",
] as const;

export const TUITION_TYPE_LABELS: Record<TuitionType, string> = {
  [TuitionType.ONLINE]: "Online",
  [TuitionType.OFFLINE]: "Offline (Home Tuition)",
};
