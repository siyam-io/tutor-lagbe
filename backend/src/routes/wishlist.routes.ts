import { Router, Response } from "express";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = Router();

// POST /api/wishlist/:tutorId - Toggle tutor in student's wishlist
router.post("/:tutorId", authenticate, authorize("STUDENT"), async (req: AuthRequest, res: Response) => {
  try {
    const { tutorId } = req.params;

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        studentId_tutorProfileId: {
          studentId: req.userId!,
          tutorProfileId: tutorId,
        },
      },
    });

    if (existing) {
      await prisma.wishlistItem.delete({
        where: { id: existing.id },
      });
      return res.json({ success: true, added: false, message: "Removed from wishlist" });
    } else {
      await prisma.wishlistItem.create({
        data: {
          studentId: req.userId!,
          tutorProfileId: tutorId,
        },
      });
      return res.json({ success: true, added: true, message: "Added to wishlist" });
    }
  } catch (error) {
    console.error("Toggle wishlist error:", error);
    return res.status(500).json({ success: false, error: "Failed to toggle wishlist" });
  }
});

// GET /api/wishlist - Get student's wishlist items
router.get("/", authenticate, authorize("STUDENT"), async (req: AuthRequest, res: Response) => {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { studentId: req.userId! },
      include: {
        tutorProfile: {
          include: {
            user: { select: { id: true, name: true, email: true, phone: true, avatarUrl: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, data: items.map((i) => i.tutorProfile) });
  } catch (error) {
    console.error("Get wishlist error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch wishlist" });
  }
});

// GET /api/wishlist/ids - Get ids of tutor profiles in student's wishlist
router.get("/ids", authenticate, authorize("STUDENT"), async (req: AuthRequest, res: Response) => {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { studentId: req.userId! },
      select: { tutorProfileId: true },
    });

    return res.json({ success: true, data: items.map((i) => i.tutorProfileId) });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch wishlist ids" });
  }
});

export default router;
