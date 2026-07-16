import { Router, Response } from "express";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = Router();

// GET /api/tutors - Fetch and filter verified tutor profiles
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const {
      subject,
      class: classFilter,
      medium,
      gender,
      locationDistrict,
      locationArea,
      minBudget,
      maxBudget,
      minExperience,
      minRating,
      page = "1",
      limit = "12",
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: Record<string, unknown> = {
      verificationStatus: "APPROVED",
    };

    if (subject) where.subjects = { has: subject as string };
    if (classFilter) where.classes = { has: classFilter as string };
    if (medium) where.mediums = { has: medium as string };
    if (gender) where.gender = gender as string;
    if (locationDistrict) where.locationDistrict = locationDistrict as string;
    if (locationArea) where.locationArea = { contains: locationArea as string };
    if (minExperience) where.experienceYears = { gte: Number(minExperience) };
    if (minRating) where.averageRating = { gte: Number(minRating) };

    // Budget filter
    const budgetWhere: Record<string, unknown> = {};
    if (minBudget || maxBudget) {
      budgetWhere.expectedSalary = {};
      if (minBudget) (budgetWhere.expectedSalary as Record<string, number>).gte = Number(minBudget);
      if (maxBudget) (budgetWhere.expectedSalary as Record<string, number>).lte = Number(maxBudget);
      Object.assign(where, budgetWhere);
    }

    const [tutors, total] = await Promise.all([
      prisma.tutorProfile.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true, avatarUrl: true },
          },
        },
        skip,
        take: Number(limit),
        orderBy: { averageRating: "desc" },
      }),
      prisma.tutorProfile.count({ where }),
    ]);

    return res.json({
      success: true,
      data: tutors,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("Fetch tutors error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch tutors" });
  }
});

// GET /api/tutors/profile - Fetch logged-in tutor's profile details
router.get("/profile", authenticate, authorize("TUTOR"), async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId: req.userId },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, avatarUrl: true },
        },
      },
    });
    if (!profile) {
      return res.status(404).json({ success: false, error: "Tutor profile not found" });
    }
    return res.json({ success: true, data: profile });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch profile" });
  }
});

// GET /api/tutors/:id - Fetch detailed profile of a tutor
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const tutor = await prisma.tutorProfile.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, avatarUrl: true },
        },
        reviews: {
          include: {
            student: {
              select: { id: true, name: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!tutor) {
      return res.status(404).json({ success: false, error: "Tutor not found" });
    }

    return res.json({ success: true, data: tutor });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch tutor" });
  }
});

// PUT /api/tutors/profile - Update profile details (Auth: Tutor)
router.put("/profile", authenticate, authorize("TUTOR"), async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.tutorProfile.update({
      where: { userId: req.userId },
      data: req.body,
    });

    return res.json({ success: true, data: profile });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to update profile" });
  }
});

export default router;
