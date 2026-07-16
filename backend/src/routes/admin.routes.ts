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

      // Notify the tutor
      await prisma.notification.create({
        data: {
          userId: tutor.userId,
          title: `Verification ${status === "APPROVED" ? "Approved" : "Rejected"}`,
          message: status === "APPROVED" 
            ? "Your tutor profile has been approved! You can now receive tuition bookings."
            : "Your tutor profile verification request was rejected. Please review your credentials.",
          type: `VERIFICATION_${status}`,
        },
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
          select: { id: true, name: true, email: true, role: true, isBanned: true, createdAt: true },
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
          select: { id: true, name: true, email: true, role: true, phone: true, isBanned: true, createdAt: true },
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
          select: { id: true, name: true, email: true, phone: true, isBanned: true, createdAt: true },
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

// GET /api/admin/users/:id/bookings - Get user's bookings history (Auth: Admin)
router.get(
  "/users/:id/bookings",
  authenticate,
  authorize("ADMIN"),
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const bookings = await prisma.booking.findMany({
        where: {
          OR: [
            { studentId: id },
            { tutor: { userId: id } }
          ]
        },
        include: {
          student: { select: { name: true, email: true } },
          tutor: {
            include: {
              user: { select: { name: true } }
            }
          }
        },
        orderBy: { createdAt: "desc" }
      });

      return res.json({ success: true, data: bookings });
    } catch (error) {
      console.error("Fetch user bookings error:", error);
      return res.status(500).json({ success: false, error: "Failed to fetch user bookings history" });
    }
  }
);

// PATCH /api/admin/users/:id/ban - Toggle User Ban (Auth: Admin)
router.patch(
  "/users/:id/ban",
  authenticate,
  authorize("ADMIN"),
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        select: { isBanned: true },
      });

      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { isBanned: !user.isBanned },
        select: { id: true, name: true, isBanned: true },
      });

      return res.json({ success: true, data: updatedUser });
    } catch (error) {
      console.error("Toggle ban error:", error);
      return res.status(500).json({ success: false, error: "Failed to toggle user ban status" });
    }
  }
);

// GET /api/admin/payments - Get all payments (Auth: Admin)
router.get(
  "/payments",
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
          { transactionId: { contains: search as string, mode: "insensitive" } },
          { method: { contains: search as string, mode: "insensitive" } },
        ];
      }

      const [payments, total] = await Promise.all([
        prisma.payment.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.payment.count({ where }),
      ]);

      // Enrich payments with user and booking details since they don't have direct relations
      const enrichedPayments = await Promise.all(
        payments.map(async (payment) => {
          const user = await prisma.user.findUnique({
            where: { id: payment.userId },
            select: { id: true, name: true, email: true },
          });

          const booking = await prisma.booking.findUnique({
            where: { id: payment.bookingId },
            include: {
              tutor: {
                include: {
                  user: { select: { name: true } },
                },
              },
            },
          });

          return {
            ...payment,
            student: user,
            booking: booking ? {
              id: booking.id,
              date: booking.date,
              tuitionType: booking.tuitionType,
              tutorName: booking.tutor?.user?.name || "Tutor",
            } : null,
          };
        })
      );

      return res.json({
        success: true,
        data: enrichedPayments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Admin fetch payments error:", error);
      return res.status(500).json({ success: false, error: "Failed to fetch payments" });
    }
  }
);

// GET /api/admin/reports - Get report and statistics (Auth: Admin)
router.get(
  "/reports",
  authenticate,
  authorize("ADMIN"),
  async (_req: AuthRequest, res: Response) => {
    try {
      // 1. Monthly revenue report (for the last 6 months)
      const completedPayments = await prisma.payment.findMany({
        where: { status: "COMPLETED" },
        select: { amount: true, createdAt: true },
      });

      const monthlyRevenueMap: { [key: string]: number } = {};
      completedPayments.forEach((p) => {
        const monthYear = p.createdAt.toLocaleString("default", { month: "short", year: "2-digit" });
        monthlyRevenueMap[monthYear] = (monthlyRevenueMap[monthYear] || 0) + p.amount;
      });

      const monthlyRevenue = Object.entries(monthlyRevenueMap).map(([month, amount]) => ({
        month,
        amount,
      })).slice(-6); // Last 6 months

      // 2. Booking status breakdown
      const bookingStatusBreakdown = await prisma.booking.groupBy({
        by: ["status"],
        _count: { _all: true },
      });

      const bookingsByStatus = bookingStatusBreakdown.map((b) => ({
        status: b.status,
        count: b._count._all,
      }));

      // 3. User registration timeline (last 6 months)
      const users = await prisma.user.findMany({
        select: { createdAt: true, role: true },
      });

      const userStatsMap: { [key: string]: { student: number; tutor: number } } = {};
      users.forEach((u) => {
        const monthYear = u.createdAt.toLocaleString("default", { month: "short", year: "2-digit" });
        if (!userStatsMap[monthYear]) {
          userStatsMap[monthYear] = { student: 0, tutor: 0 };
        }
        if (u.role === "STUDENT") {
          userStatsMap[monthYear].student += 1;
        } else if (u.role === "TUTOR") {
          userStatsMap[monthYear].tutor += 1;
        }
      });

      const userGrowth = Object.entries(userStatsMap).map(([month, stats]) => ({
        month,
        students: stats.student,
        tutors: stats.tutor,
      })).slice(-6);

      // 4. Tutor verification breakdown
      const verificationStatusBreakdown = await prisma.tutorProfile.groupBy({
        by: ["verificationStatus"],
        _count: { _all: true },
      });

      const verifications = verificationStatusBreakdown.map((t) => ({
        status: t.verificationStatus,
        count: t._count._all,
      }));

      // 5. Platform summaries
      const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
      const totalBookingsCount = await prisma.booking.count();
      const totalTutorsCount = await prisma.user.count({ where: { role: "TUTOR" } });
      const totalStudentsCount = await prisma.user.count({ where: { role: "STUDENT" } });

      return res.json({
        success: true,
        data: {
          summary: {
            totalRevenue,
            totalBookingsCount,
            totalTutorsCount,
            totalStudentsCount,
          },
          monthlyRevenue,
          bookingsByStatus,
          userGrowth,
          verifications,
        },
      });
    } catch (error) {
      console.error("Admin fetch reports error:", error);
      return res.status(500).json({ success: false, error: "Failed to generate report statistics" });
    }
  }
);

export default router;
