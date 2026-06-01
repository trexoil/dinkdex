export const dynamic = "force-dynamic"

import Image from "next/image";
import { HiUserGroup } from "react-icons/hi";
import SearchBar from "@/components/SearchBar";
import CoachCard from "@/components/CoachCard";
import { getAllCoaches } from "@/lib/db";
import { pageImages } from "@/lib/listing-images";

export default async function CoachesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; city?: string }>
}) {
  const params = await searchParams;
  const coaches = await getAllCoaches({
    search: params.search,
    city: params.city,
    limit: 50,
  });

  const cityParam = params.city || '';

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="mb-12 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <h1 className="text-section text-fg mb-3">
              {cityParam ? `Pickleball coaches in ${cityParam}` : 'All pickleball coaches'}
            </h1>
            <p className="text-muted mb-8 max-w-2xl">
              Find {coaches.length} certified pickleball coaches worldwide with distinct coach profiles and real training context.
            </p>
            <SearchBar placeholder="Search coaches by name, city, or specialty..." className="max-w-xl" />
          </div>
          <div className="relative min-h-[260px] lg:min-h-[380px]">
            <Image
              src={pageImages.coaches}
              alt="Pickleball coach leading a small group clinic"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-surface/15 lg:to-transparent" />
          </div>
        </div>
      </section>

      {coaches.length === 0 ? (
        <div className="py-20 text-center">
          <HiUserGroup className="mx-auto mb-4 text-subtle" size={48} />
          <h2 className="text-headline text-fg mb-2">No coaches found</h2>
          <p className="text-muted">Try adjusting your search.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>
      )}
    </div>
  );
}
