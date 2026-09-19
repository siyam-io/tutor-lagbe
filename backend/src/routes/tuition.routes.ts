import { Router, Response } from "express";
import { z } from "zod";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import prisma from "../lib/prisma";

const router = Router();

// Validation Schemas
const createTuitionPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long").max(100, "Title is too long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  subject: z.string().min(1, "Subject is required"),
  class: z.string().min(1, "Class is required"),
  medium: z.string().min(1, "Medium is required"),
  locationDistrict: z.string().min(1, "District is required"),
  locationArea: z.string().min(1, "Area is required"),
  salary: z.number().positive("Salary must be a positive number"),
  daysPerWeek: z.number().min(1, "Days per week must be at least 1").max(7, "Days per week cannot exceed 7"),
  genderPreference: z.enum(["MALE", "FEMALE", "ANY"]).optional(),
  tuitionType: z.enum(["ONLINE", "OFFLINE"]).optional(),
});

const applyTuitionSchema = z.object({
  coverLetter: z.string().min(10, "Proposal must be at least 10 characters long"),
  expectedSalary: z.number().positive("Expected salary must be a positive number"),
});

// POST /api/tuitions - Create a tuition post (Student only)
router.post("/", authenticate, authorize("STUDENT"), validate(createTuitionPostSchema), async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      subject,
      class: className,
      medium,
      locationDistrict,
      locationArea,
      salary,
      daysPerWeek,
      genderPreference,
      tuitionType,
    } = req.body;

    const post = await prisma.tuitionPost.create({
      data: {
        studentId: req.userId!,
        title,
        description,
        subject,
        class: className,
        medium,
        locationDistrict,
        locationArea,
        salary: Number(salary),
        daysPerWeek: Number(daysPerWeek),
        genderPreference: genderPreference || "ANY",
        tuitionType: tuitionType || "OFFLINE",
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error("Create tuition post error:", error);
    return res.status(500).json({ success: false, error: "Failed to create tuition post" });
  }
});

import jwt from "jsonwebtoken";

// GET /api/tuitions - Get all open tuition posts with optional filtering (Public)
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const {
      subject,
      class: className,
      medium,
      genderPreference,
      locationDistrict,
      locationArea,
      tuitionType,
      search,
      page = "1",
      limit = "10",
    } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Check if a tutor is logged in to mark applied posts
    let loggedInTutorProfileId: string | null = null;
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "tutor-lagbe-secret-key-dev") as {
          userId: string;
          role: string;
        };
        if (decoded.role === "TUTOR") {
          const tutorProf = await prisma.tutorProfile.findUnique({
            where: { userId: decoded.userId },
            select: { id: true },
          });
          if (tutorProf) {
            loggedInTutorProfileId = tutorProf.id;
          }
        }
      } catch (err) {
        // Ignore token errors for public feed
      }
    }

    // Build filter query
    const where: any = {
      status: "OPEN",
    };

    if (subject) where.subject = { equals: subject as string, mode: "insensitive" };
    if (className) where.class = { equals: className as string, mode: "insensitive" };
    if (medium) where.medium = { equals: medium as string, mode: "insensitive" };
    if (genderPreference && genderPreference !== "ALL") where.genderPreference = genderPreference;
    if (locationDistrict) where.locationDistrict = { equals: locationDistrict as string, mode: "insensitive" };
    if (locationArea) where.locationArea = { contains: locationArea as string, mode: "insensitive" };
    if (tuitionType) where.tuitionType = tuitionType;

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
        { subject: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.tuitionPost.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: { applications: true },
          },
          applications: {
            select: {
              tutorProfileId: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.tuitionPost.count({ where }),
    ]);

    const postsWithApplied = posts.map(post => {
      const hasApplied = loggedInTutorProfileId 
        ? post.applications.some((app: any) => app.tutorProfileId === loggedInTutorProfileId)
        : false;
      
      const { applications, ...rest } = post;
      return { ...rest, hasApplied };
    });

    return res.json({
      success: true,
      data: postsWithApplied,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error("Get tuition posts error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch tuition posts" });
  }
});

// GET /api/tuitions/my-posts - Get posts created by the logged-in student (Student only)
router.get("/my-posts", authenticate, authorize("STUDENT"), async (req: AuthRequest, res: Response) => {
  try {
    const posts = await prisma.tuitionPost.findMany({
      where: {
        studentId: req.userId!,
      },
      include: {
        _count: {
          select: { applications: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({ success: true, data: posts });
  } catch (error) {
    console.error("Get my posts error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch your tuition posts" });
  }
});

// GET /api/tuitions/my-applications - Get applications submitted by the logged-in tutor (Tutor only)
router.get("/my-applications", authenticate, authorize("TUTOR"), async (req: AuthRequest, res: Response) => {
  try {
    // Find tutor profile
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId: req.userId! },
    });

    if (!tutorProfile) {
      return res.status(404).json({ success: false, error: "Tutor profile not found" });
    }

    const applications = await prisma.tuitionApplication.findMany({
      where: {
        tutorProfileId: tutorProfile.id,
      },
      include: {
        tuitionPost: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({ success: true, data: applications });
  } catch (error) {
    console.error("Get my applications error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch your applications" });
  }
});

// GET /api/tuitions/:id - Get specific tuition post detail
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const post = await prisma.tuitionPost.findUnique({
      where: { id: req.params.id },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ success: false, error: "Tuition post not found" });
    }

    return res.json({ success: true, data: post });
  } catch (error) {
    console.error("Get tuition post detail error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch tuition post details" });
  }
});

// PUT /api/tuitions/:id - Update tuition post (Student owner only)
router.put("/:id", authenticate, authorize("STUDENT"), async (req: AuthRequest, res: Response) => {
  try {
    const post = await prisma.tuitionPost.findUnique({
      where: { id: req.params.id },
    });

    if (!post) {
      return res.status(404).json({ success: false, error: "Tuition post not found" });
    }

    if (post.studentId !== req.userId) {
      return res.status(430).json({ success: false, error: "Not authorized to edit this post" });
    }

    const {
      title,
      description,
      subject,
      class: className,
      medium,
      locationDistrict,
      locationArea,
      salary,
      daysPerWeek,
      genderPreference,
      tuitionType,
      status,
    } = req.body;

    const updatedPost = await prisma.tuitionPost.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        subject,
        class: className,
        medium,
        locationDistrict,
        locationArea,
        salary: salary ? Number(salary) : undefined,
        daysPerWeek: daysPerWeek ? Number(daysPerWeek) : undefined,
        genderPreference,
        tuitionType,
        status,
      },
    });

    return res.json({ success: true, data: updatedPost });
  } catch (error) {
    console.error("Update tuition post error:", error);
    return res.status(500).json({ success: false, error: "Failed to update tuition post" });
  }
});

// DELETE /api/tuitions/:id - Delete tuition post (Student owner or admin only)
router.delete("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const post = await prisma.tuitionPost.findUnique({
      where: { id: req.params.id },
    });

    if (!post) {
      return res.status(404).json({ success: false, error: "Tuition post not found" });
    }

    if (post.studentId !== req.userId && req.userRole !== "ADMIN") {
      return res.status(403).json({ success: false, error: "Not authorized to delete this post" });
    }

    await prisma.tuitionPost.delete({
      where: { id: req.params.id },
    });

    return res.json({ success: true, message: "Tuition post deleted successfully" });
  } catch (error) {
    console.error("Delete tuition post error:", error);
    return res.status(500).json({ success: false, error: "Failed to delete tuition post" });
  }
});

// POST /api/tuitions/:id/apply - Apply to a tuition post (Tutor only)
router.post("/:id/apply", authenticate, authorize("TUTOR"), validate(applyTuitionSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { coverLetter, expectedSalary } = req.body;

    const post = await prisma.tuitionPost.findUnique({
      where: { id: req.params.id },
    });

    if (!post) {
      return res.status(404).json({ success: false, error: "Tuition post not found" });
    }

    if (post.status !== "OPEN") {
      return res.status(400).json({ success: false, error: "This tuition post is no longer open for applications" });
    }

    // Find tutor profile
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId: req.userId! },
    });

    if (!tutorProfile) {
      return res.status(404).json({ success: false, error: "Tutor profile not found" });
    }

    // Check if already applied
    const existingApplication = await prisma.tuitionApplication.findUnique({
      where: {
        tuitionPostId_tutorProfileId: {
          tuitionPostId: req.params.id,
          tutorProfileId: tutorProfile.id,
        },
      },
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, error: "You have already applied to this tuition post" });
    }

    const application = await prisma.tuitionApplication.create({
      data: {
        tuitionPostId: req.params.id,
        tutorProfileId: tutorProfile.id,
        coverLetter,
        expectedSalary: Number(expectedSalary),
      },
    });

    // Create a notification for the student
    await prisma.notification.create({
      data: {
        userId: post.studentId,
        title: "New Tuition Application",
        message: `A tutor has applied to your post: "${post.title}"`,
        type: "NEW_MESSAGE", // Re-using general type or custom notifications if client supports it
      },
    });

    return res.status(201).json({ success: true, data: application });
  } catch (error) {
    console.error("Apply to tuition post error:", error);
    return res.status(500).json({ success: false, error: "Failed to submit application" });
  }
});

// GET /api/tuitions/:id/applications - Get all applications for a post (Student owner only)
router.get("/:id/applications", authenticate, authorize("STUDENT"), async (req: AuthRequest, res: Response) => {
  try {
    const post = await prisma.tuitionPost.findUnique({
      where: { id: req.params.id },
    });

    if (!post) {
      return res.status(404).json({ success: false, error: "Tuition post not found" });
    }

    if (post.studentId !== req.userId) {
      return res.status(403).json({ success: false, error: "Not authorized to view applications for this post" });
    }

    const applications = await prisma.tuitionApplication.findMany({
      where: {
        tuitionPostId: req.params.id,
      },
      include: {
        tutorProfile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({ success: true, data: applications });
  } catch (error) {
    console.error("Get post applications error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch applications" });
  }
});

// PUT /api/tuitions/applications/:applicationId/status - Accept/Reject an application (Student owner only)
router.put("/applications/:applicationId/status", authenticate, authorize("STUDENT"), async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body; // ACCEPTED or REJECTED

    if (!status || !["ACCEPTED", "REJECTED"].includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status value" });
    }

    const application = await prisma.tuitionApplication.findUnique({
      where: { id: req.params.applicationId },
      include: {
        tuitionPost: true,
        tutorProfile: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!application) {
      return res.status(404).json({ success: false, error: "Application not found" });
    }

    if (application.tuitionPost.studentId !== req.userId) {
      return res.status(403).json({ success: false, error: "Not authorized to update status of this application" });
    }

    const updatedApplication = await prisma.tuitionApplication.update({
      where: { id: req.params.applicationId },
      data: { status },
    });

    // Create a notification for the tutor
    await prisma.notification.create({
      data: {
        userId: application.tutorProfile.userId,
        title: `Application ${status === "ACCEPTED" ? "Accepted" : "Rejected"}`,
        message: `Your application to "${application.tuitionPost.title}" was ${status === "ACCEPTED" ? "accepted" : "rejected"} by the student.`,
        type: "BOOKING_ACCEPTED", // Re-using existing types for UI rendering
      },
    });

    return res.json({ success: true, data: updatedApplication });
  } catch (error) {
    console.error("Update application status error:", error);
    return res.status(500).json({ success: false, error: "Failed to update application status" });
  }
});

export default router;
