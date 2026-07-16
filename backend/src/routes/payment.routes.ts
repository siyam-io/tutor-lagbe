import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = Router();

// POST /api/payments - Create a payment
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId, amount, method, transactionId } = req.body;

    const payment = await prisma.payment.create({
      data: {
        bookingId,
        userId: req.userId!,
        amount,
        method,
        transactionId,
      },
    });

    return res.status(201).json({ success: true, data: payment });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to create payment" });
  }
});

// GET /api/payments - Get user payments
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, data: payments });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch payments" });
  }
});

export default router;
