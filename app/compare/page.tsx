"use client";

import { useState, useEffect } from "react";

function formatLakhs(amount: number): string {
  const lakhs = amount / 100000;
  return `₹${lakhs % 1 === 0 ? lakhs : lakhs.toFixed(1)}L`;
}

const ROLE_OPTIONS = [
  { value: "SOFTWARE_ENGINEERING", label: "Software Engineering" },
  { value: "DATA_SCIENCE", label: "Data Science" },
  { value: "PRODUCT_MANAGEMENT", label: "Product Management" },
];

const LEVEL_OPTIONS = [
  { value: 2, label: "Junior / SDE-1 / L3" },
  { value: 4, label: "Mid / SDE-2 / L4" },
  { value: 5, label: "Senior / L5" },
  { value: 6, label: "SDE-3 / L6" },
  { value: 7, label: "Staff / L7" },
];

export default function ComparePage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [role, setRole] = useState("SOFTWARE_ENGINEERING");
  const [levelOrder, setLevelOrder] = useState(4);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/companies")
      .then((r) => r.json())
      .then((d) => setCompanies(d.data || []));
  }, []);

  const toggleCompany = (slug: string) => {
    setSelected((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : prev.length < 3
        ? [...prev, slug]
        : prev
    );
    setResult(null);
  };

  const compare = async () => {
    if (selected.length < 2) return;
    setLoading(true);
    const res = await fetch("/api/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companies: selected, roleCategory: role, levelOrder }),
    });
    const json = await res.json();
    setResult(json);
    setLoading(false);
  };

  const maxComp = result
    ? Math.max(...result.comparison.map((c: any) => c.avgTotalComp))
    : 0;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Compare Companies</h1>
        <p className="text-gray-500 mt-1">
          Select 2–3 companies and compare compensation at the same level.
        </p>
      </div>

      {/* Step 1 — Pick Companies */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Step 1 — Select Companies (max 3)
        </h2>
        <div className="flex flex-wrap gap-2">
          {companies.map((c) => (
            <button
              key={c.slug}
              onClick={() => toggleCompany(c.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                selected.includes(c.slug)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 — Pick Role + Level */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Step 2 — Role & Level
        </h2>
        <div className="flex gap-3 flex-wrap">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <select
            value={levelOrder}
            onChange={(e) => setLevelOrder(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {LEVEL_OPTIONS.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Compare Button */}
      <button
        onClick={compare}
        disabled={selected.length < 2 || loading}
        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-40 transition-colors"
      >
        {loading ? "Comparing..." : `Compare ${selected.length} Companies`}
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Results</h2>
          {result.comparison.length === 0 ? (
            <p className="text-gray-400">No data found for this combination. Try a different level or role.</p>
          ) : (
            <div className="grid gap-4">
              {result.comparison.map((c: any, i: number) => (
                <div key={c.company.slug} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {i === 0 && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          Highest
                        </span>
                      )}
                      <h3 className="text-lg font-bold">{c.company.name}</h3>
                    </div>
                    <span className="text-2xl font-bold text-green-700">
                      {formatLakhs(c.avgTotalComp)}
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{ width: `${(c.avgTotalComp / maxComp) * 100}%` }}
                    />
                  </div>

                  {/* Breakdown */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Base</p>
                      <p className="font-semibold">{formatLakhs(c.avgBaseSalary)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Bonus</p>
                      <p className="font-semibold">{formatLakhs(c.avgBonus)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Stock</p>
                      <p className="font-semibold">{formatLakhs(c.avgStockValue)}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">{c.entryCount} data points</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}