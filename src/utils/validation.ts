import { z } from "zod";

export const createApplicationSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100),
    email: z.string().email("Invalid email address").toLowerCase(),
    phoneNumber: z.string().min(10, "Invalid phone number").max(15),
    position: z.string().min(1, "Position is required"),
    yearsOfExperience: z.string().min(1, "Years of experience is required"),
    portfolioUrl: z.string().optional().nullable(),
    linkedInProfile: z.string().optional().nullable(),
    githubProfile: z.string().optional().nullable(),
    coverLetter: z.string().optional().nullable(),
    resumeUrl: z.string().min(1, "Resume URL is required"),
  }),
});

export const updateApplicationSchema = z.object({
  body: createApplicationSchema.shape.body.partial(),
});

//////////////

export const createLeadSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),

    email: z
      .string()
      .min(1, "Email address is required")
      .email("Please enter a valid email address"),

    phone: z
      .string()
      .regex(/^[0-9+\-\s()]{0,15}$/, "Please enter a valid phone number")
      .optional()
      .or(z.literal("")),

    company: z
      .string()
      .max(100, "Company name must be less than 100 characters")
      .optional()
      .or(z.literal("")),

    service: z.string().min(1, "Please select a service"),

    budget: z.string().optional().or(z.literal("")),

    details: z
      .string()
      .max(2000, "Project details must be less than 2000 characters")
      .optional()
      .or(z.literal("")),
  }),
});

export const updateLeadSchema = z.object({
  body: createLeadSchema.shape.body.partial(),
});

export const subscribeEmailSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .toLowerCase()
      .trim(),
  }),
});


export interface CreateSubscriberDto {
  email: string;
}