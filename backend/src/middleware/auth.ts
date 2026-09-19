import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("FATAL: JWT_SECRET environment variable is not set in production mode.");
    }
    return "tutor-lagbe-secret-key-dev";
  }
  return secret;
};

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as {
      userId: string;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { isBanned: true },
    });

    if (!user) {
      return res.status(401).json({ success: false, error: "User session expired or not found" });
    }

    if (user.isBanned) {
      return res.status(403).json({ success: false, error: "Your account has been suspended by the administrator." });
    }

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res
        .status(403)
        .json({ success: false, error: "Insufficient permissions" });
    }
    next();
  };
};

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, getJwtSecret(), { expiresIn: "7d" });
};
