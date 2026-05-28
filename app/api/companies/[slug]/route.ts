import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const company = await prisma.company.findUnique({
      where: { slug },
      include: { _count: { select: { salaryEntries: true } } },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const aggregateStats = await prisma.salaryEntry.aggregate({
      where: { companyId: company.id },
      _avg: { totalComp: true, baseSalary: true, bonus: true, stockValue: true },
      _min: { totalComp: true },
      _max: { totalComp: true },
    });

    const groupedByLevel = await prisma.salaryEntry.groupBy({
      by: ["level", "levelOrder"],
      where: { companyId: company.id },
      _count: true,
      _avg: { totalComp: true, baseSalary: true, bonus: true, stockValue: true },
      orderBy: { levelOrder: "asc" },
    });

    return NextResponse.json({
      company: {
        ...company,
        entryCount: company._count.salaryEntries,
      },
      aggregateStats: {
        avgTotalComp: Math.round(aggregateStats._avg.totalComp || 0),
        avgBaseSalary: Math.round(aggregateStats._avg.baseSalary || 0),
        avgBonus: Math.round(aggregateStats._avg.bonus || 0),
        avgStockValue: Math.round(aggregateStats._avg.stockValue || 0),
        minTotalComp: aggregateStats._min.totalComp || 0,
        maxTotalComp: aggregateStats._max.totalComp || 0,
      },
      groupedByLevel: groupedByLevel.map((item: any) => ({
        level: item.level,
        levelOrder: item.levelOrder,
        count: item._count,
        avgTotalComp: Math.round(item._avg.totalComp || 0),
        avgBaseSalary: Math.round(item._avg.baseSalary || 0),
        avgBonus: Math.round(item._avg.bonus || 0),
        avgStockValue: Math.round(item._avg.stockValue || 0),
      })),
    });
  } catch (error) {
    console.error("GET /api/companies/[slug] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}