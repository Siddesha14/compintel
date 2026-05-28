"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

function formatLakhs(amount: number): string {
  const lakhs = amount / 100000;
  return `₹${lakhs % 1 === 0 ? lakhs : lakhs.toFixed(1)}L`;
}

export default function CompanyPage() {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/companies/${slug}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-100 rounded w-48" />
      <div className="grid grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-lg" />)}
      </div>
    </div>
  );

  if (!data?.company) return (
    <div className="text-center py-20 text-gray-400">Company not found.</div>
  );

  const { company, aggregateStats, groupedByLevel } = data;
  const maxComp = Math.max(...groupedByLevel.map((l: any) => l.avgTotalComp));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">← Back</Link>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="text-3xl font-bold">{company.name}</h1>
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
            {company.companyType}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
            {company.industry}
          </span>
        </div>
        <p className="text-gray-500 mt-1">{company.entryCount} salary entries</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Avg Total Comp", value: formatLakhs(aggregateStats.avgTotalComp) },
          { label: "Avg Base", value: formatLakhs(aggregateStats.avgBaseSalary) },
          { label: "Min Total Comp", value: formatLakhs(aggregateStats.minTotalComp) },
          { label: "Max Total Comp", value: formatLakhs(aggregateStats.maxTotalComp) },
        ].map((stat) => (
          <div key={stat.label} className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Level Breakdown */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Compensation by Level</h2>
        <div className="space-y-3">
          {groupedByLevel.map((level: any) => (
            <div key={level.level} className="flex items-center gap-4">
              <span className="text-sm font-medium w-16 shrink-0">{level.level}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-8 relative">
                <div
                  className="bg-blue-500 h-8 rounded-full flex items-center px-3"
                  style={{ width: `${Math.max(10, (level.avgTotalComp / maxComp) * 100)}%` }}
                >
                  <span className="text-white text-xs font-semibold whitespace-nowrap">
                    {formatLakhs(level.avgTotalComp)}
                  </span>
                </div>
              </div>
              <span className="text-xs text-gray-400 w-16 shrink-0">{level.count} entries</span>
            </div>
          ))}
        </div>
      </div>

      {/* Entries Table */}
      <div>
        <h2 className="text-lg font-semibold mb-4">All Entries</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["Role", "Level", "Base", "Bonus", "Stock", "Total Comp", "City", "YoE"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.groupedByLevel && groupedByLevel.map((level: any) => (
                <tr key={level.level} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">Software Engineer</td>
                  <td className="px-4 py-3">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{level.level}</span>
                  </td>
                  <td className="px-4 py-3">{formatLakhs(level.avgBaseSalary)}</td>
                  <td className="px-4 py-3">{formatLakhs(level.avgBonus)}</td>
                  <td className="px-4 py-3">{formatLakhs(level.avgStockValue)}</td>
                  <td className="px-4 py-3 font-semibold text-green-700">{formatLakhs(level.avgTotalComp)}</td>
                  <td className="px-4 py-3 text-gray-400">—</td>
                  <td className="px-4 py-3 text-gray-400">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}