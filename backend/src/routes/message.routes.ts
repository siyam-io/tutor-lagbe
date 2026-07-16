import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = Router();

// GET /api/messages - Get conversations
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: req.userId }, { receiverId: req.userId }],
      },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
        receiver: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, data: messages });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch messages" });
  }
});

// POST /api/messages - Send a message
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { receiverId, content, fileUrl } = req.body;

    const message = await prisma.message.create({
      data: {
        senderId: req.userId!,
        receiverId,
        content,
        fileUrl,
      },
    });

    // Notify receiver
    const sender = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { name: true },
    });

    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: "New Message",
        message: `You have a new message from ${sender?.name || "Someone"}: "${content.substring(0, 40)}${content.length > 40 ? "..." : ""}"`,
        type: "NEW_MESSAGE",
      },
    });

    return res.status(201).json({ success: true, data: message });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to send message" });
  }
});

export default router;
