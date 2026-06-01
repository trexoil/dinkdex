'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiSearch } from "react-icons/hi";

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
        <HiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-subtle" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full rounded-full border border-border-strong bg-surface/90 py-3.5 pl-12 pr-4 text-fg placeholder:text-subtle backdrop-blur-sm transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>
      <button
        type="submit"
        className="rounded-full bg-accent px-6 py-3.5 font-semibold text-bg transition-colors hover:bg-accent-strong"
      >
        Search
      </button>
    </form>
  );
}
