import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import { apiLimiter, authLimiter, uploadLimiter } from "./middleware/rateLimit";

import authRoutes from "./routes/auth.routes";
import tutorRoutes from "./routes/tutor.routes";
import bookingRoutes from "./routes/booking.routes";
import adminRoutes from "./routes/admin.routes";
import reviewRoutes from "./routes/review.routes";
import messageRoutes from "./routes/message.routes";
import notificationRoutes from "./routes/notification.routes";
import paymentRoutes from "./routes/payment.routes";
import uploadRoutes from "./routes/upload.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import withdrawalRoutes from "./routes/withdrawal.routes";
import tuitionRoutes from "./routes/tuition.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use(helmet());

// Rate Limiting
app.use("/api", apiLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/upload", uploadLimiter);

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:3001",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// Request logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tutors", tutorRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/tuitions", tuitionRoutes);

// Global error handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    // Log the error securely
    console.error(`[Error] ${err.name || "Error"}: ${err.message}`);
    if (process.env.NODE_ENV !== "production" && err.stack) {
      console.error(err.stack);
    }
    
    const statusCode = err.status || err.statusCode || 500;
    const errorMessage = process.env.NODE_ENV === "production" && statusCode === 500
      ? "Internal server error"
      : err.message || "Internal server error";

    res.status(statusCode).json({ success: false, error: errorMessage });
  }
);

app.listen(PORT, () => {
  console.log(`🚀 Tutor Lagbe API running on http://localhost:${PORT}`);
});

export default app;
