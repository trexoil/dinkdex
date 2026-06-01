export const dynamic = "force-dynamic"

import Link from "next/link";
import Image from "next/image";
import { HiHome, HiSun, HiViewGrid } from "react-icons/hi";
import SearchBar from "@/components/SearchBar";
import CourtCard from "@/components/CourtCard";
import { getAllCourts } from "@/lib/db";
import { pageImages } from "@/lib/listing-images";

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
    limit: 50,
  });

  const cityParam = params.city || '';
  const indoorParam = params.indoor || '';

  const filters = [
    { href: "/courts", label: "All Courts", active: !indoorParam, icon: null },
    { href: "/courts?indoor=true", label: "Indoor Only", active: indoorParam === 'true', icon: HiHome },
    { href: "/courts?indoor=false", label: "Outdoor Only", active: indoorParam === 'false', icon: HiSun },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="mb-12 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <h1 className="text-section text-fg mb-3">
              {cityParam ? `Pickleball courts in ${cityParam}` : 'All pickleball courts'}
            </h1>
            <p className="text-muted mb-8 max-w-2xl">
              Discover {courts.length} pickleball courts worldwide with real venue imagery and practical filters.
            </p>

            <div className="space-y-4">
              <SearchBar placeholder="Search courts by name or city..." className="max-w-xl" />
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
          <div className="relative min-h-[260px] lg:min-h-[380px]">
            <Image
              src={pageImages.courts}
              alt="Pickleball courts ready for play"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-surface/15 lg:to-transparent" />
          </div>
        </div>
      </section>

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
