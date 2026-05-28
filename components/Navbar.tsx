import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          Comp<span className="text-blue-600">Intel</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-gray-900 transition-colors">Salaries</Link>
          <Link href="/compare" className="hover:text-gray-900 transition-colors">Compare</Link>
          <Link href="/submit" className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors">
            Submit Salary
          </Link>
        </div>
      </div>
    </nav>
  );
}