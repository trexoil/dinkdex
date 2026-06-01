'use client';

import Link from "next/link";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

const navLinks = [
  { href: "/courts", label: "Courts" },
  { href: "/coaches", label: "Coaches" },
  { href: "/submit", label: "Add Listing" },
  { href: "/pricing", label: "Pricing" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-lg">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-[21px] font-semibold tracking-tight">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="14" cy="14" r="12" stroke="#facc15" strokeWidth="3" />
              <circle cx="14" cy="14" r="7" stroke="#facc15" strokeWidth="1.8" strokeDasharray="3 4" />
              <path d="M8 14 Q14 8 20 14 Q14 20 8 14" stroke="#facc15" strokeWidth="1.8" fill="none" />
            </svg>
            <span className="text-fg">DinkDex</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-fg">
                {l.label}
              </Link>
            ))}
            <Link
              href="/courts"
              className="ml-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-bg transition-colors hover:bg-accent-strong"
            >
              Browse Courts
            </Link>
          </nav>

          <button
            className="-mr-2 p-2 text-fg md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <HiX size={22} /> : <HiMenu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-bg px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 py-2 text-sm font-medium text-muted">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 transition-colors hover:bg-surface hover:text-fg"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
