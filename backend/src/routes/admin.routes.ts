import { Router, Response } from "express";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = Router();

// GET /api/admin/pending-tutors
router.get(
  "/pending-tutors",
  authenticate,
  authorize("ADMIN"),
  async (_req: AuthRequest, res: Response) => {
    try {
      const tutors = await prisma.tutorProfile.findMany({
        where: { verificationStatus: "PENDING" },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.json({ success: true, data: tutors });
    } catch (error) {
      return res.status(500).json({ success: false, error: "Failed to fetch pending tutors" });
    }
  }
);

// PATCH /api/admin/verify-tutor/:id
router.patch(
  "/verify-tutor/:id",
  authenticate,
  authorize("ADMIN"),
  async (req: AuthRequest, res: Response) => {
    try {
      const { status } = req.body;

      const tutor = await prisma.tutorProfile.update({
        where: { id: req.params.id },
        data: { verificationStatus: status },
      });

      return res.json({ success: true, data: tutor });
    } catch (error) {
      return res.status(500).json({ success: false, error: "Failed to verify tutor" });
    }
  }
);

// GET /api/admin/stats
router.get(
  "/stats",
  authenticate,
  authorize("ADMIN"),
  async (_req: AuthRequest, res: Response) => {
    try {
      const [
        totalUsers,
        totalTutors,
        totalStudents,
        totalBookings,
        pendingTutors,
        revenue,
        recentBookings,
        pendingTutorsList,
        recentUsers,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: "TUTOR" } }),
        prisma.user.count({ where: { role: "STUDENT" } }),
        prisma.booking.count(),
        prisma.tutorProfile.count({ where: { verificationStatus: "PENDING" } }),
        prisma.payment.aggregate({
          _sum: { amount: true },
          where: { status: "COMPLETED" },
        }),
        prisma.booking.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            student: { select: { id: true, name: true, email: true } },
            tutor: {
              include: {
                user: { select: { id: true, name: true } },
              },
            },
          },
        }),
        prisma.tutorProfile.findMany({
          where: { verificationStatus: "PENDING" },
          take: 5,
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.user.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: { id: true, name: true, email: true, role: true, createdAt: true },
        }),
      ]);

      return res.json({
        success: true,
        data: {
          totalUsers,
          totalTutors,
          totalStudents,
          totalBookings,
          pendingTutors,
          revenue: revenue._sum.amount || 0,
          recentBookings,
          pendingTutorsList,
          recentUsers,
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: "Failed to fetch stats" });
    }
  }
);

// GET /api/admin/bookings
router.get(
  "/bookings",
  authenticate,
  authorize("ADMIN"),
  async (req: AuthRequest, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;
      const { search, status } = req.query;

      const where: any = {};
      if (status && status !== "ALL") {
        where.status = status;
      }
      if (search) {
        where.OR = [
          { student: { name: { contains: search as string, mode: "insensitive" } } },
          { tutor: { user: { name: { contains: search as string, mode: "insensitive" } } } },
        ];
      }

      const [bookings, total] = await Promise.all([
        prisma.booking.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            student: { select: { id: true, name: true, email: true, phone: true } },
            tutor: {
              include: {
                user: { select: { id: true, name: true } },
              },
            },
          },
        }),
        prisma.booking.count({ where }),
      ]);

      return res.json({
        success: true,
        data: bookings,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: "Failed to fetch bookings" });
    }
  }
);

// GET /api/admin/users
router.get(
  "/users",
  authenticate,
  authorize("ADMIN"),
  async (req: AuthRequest, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;
      const { search, role } = req.query;

      const where: any = {};
      if (role && role !== "ALL") {
        where.role = role;
      }
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: "insensitive" } },
          { email: { contains: search as string, mode: "insensitive" } },
        ];
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
        }),
        prisma.user.count({ where }),
      ]);

      return res.json({
        success: true,
        data: users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: "Failed to fetch users" });
    }
  }
);

// GET /api/admin/tutors
router.get(
  "/tutors",
  authenticate,
  authorize("ADMIN"),
  async (req: AuthRequest, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;
      const { search, status } = req.query;

      const where: any = {};
      if (status && status !== "ALL") {
        where.verificationStatus = status;
      }
      if (search) {
        where.user = {
          OR: [
            { name: { contains: search as string, mode: "insensitive" } },
            { email: { contains: search as string, mode: "insensitive" } },
          ],
        };
      }

      const [tutors, total] = await Promise.all([
        prisma.tutorProfile.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { id: true, name: true, email: true, phone: true } },
          },
        }),
        prisma.tutorProfile.count({ where }),
      ]);

      return res.json({
        success: true,
        data: tutors,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: "Failed to fetch tutors" });
    }
  }
);

// GET /api/admin/students
router.get(
  "/students",
  authenticate,
  authorize("ADMIN"),
  async (req: AuthRequest, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;
      const { search } = req.query;

      const where: any = { role: "STUDENT" };
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: "insensitive" } },
          { email: { contains: search as string, mode: "insensitive" } },
        ];
      }

      const [students, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          select: { id: true, name: true, email: true, phone: true, createdAt: true },
        }),
        prisma.user.count({ where }),
      ]);

      return res.json({
        success: true,
        data: students,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: "Failed to fetch students" });
    }
  }
);

export default router;
