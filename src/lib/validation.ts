import { z } from "zod";

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
  company: z
    .string()
    .trim()
    .max(100, "Company name must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .max(20, "Phone must be less than 20 characters")
    .regex(/^[\d\s\-+()]*$/, "Phone contains invalid characters")
    .optional()
    .or(z.literal("")),
  projectType: z.string().min(1, "Please select a project type"),
  timeline: z
    .string()
    .trim()
    .max(100, "Timeline must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  budget: z.string().optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(2000, "Message must be less than 2000 characters"),
});

// Creator application form validation schema
export const creatorFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  role: z.string().min(1, "Please select a role"),
  portfolio: z
    .string()
    .trim()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  experience: z
    .string()
    .trim()
    .min(1, "Experience is required")
    .max(2000, "Experience must be less than 2000 characters"),
  location: z
    .string()
    .trim()
    .min(1, "Location is required")
    .max(100, "Location must be less than 100 characters"),
});

// Newsletter subscription validation
export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
});

// Sanitize text input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
};

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type CreatorFormData = z.infer<typeof creatorFormSchema>;
export type NewsletterData = z.infer<typeof newsletterSchema>;
