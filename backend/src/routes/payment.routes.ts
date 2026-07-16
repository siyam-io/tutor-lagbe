import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = Router();

// POST /api/payments/initiate - Initiate SSLCommerz Payment Session (Auth: Student)
router.post("/initiate", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId, amount } = req.body;
    if (!bookingId || !amount) {
      return res.status(400).json({ success: false, error: "Booking ID and amount are required" });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        student: { select: { name: true, email: true, phone: true } },
      },
    });

    if (!booking) {
      return res.status(404).json({ success: false, error: "Booking not found" });
    }

    const tran_id = `TL_TXN_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;

    // Create a pending payment record
    await prisma.payment.create({
      data: {
        bookingId,
        userId: req.userId!,
        amount: Number(amount),
        method: "SSLCOMMERZ",
        status: "PENDING",
        transactionId: tran_id,
      },
    });

    const store_id = process.env.SSLCOMMERZ_STORE_ID;
    const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
    const is_sandbox = process.env.SSLCOMMERZ_IS_SANDBOX === "true";
    const backend_url = process.env.BACKEND_URL || "http://localhost:5000";

    const sslcommerz_url = is_sandbox
      ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
      : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

    const postData = new URLSearchParams({
      store_id: store_id || "",
      store_passwd: store_passwd || "",
      total_amount: String(amount),
      currency: "BDT",
      tran_id,
      success_url: `${backend_url}/api/payments/success`,
      fail_url: `${backend_url}/api/payments/fail`,
      cancel_url: `${backend_url}/api/payments/cancel`,
      ipn_url: `${backend_url}/api/payments/ipn`,
      cus_name: booking.student?.name || "Customer",
      cus_email: booking.student?.email || "customer@mail.com",
      cus_add1: "Dhaka",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      cus_phone: booking.student?.phone || "01700000000",
      shipping_method: "NO",
      product_name: "Tuition Fees",
      product_category: "Education",
      product_profile: "non-physical-goods",
    });

    console.log(`Initiating SSLCommerz Session for ${tran_id}...`);
    const sslRes = await fetch(sslcommerz_url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: postData.toString(),
    });

    const sslData: any = await sslRes.json();

    if (sslData.status === "SUCCESS" && sslData.GatewayPageURL) {
      return res.json({ success: true, gatewayUrl: sslData.GatewayPageURL });
    } else {
      console.error("SSLCommerz initiation failed:", sslData);
      return res.status(500).json({ success: false, error: sslData.failedreason || "Payment initiation failed" });
    }
  } catch (error) {
    console.error("Initiate payment error:", error);
    return res.status(500).json({ success: false, error: "Failed to initiate payment" });
  }
});

// POST /api/payments/success - Redirect callback on successful payment
router.post("/success", async (req, res) => {
  try {
    const { tran_id, card_type, bank_tran_id } = req.body;
    console.log(`Payment Success Callback for ${tran_id}`);

    // Update payment record
    const payment = await prisma.payment.findFirst({
      where: { transactionId: tran_id },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "COMPLETED",
          method: card_type || "SSLCOMMERZ",
          transactionId: bank_tran_id || tran_id,
        },
      });

      // Update corresponding booking status to ACCEPTED/COMPLETED if needed
      const booking = await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: "ACCEPTED" }, // Mark booking as Accepted/Active upon payment
        include: {
          student: { select: { name: true } },
          tutor: {
            include: {
              user: { select: { id: true, name: true } }
            }
          }
        }
      });

      // Notify student
      await prisma.notification.create({
        data: {
          userId: payment.userId,
          title: "Payment Successful",
          message: `Your payment of ৳${payment.amount} to ${booking.tutor?.user?.name || "Tutor"} was successful.`,
          type: "PAYMENT_SUCCESS",
        },
      });

      // Notify tutor
      if (booking.tutor?.userId) {
        await prisma.notification.create({
          data: {
            userId: booking.tutor.userId,
            title: "Payment Received",
            message: `You received a payment of ৳${payment.amount} from ${booking.student?.name || "Student"}.`,
            type: "PAYMENT_SUCCESS",
          },
        });
      }
    }

    const frontend_url = process.env.FRONTEND_URL || "http://localhost:3000";
    return res.redirect(`${frontend_url}/payments?status=success`);
  } catch (error) {
    console.error("Payment success callback error:", error);
    const frontend_url = process.env.FRONTEND_URL || "http://localhost:3000";
    return res.redirect(`${frontend_url}/payments?status=fail`);
  }
});

// POST /api/payments/fail - Redirect callback on failed payment
router.post("/fail", async (req, res) => {
  try {
    const { tran_id } = req.body;
    console.log(`Payment Fail Callback for ${tran_id}`);

    const payment = await prisma.payment.findFirst({
      where: { transactionId: tran_id },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });
    }
  } catch (error) {
    console.error("Payment fail callback error:", error);
  }

  const frontend_url = process.env.FRONTEND_URL || "http://localhost:3000";
  return res.redirect(`${frontend_url}/payments?status=fail`);
});

// POST /api/payments/cancel - Redirect callback on cancelled payment
router.post("/cancel", async (req, res) => {
  try {
    const { tran_id } = req.body;
    console.log(`Payment Cancel Callback for ${tran_id}`);

    const payment = await prisma.payment.findFirst({
      where: { transactionId: tran_id },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "CANCELLED" },
      });
    }
  } catch (error) {
    console.error("Payment cancel callback error:", error);
  }

  const frontend_url = process.env.FRONTEND_URL || "http://localhost:3000";
  return res.redirect(`${frontend_url}/payments?status=cancel`);
});

// GET /api/payments/tutor - Get tutor's earnings/received payments
router.get("/tutor", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId: req.userId! },
    });

    if (!tutorProfile) {
      return res.status(404).json({ success: false, error: "Tutor profile not found" });
    }

    const bookings = await prisma.booking.findMany({
      where: { tutorProfileId: tutorProfile.id },
      include: {
        student: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    const bookingIds = bookings.map((b) => b.id);

    const payments = await prisma.payment.findMany({
      where: {
        bookingId: { in: bookingIds },
      },
      orderBy: { createdAt: "desc" },
    });

    // Map student names back to payments for frontend rendering
    const bookingMap = new Map(bookings.map((b) => [b.id, b]));
    const data = payments.map((p) => {
      const b = bookingMap.get(p.bookingId);
      return {
        ...p,
        booking: b ? { student: b.student } : null,
      };
    });

    return res.json({ success: true, data });
  } catch (error) {
    console.error("Fetch tutor payments error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch earnings records" });
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
