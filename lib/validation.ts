import { z } from "zod";

const VALID_ROLE_CATEGORIES = [
  "SOFTWARE_ENGINEERING",
  "DATA_SCIENCE",
  "PRODUCT_MANAGEMENT",
  "DESIGN",
  "DEVOPS",
  "SECURITY",
  "MANAGEMENT",
  "SALES",
  "MARKETING",
  "FINANCE",
  "HR",
  "OTHER",
] as const;

const VALID_WORK_MODES = ["REMOTE", "HYBRID", "ONSITE"] as const;

export const salarySubmitSchema = z.object({
  companyName: z.string()
    .min(1, "Company name is required")
    .max(100, "Company name too long")
    .transform(s => s.trim()),

  role: z.string()
    .min(1, "Role is required")
    .max(100, "Role name too long")
    .transform(s => s.trim()),

  roleCategory: z.enum(VALID_ROLE_CATEGORIES, {
    errorMap: () => ({ message: "Invalid role category" }),
  }),

  level: z.string()
    .min(1, "Level is required")
    .max(50, "Level string too long")
    .transform(s => s.trim()),

  yearsOfExp: z.number()
    .int("Must be a whole number")
    .min(0, "Cannot be negative")
    .max(50, "Years of experience seems too high"),

  city: z.string()
    .min(1, "City is required")
    .max(100, "City name too long")
    .transform(s => s.trim()),

  baseSalary: z.number()
    .min(100000, "Base salary must be at least ₹1L")
    .max(100000000, "Base salary cannot exceed ₹10Cr"),

  bonus: z.number()
    .min(0, "Bonus cannot be negative")
    .max(50000000, "Bonus seems unrealistic")
    .default(0),

  stockValue: z.number()
    .min(0, "Stock value cannot be negative")
    .max(200000000, "Stock value seems unrealistic")
    .default(0),

  workMode: z.enum(VALID_WORK_MODES).default("HYBRID"),

  dataYear: z.number()
    .int()
    .min(2020, "Data year must be 2020 or later")
    .max(new Date().getFullYear(), "Data year cannot be in the future"),
});

export const compareSchema = z.object({
  companies: z.array(z.string().min(1))
    .min(2, "Select at least 2 companies")
    .max(3, "Maximum 3 companies"),
  roleCategory: z.enum(VALID_ROLE_CATEGORIES).optional(),
  levelOrder: z.number().int().min(1).max(10).optional(),
});

export const salaryFilterSchema = z.object({
  roleCategory: z.enum(VALID_ROLE_CATEGORIES).optional(),
  company: z.string().optional(),
  city: z.string().optional(),
  minLevel: z.coerce.number().int().min(1).max(10).optional(),
  maxLevel: z.coerce.number().int().min(1).max(10).optional(),
  minComp: z.coerce.number().min(0).optional(),
  maxComp: z.coerce.number().min(0).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type SalarySubmitInput = z.infer<typeof salarySubmitSchema>;
export type CompareInput = z.infer<typeof compareSchema>;
export type SalaryFilterInput = z.infer<typeof salaryFilterSchema>;