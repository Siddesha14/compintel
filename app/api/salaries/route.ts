import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { salarySubmitSchema } from "@/lib/validation";
import { z } from "zod";
import { mapLevelToOrder } from "@/lib/levelMapper";
import { normalizeCompanyName, slugify } from "@/lib/normalizers";
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roleCategory = searchParams.get("roleCategory");
    const companySlug = searchParams.get("company");
    const city = searchParams.get("city");
    const minLevel = searchParams.get("minLevel");
    const maxLevel = searchParams.get("maxLevel");
    const minComp = searchParams.get("minComp");
    const maxComp = searchParams.get("maxComp");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (roleCategory) where.roleCategory = roleCategory;
    if (companySlug) where.company = { slug: companySlug };
    if (city) where.city = city;
    if (minLevel || maxLevel) {
      where.levelOrder = {};
      if (minLevel) where.levelOrder.gte = parseInt(minLevel);
      if (maxLevel) where.levelOrder.lte = parseInt(maxLevel);
    }
    if (minComp || maxComp) {
      where.totalComp = {};
      if (minComp) where.totalComp.gte = parseInt(minComp);
      if (maxComp) where.totalComp.lte = parseInt(maxComp);
    }

    const [data, total] = await Promise.all([
      prisma.salaryEntry.findMany({
        where,
        include: { company: true },
        orderBy: { totalComp: "desc" },
        skip,
        take: limit,
      }),
      prisma.salaryEntry.count({ where }),
    ]);

    return NextResponse.json({ data, total, page });
  } catch (error) {
    console.error("GET /api/salaries error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = salarySubmitSchema.parse(body);

    // Normalize and upsert company
    const normalized = normalizeCompanyName(validated.companyName);
    const slug = slugify(validated.companyName);

    const company = await prisma.company.upsert({
      where: { slug },
      update: {},
      create: {
        name: validated.companyName,
        slug,
        normalizedName: normalized,
      },
    });

    // Always compute totalComp server-side
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
    });

    return NextResponse.json({ data: entry }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("POST /api/salaries error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
"// force deploy" 
