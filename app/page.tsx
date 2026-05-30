"use client";

import { useState, useEffect, useCallback } from "react";
import {SalaryTable } from "@/components/SalaryTable";

const ROLE_OPTIONS = [
  { value: "", label: "All Roles" },
  { value: "SOFTWARE_ENGINEERING", label: "Software Engineering" },
  { value: "DATA_SCIENCE", label: "Data Science" },
  { value: "PRODUCT_MANAGEMENT", label: "Product Management" },
  { value: "DESIGN", label: "Design" },
  { value: "DEVOPS", label: "DevOps" },
  { value: "OTHER", label: "Other" },
];

export default function HomePage() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");

  const fetchSalaries = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (role) params.set("roleCategory", role);
    if (company) params.set("company", company);
    if (city) params.set("city", city);
    params.set("page", String(page));
    params.set("limit", "20");

    const res = await fetch(`/api/salaries?${params.toString()}`);
    const json = await res.json();
    setData(json.data || []);
    setTotal(json.meta?.total || json.total || 0);
    setLoading(false);
  }, [role, company, city, page]);

  useEffect(() => {
    const timer = setTimeout(fetchSalaries, 300);
    return () => clearTimeout(timer);
  }, [fetchSalaries]);

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="pt-6 pb-2">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Know Your Worth
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Transparent compensation data for Indian tech. Real salaries, real levels.
        </p>
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
          <span className="font-semibold text-gray-700">{total}</span> salary entries
          across <span className="font-semibold text-gray-700">10</span> companies
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={role}
          onChange={(e) => { setRole(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ROLE_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Filter by company..."
          value={company}
          onChange={(e) => { setCompany(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
        />

        <input
          type="text"
          placeholder="Filter by city..."
          value={city}
          onChange={(e) => { setCity(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
        />

        {(role || company || city) && (
          <button
            onClick={() => { setRole(""); setCompany(""); setCity(""); setPage(1); }}
            className="text-sm text-gray-400 hover:text-gray-700 px-2"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <SalaryTable data={data} loading={loading} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Page {page} of {totalPages} · {total} results
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}