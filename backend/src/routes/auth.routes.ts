import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { generateToken, authenticate, AuthRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import prisma from "../lib/prisma";

const router = Router();

// Validation Schemas
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters long"),
  role: z.enum(["STUDENT", "TUTOR"]),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// POST /api/auth/register
router.post("/register", validate(registerSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: "Passwords do not match" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role,
        // Create an empty tutor profile for tutors
        ...(role === "TUTOR" && {
          tutorProfile: {
            create: {
              subjects: [],
              classes: [],
              mediums: [],
              availableSlots: [],
            },
          },
        }),
      },
      select: { id: true, name: true, email: true, phone: true, role: true, avatarUrl: true, createdAt: true },
    });

    const token = generateToken(user.id, user.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({ success: true, data: { user, token } });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, error: "Registration failed" });
  }
});

// POST /api/auth/login
router.post("/login", validate(loginSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    if (user.isBanned) {
      return res.status(403).json({ success: false, error: "Your account has been suspended by the administrator." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    const token = generateToken(user.id, user.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.json({ success: true, data: { user: userWithoutPassword, token } });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, error: "Login failed" });
  }
});

// POST /api/auth/logout
router.post("/logout", (_req: AuthRequest, res: Response) => {
  res.clearCookie("token");
  return res.json({ success: true, message: "Logged out successfully" });
});

// GET /api/auth/me
router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatarUrl: true,
        tutorProfile: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to get user" });
  }
});

// PUT /api/auth/profile
router.put("/profile", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, avatarUrl } = req.body;
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { name, phone, avatarUrl },
      select: { id: true, name: true, email: true, phone: true, role: true, avatarUrl: true, createdAt: true },
    });
    return res.json({ success: true, data: user });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ success: false, error: "Failed to update profile settings" });
  }
});

export default router;
