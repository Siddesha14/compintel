import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { salarySubmitSchema, salaryFilterSchema } from "@/lib/validation";
import { z } from "zod";
import { mapLevelToOrder } from "@/lib/levelMapper";
import { normalizeCompanyName, slugify, normalizeCity } from "@/lib/normalizers";


export const dynamic = "force-dynamic";

function apiSuccess(data: any, meta?: any, status = 200) {
  return NextResponse.json({ success: true, data, ...(meta && { meta }) }, { status });
}

function apiError(message: string, status = 500, details?: any) {
  return NextResponse.json({ success: false, error: message, ...(details && { details }) }, { status });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawParams = Object.fromEntries(searchParams.entries());

    const parsed = salaryFilterSchema.safeParse(rawParams);
    if (!parsed.success) {
      return apiError("Invalid filter parameters", 400, parsed.error.issues);
    }

    const { roleCategory, company, city, minLevel, maxLevel, minComp, maxComp, page, limit } = parsed.data;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (roleCategory) where.roleCategory = roleCategory;
    if (company) {
      where.company = {
        OR: [
          { slug: { contains: company.toLowerCase().replace(/\s+/g, "-"), mode: "insensitive" } },
          { name: { contains: company, mode: "insensitive" } },
          { normalizedName: { contains: company.toLowerCase().replace(/[^a-z0-9]/g, ""), mode: "insensitive" } },
        ]
      };
    }
    if (city) {
      const normalizedCity = normalizeCity(city);
      where.city = { contains: normalizedCity, mode: "insensitive" };
    }
    if (minLevel || maxLevel) {
      where.levelOrder = {};
      if (minLevel) where.levelOrder.gte = minLevel;
      if (maxLevel) where.levelOrder.lte = maxLevel;
    }
    if (minComp || maxComp) {
      where.totalComp = {};
      if (minComp) where.totalComp.gte = minComp;
      if (maxComp) where.totalComp.lte = maxComp;
    }

    const [data, total] = await Promise.all([
      prisma.salaryEntry.findMany({
        where,
        include: { company: { select: { id: true, name: true, slug: true, industry: true, companyType: true } } },
        orderBy: { totalComp: "desc" },
        skip,
        take: limit,
      }),
      prisma.salaryEntry.count({ where }),
    ]);

    return apiSuccess(data, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: skip + limit < total,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.error("GET /api/salaries error:", error);
    return apiError("Failed to fetch salaries");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) return apiError("Invalid JSON body", 400);

    const parsed = salarySubmitSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Validation failed", 400, parsed.error.issues);
    }

    const validated = parsed.data;
    const normalized = normalizeCompanyName(validated.companyName);
    const slug = slugify(validated.companyName);

    // Upsert company with normalization
    const company = await prisma.company.upsert({
      where: { normalizedName: normalized },
      update: {},
      create: {
        name: validated.companyName,
        slug,
        normalizedName: normalized,
      },
    });

    // Always compute server-side — never trust client
    const totalComp = validated.baseSalary + validated.bonus + validated.stockValue;
    const levelOrder = mapLevelToOrder(validated.level);

    const entry = await prisma.salaryEntry.create({
      data: {
        companyId: company.id,
        role: validated.role,
        roleCategory: validated.roleCategory,
        level: validated.level,
        levelOrder,
        yearsOfExp: validated.yearsOfExp,
        city: validated.city,
        baseSalary: validated.baseSalary,
        bonus: validated.bonus,
        stockValue: validated.stockValue,
        totalComp,
        workMode: validated.workMode,
        dataYear: validated.dataYear,
        isAnonymous: true,
      },
      include: { company: { select: { name: true, slug: true } } },
    });

    return apiSuccess(entry, undefined, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError("Validation failed", 400, error.issues);
    }
    console.error("POST /api/salaries error:", error);
    return apiError("Failed to submit salary");
  }
}"// force deploy" 
