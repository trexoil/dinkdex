'use client';

import Link from "next/link";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-brand-600">🏓</span>
            <span className="gradient-text">DinkDex</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/courts" className="hover:text-brand-600 transition-colors">Courts</Link>
            <Link href="/coaches" className="hover:text-brand-600 transition-colors">Coaches</Link>
            <Link href="/submit" className="hover:text-brand-600 transition-colors">Add Listing</Link>
            <Link href="/pricing" className="hover:text-brand-600 transition-colors">Pricing</Link>
            <Link href="/courts" className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">
              Find Courts
            </Link>
          </nav>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4">
          <nav className="flex flex-col gap-3 text-sm font-medium text-gray-600">
            <Link href="/courts" onClick={() => setOpen(false)}>Courts</Link>
            <Link href="/coaches" onClick={() => setOpen(false)}>Coaches</Link>
            <Link href="/submit" onClick={() => setOpen(false)}>Add Listing</Link>
            <Link href="/pricing" onClick={() => setOpen(false)}>Pricing</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
