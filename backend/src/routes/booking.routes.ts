import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = Router();

// POST /api/bookings - Create a booking request (Auth: Student)
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { tutorProfileId, date, timeSlot, tuitionType, address, notes, amount } = req.body;

    const parsedDate = new Date(date);

    // Collision check: check if this slot is already booked or pending
    const existingBooking = await prisma.booking.findFirst({
      where: {
        tutorProfileId,
        date: parsedDate,
        timeSlot,
        status: { in: ["PENDING", "ACCEPTED"] },
      },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        error: "This time slot is already booked or has a pending request. Please choose another slot.",
      });
    }

    const booking = await prisma.booking.create({
      data: {
        studentId: req.userId!,
        tutorProfileId,
        date: parsedDate,
        timeSlot,
        tuitionType,
        address,
        notes,
        amount: amount ? Number(amount) : null,
      },
    });

    // Notify the tutor
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { id: tutorProfileId },
      include: { user: { select: { name: true, id: true } } },
    });
    const student = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { name: true },
    });

    if (tutorProfile) {
      await prisma.notification.create({
        data: {
          userId: tutorProfile.userId,
          title: "New Booking Request",
          message: `${student?.name || "A student"} requested a tuition on ${parsedDate.toLocaleDateString()} at ${timeSlot}.`,
          type: "BOOKING_REQUESTED",
        },
      });
    }

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
      include: {
        student: { select: { id: true, name: true } },
        tutor: {
          include: {
            user: { select: { name: true } }
          }
        }
      }
    });

    // Notify the student
    await prisma.notification.create({
      data: {
        userId: booking.studentId,
        title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}`,
        message: `Your tuition request with ${booking.tutor?.user?.name || "Tutor"} has been ${status.toLowerCase()}.`,
        type: `BOOKING_${status}`,
      },
    });

    return res.json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to update booking" });
  }
});

export default router;
