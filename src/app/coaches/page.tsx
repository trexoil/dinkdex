import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import CoachCard from "@/components/CoachCard";
import { getAllCoaches } from "@/lib/db";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {cityParam ? `Pickleball Coaches in ${cityParam}` : 'All Pickleball Coaches'}
        </h1>
        <p className="text-gray-500">Find {coaches.length} certified pickleball coaches worldwide</p>
      </div>

      <div className="mb-8">
        <SearchBar placeholder="Search coaches by name, city, or specialty..." className="max-w-xl" />
      </div>

      {coaches.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎾</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No coaches found</h2>
          <p className="text-gray-500">Try adjusting your search.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coaches.map((coach: any) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>
      )}
    </div>
  );
}
