import { z } from "zod";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "./constants";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const uploadContentSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Max 100 characters"),
    subject: z.string().min(1, "Subject is required"),
    description: z.string().optional(),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    rotationDuration: z.coerce
      .number()
      .min(1, "Rotation duration must be at least 1 second")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return new Date(data.endTime) > new Date(data.startTime);
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  );

export const rejectSchema = z.object({
  reason: z
    .string()
    .min(10, "Please provide at least 10 characters for the rejection reason"),
});
