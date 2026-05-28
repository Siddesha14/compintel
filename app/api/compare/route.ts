import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compareSchema } from "@/lib/validation";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = compareSchema.parse(body);

    const where: any = {
      company: { slug: { in: validated.companies } },
    };
    if (validated.roleCategory) where.roleCategory = validated.roleCategory;
    if (validated.levelOrder) where.levelOrder = validated.levelOrder;

    const salaries = await prisma.salaryEntry.findMany({
      where,
      include: { company: true },
    });

    const companyStats: Record<string, any> = {};

    for (const salary of salaries) {
      const slug = salary.company.slug;
      if (!companyStats[slug]) {
        companyStats[slug] = {
          company: { id: salary.company.id, name: salary.company.name, slug },
          entryCount: 0,
          totalCompSum: 0,
          baseSalarySum: 0,
          bonusSum: 0,
          stockSum: 0,
          minTotalComp: Infinity,
          maxTotalComp: 0,
        };
      }
      const s = companyStats[slug];
      s.entryCount++;
      s.totalCompSum += salary.totalComp;
      s.baseSalarySum += salary.baseSalary;
      s.bonusSum += salary.bonus;
      s.stockSum += salary.stockValue;
      s.minTotalComp = Math.min(s.minTotalComp, salary.totalComp);
      s.maxTotalComp = Math.max(s.maxTotalComp, salary.totalComp);
    }

    const comparison = Object.values(companyStats).map((s: any) => ({
      company: s.company,
      entryCount: s.entryCount,
      avgTotalComp: Math.round(s.totalCompSum / s.entryCount),
      avgBaseSalary: Math.round(s.baseSalarySum / s.entryCount),
      avgBonus: Math.round(s.bonusSum / s.entryCount),
      avgStockValue: Math.round(s.stockSum / s.entryCount),
      minTotalComp: s.minTotalComp,
      maxTotalComp: s.maxTotalComp,
    })).sort((a, b) => b.avgTotalComp - a.avgTotalComp);

    return NextResponse.json({ comparison, totalEntries: salaries.length });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("POST /api/compare error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}