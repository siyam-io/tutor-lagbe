import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

// Generic request validation middleware builder
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse & validate body
      const parsed = await schema.parseAsync(req.body);
      req.body = parsed; // Assign parsed content with correct types/coercions
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors nicely
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: formattedErrors,
        });
      }
      return res.status(500).json({
        success: false,
        error: "Internal server error during validation",
      });
    }
  };
};
