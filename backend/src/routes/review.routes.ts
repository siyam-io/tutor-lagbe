import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = Router();

// POST /api/reviews - Create a review
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { tutorProfileId, rating, comment } = req.body;

    const review = await prisma.review.create({
      data: {
        studentId: req.userId!,
        tutorProfileId,
        rating,
        comment,
      },
    });

    // Update average rating
    const aggregate = await prisma.review.aggregate({
      where: { tutorProfileId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.tutorProfile.update({
      where: { id: tutorProfileId },
      data: {
        averageRating: aggregate._avg.rating || 0,
        totalReviews: aggregate._count.rating || 0,
      },
    });

    return res.status(201).json({ success: true, data: review });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to create review" });
  }
});

// GET /api/reviews/tutor/:tutorId
router.get("/tutor/:tutorId", async (req: AuthRequest, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { tutorProfileId: req.params.tutorId },
      include: {
        student: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, data: reviews });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch reviews" });
  }
});

export default router;
