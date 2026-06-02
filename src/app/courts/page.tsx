export const dynamic = "force-dynamic"

import Link from "next/link";
import { HiHome, HiSun, HiViewGrid } from "react-icons/hi";
import SearchBar from "@/components/SearchBar";
import CourtCard from "@/components/CourtCard";
import { getAllCourts } from "@/lib/db";

export default async function CourtsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; city?: string; indoor?: string }>
}) {
  const params = await searchParams;
  const courts = await getAllCourts({
    search: params.search,
    city: params.city,
    indoor: params.indoor === 'true' ? true : params.indoor === 'false' ? false : undefined,
    limit: 500,
  });

  const cityParam = params.city || '';
  const indoorParam = params.indoor || '';

  const filters = [
    { href: "/courts", label: "All Courts", active: !indoorParam, icon: null },
    { href: "/courts?indoor=true", label: "Indoor Only", active: indoorParam === 'true', icon: HiHome },
    { href: "/courts?indoor=false", label: "Outdoor Only", active: indoorParam === 'false', icon: HiSun },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-section text-fg mb-2">
          {cityParam ? `Pickleball courts in ${cityParam}` : 'All pickleball courts'}
        </h1>
        <p className="text-muted mb-6">
          Discover {courts.length} pickleball courts worldwide — use the filters to narrow down.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar placeholder="Search courts by name or city..." className="max-w-md w-full" />
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  f.active
                    ? 'bg-accent text-bg'
                    : 'border border-border bg-surface-2 text-muted hover:border-border-strong hover:text-fg'
                }`}
              >
                {f.icon && <f.icon size={15} />}
                {f.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {courts.length === 0 ? (
        <div className="py-20 text-center">
          <HiViewGrid className="mx-auto mb-4 text-subtle" size={48} />
          <h2 className="text-headline text-fg mb-2">No courts found</h2>
          <p className="text-muted">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courts.map((court) => (
            <CourtCard key={court.id} court={court} />
          ))}
        </div>
      )}
    </div>
  );
}
