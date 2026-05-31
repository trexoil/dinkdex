'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiSearch, HiLocationMarker } from "react-icons/hi";

export default function SearchBar({ placeholder = "Search courts & coaches...", className = "" }: { placeholder?: string; className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/courts?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent shadow-sm"
        />
      </div>
      <button type="submit" className="bg-brand-600 text-white px-6 py-3.5 rounded-xl hover:bg-brand-700 transition-colors font-medium shadow-sm">
        Search
      </button>
    </form>
  );
}
