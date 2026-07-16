import { Router, Response } from "express";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = Router();

// POST /api/withdrawals - Request a withdrawal (Auth: Tutor)
router.post("/", authenticate, authorize("TUTOR"), async (req: AuthRequest, res: Response) => {
  try {
    const { amount, method, accountDetails } = req.body;

    if (!amount || amount <= 0 || !method || !accountDetails) {
      return res.status(400).json({ success: false, error: "Invalid withdrawal payload" });
    }

    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId: req.userId! },
      include: { bookings: true },
    });

    if (!tutorProfile) {
      return res.status(404).json({ success: false, error: "Tutor profile not found" });
    }

    // 1. Calculate tutor's total completed earnings
    const bookings = await prisma.booking.findMany({
      where: { tutorProfileId: tutorProfile.id },
      select: { id: true },
    });
    const bookingIds = bookings.map((b) => b.id);

    const completedPayments = await prisma.payment.findMany({
      where: {
        bookingId: { in: bookingIds },
        status: "COMPLETED",
      },
      select: { amount: true },
    });
    const totalEarnings = completedPayments.reduce((sum, p) => sum + p.amount, 0);

    // 2. Calculate total already requested/completed withdrawals
    const withdrawals = await prisma.withdrawalRequest.findMany({
      where: {
        tutorProfileId: tutorProfile.id,
        status: { in: ["PENDING", "APPROVED"] },
      },
      select: { amount: true },
    });
    const totalWithdrawn = withdrawals.reduce((sum, w) => sum + w.amount, 0);

    const availableBalance = totalEarnings - totalWithdrawn;

    if (amount > availableBalance) {
      return res.status(400).json({
        success: false,
        error: `Insufficient balance. Available to withdraw: ৳${availableBalance.toLocaleString()}`,
      });
    }

    const request = await prisma.withdrawalRequest.create({
      data: {
        tutorProfileId: tutorProfile.id,
        amount: Number(amount),
        method,
        accountDetails,
        status: "PENDING",
      },
    });

    return res.status(201).json({ success: true, data: request });
  } catch (error) {
    console.error("Create withdrawal request error:", error);
    return res.status(500).json({ success: false, error: "Failed to submit withdrawal request" });
  }
});

// GET /api/withdrawals/tutor - Fetch tutor's payout requests history (Auth: Tutor)
router.get("/tutor", authenticate, authorize("TUTOR"), async (req: AuthRequest, res: Response) => {
  try {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId: req.userId! },
    });

    if (!tutorProfile) {
      return res.status(404).json({ success: false, error: "Tutor profile not found" });
    }

    const items = await prisma.withdrawalRequest.findMany({
      where: { tutorProfileId: tutorProfile.id },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, data: items });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch withdrawal list" });
  }
});

// GET /api/admin/withdrawals - List all requests for admin approval (Auth: Admin)
router.get("/admin", authenticate, authorize("ADMIN"), async (_req: AuthRequest, res: Response) => {
  try {
    const items = await prisma.withdrawalRequest.findMany({
      include: {
        tutorProfile: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, data: items });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch payout requests" });
  }
});

// PATCH /api/admin/withdrawals/:id - Approve or reject payout (Auth: Admin)
router.patch("/admin/:id", authenticate, authorize("ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { status, transactionId } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status state" });
    }

    const request = await prisma.withdrawalRequest.update({
      where: { id: req.params.id },
      data: {
        status,
        transactionId: transactionId || null,
      },
    });

    return res.json({ success: true, data: request });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to update payout request status" });
  }
});

export default router;
