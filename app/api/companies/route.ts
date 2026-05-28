import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const companies = await prisma.company.findMany({
      include: {
        _count: { select: { salaryEntries: true } },
      },
      orderBy: { name: "asc" },
    });

    const companiesWithStats = await Promise.all(
      companies.map(async (company) => {
        const avgStats = await prisma.salaryEntry.aggregate({
          where: { companyId: company.id },
          _avg: { totalComp: true, baseSalary: true, bonus: true, stockValue: true },
        });

        return {
          id: company.id,
          name: company.name,
          slug: company.slug,
          industry: company.industry,
          companyType: company.companyType,
          entryCount: company._count.salaryEntries,
          avgTotalComp: Math.round(avgStats._avg.totalComp || 0),
          avgBaseSalary: Math.round(avgStats._avg.baseSalary || 0),
          avgBonus: Math.round(avgStats._avg.bonus || 0),
          avgStockValue: Math.round(avgStats._avg.stockValue || 0),
        };
      })
    );

    return NextResponse.json({ data: companiesWithStats, total: companiesWithStats.length });
  } catch (error) {
    console.error("GET /api/companies error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}