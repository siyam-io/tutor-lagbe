import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = Router();

// POST /api/bookings - Create a booking request (Auth: Student)
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { tutorProfileId, date, timeSlot, tuitionType, address, notes } = req.body;

    const booking = await prisma.booking.create({
      data: {
        studentId: req.userId!,
        tutorProfileId,
        date: new Date(date),
        timeSlot,
        tuitionType,
        address,
        notes,
      },
    });

    return res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error("Create booking error:", error);
    return res.status(500).json({ success: false, error: "Failed to create booking" });
  }
});

// GET /api/bookings/student - Get student's booking history
router.get("/student", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { studentId: req.userId },
      include: {
        tutor: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch bookings" });
  }
});

// GET /api/bookings/tutor - Get tutor's received requests
router.get("/tutor", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId: req.userId },
    });

    if (!tutorProfile) {
      return res.status(404).json({ success: false, error: "Tutor profile not found" });
    }

    const bookings = await prisma.booking.findMany({
      where: { tutorProfileId: tutorProfile.id },
      include: {
        student: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch bookings" });
  }
});

// PATCH /api/bookings/:id/status - Accept or reject request
router.patch("/:id/status", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;

    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status },
    });

    return res.json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to update booking" });
  }
});

export default router;
