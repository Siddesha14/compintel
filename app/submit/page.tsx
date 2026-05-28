"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ROLE_CATEGORIES = [
  "SOFTWARE_ENGINEERING", "DATA_SCIENCE", "PRODUCT_MANAGEMENT",
  "DESIGN", "DEVOPS", "SECURITY", "MANAGEMENT", "OTHER"
];

const LEVELS = ["Intern", "SDE-1", "SDE-2", "SDE-3", "L3", "L4", "L5", "L6", "Junior", "Senior", "Staff", "Principal"];
const CITIES = ["Bangalore", "Hyderabad", "Mumbai", "Delhi", "Pune", "Chennai", "Gurgaon", "Noida"];
const WORK_MODES = ["HYBRID", "REMOTE", "ONSITE"];

export default function SubmitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    companyName: "",
    role: "",
    roleCategory: "SOFTWARE_ENGINEERING",
    level: "SDE-2",
    yearsOfExp: "",
    city: "Bangalore",
    baseSalary: "",
    bonus: "",
    stockValue: "",
    workMode: "HYBRID",
    dataYear: "2024",
  });

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const totalComp =
    (Number(form.baseSalary) || 0) +
    (Number(form.bonus) || 0) +
    (Number(form.stockValue) || 0);

  const formatLakhs = (n: number) => {
    if (!n) return "—";
    return `₹${(n / 100000).toFixed(1)}L`;
  };

  const handleSubmit = async () => {
    if (!form.companyName || !form.role || !form.baseSalary || !form.yearsOfExp) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/salaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          yearsOfExp: Number(form.yearsOfExp),
          baseSalary: Number(form.baseSalary),
          bonus: Number(form.bonus) || 0,
          stockValue: Number(form.stockValue) || 0,
          dataYear: Number(form.dataYear),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError("Submission failed. Please check your inputs.");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  if (success) return (
    <div className="max-w-lg mx-auto text-center py-20">
      <div className="text-5xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-gray-900">Salary submitted!</h2>
      <p className="text-gray-500 mt-2">Thanks for contributing. Redirecting...</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Submit Your Salary</h1>
        <p className="text-gray-500 mt-1">
          All submissions are anonymous. Help the community know their worth.
        </p>
      </div>

      <div className="space-y-5">
        {/* Company + Role */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Flipkart"
              value={form.companyName}
              onChange={(e) => set("companyName", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Software Engineer"
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Role Category + Level */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role Category</label>
            <select
              value={form.roleCategory}
              onChange={(e) => set("roleCategory", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ROLE_CATEGORIES.map((r) => (
                <option key={r} value={r}>{r.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              value={form.level}
              onChange={(e) => set("level", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* YoE + City + WorkMode */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Exp <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="3"
              min="0" max="50"
              value={form.yearsOfExp}
              onChange={(e) => set("yearsOfExp", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
            <select
              value={form.workMode}
              onChange={(e) => set("workMode", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {WORK_MODES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Compensation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Base Salary (INR/year) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="2800000"
            value={form.baseSalary}
            onChange={(e) => set("baseSalary", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bonus (optional)
            </label>
            <input
              type="number"
              placeholder="400000"
              value={form.bonus}
              onChange={(e) => set("bonus", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock / RSU (optional, annualized)
            </label>
            <input
              type="number"
              placeholder="800000"
              value={form.stockValue}
              onChange={(e) => set("stockValue", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Live Total Comp */}
        {totalComp > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Total Compensation</p>
              <p className="text-xs text-green-600">Computed server-side on submission</p>
            </div>
            <p className="text-2xl font-bold text-green-700">{formatLakhs(totalComp)}</p>
          </div>
        )}

        {/* Data Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Year</label>
          <select
            value={form.dataYear}
            onChange={(e) => set("dataYear", e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {["2024", "2023", "2022"].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-40 transition-colors"
        >
          {loading ? "Submitting..." : "Submit Anonymously"}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Your identity is never stored. Data is used to help the community.
        </p>
      </div>
    </div>
  );
}