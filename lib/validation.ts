import { z } from "zod";

export const compareSchema = z.object({
  companies: z.array(z.string()).min(2).max(3),
  roleCategory: z.string().optional(),
  levelOrder: z.number().min(1).max(10).optional(),
});

export const salarySubmitSchema = z.object({
  companyName: z.string().min(1),
  role: z.string().min(1),
  roleCategory: z.string().min(1),
  level: z.string().min(1),
  yearsOfExp: z.number().min(0).max(50),
  city: z.string().min(1),
  baseSalary: z.number().min(0),
  bonus: z.number().min(0).default(0),
  stockValue: z.number().min(0).default(0),
  workMode: z.string().default("HYBRID"),
  dataYear: z.number().min(2020).max(2025),
});