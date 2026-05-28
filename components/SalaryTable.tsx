"use client";

import Link from "next/link";

interface Company {
  name: string;
  slug: string;
}

interface SalaryEntry {
  id: string;
  company: Company;
  role: string;
  level: string;
  baseSalary: number;
  bonus: number;
  stockValue: number;
  totalComp: number;
  city: string;
  yearsOfExp: number;
}

function formatLakhs(amount: number): string {
  const lakhs = amount / 100000;
  return `₹${lakhs % 1 === 0 ? lakhs : lakhs.toFixed(1)}L`;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100">
      {Array(9).fill(0).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
        </td>
      ))}
    </tr>
  );
}

interface Props {
  data: SalaryEntry[];
  loading: boolean;
}

export default function SalaryTable({ data, loading }: Props) {
  const headers = ["Company", "Role", "Level", "Base", "Bonus", "Stock", "Total Comp", "City", "YoE"];

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array(8).fill(0).map((_, i) => <SkeletonRow key={i} />)
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                No salary data found. Try adjusting filters.
              </td>
            </tr>
          ) : (
            data.map((entry) => (
              <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/company/${entry.company.slug}`} className="text-blue-600 hover:underline">
                    {entry.company.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-700">{entry.role}</td>
                <td className="px-4 py-3">
                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">
                    {entry.level}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">{formatLakhs(entry.baseSalary)}</td>
                <td className="px-4 py-3 text-gray-700">{formatLakhs(entry.bonus)}</td>
                <td className="px-4 py-3 text-gray-700">{formatLakhs(entry.stockValue)}</td>
                <td className="px-4 py-3 font-semibold text-green-700">{formatLakhs(entry.totalComp)}</td>
                <td className="px-4 py-3 text-gray-600">{entry.city}</td>
                <td className="px-4 py-3 text-gray-600">{entry.yearsOfExp}y</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
  
}
export { SalaryTable };