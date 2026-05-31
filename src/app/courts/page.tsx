import Link from "next/link";
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
    limit: 50,
  });

  const cityParam = params.city || '';
  const searchParam = params.search || '';
  const indoorParam = params.indoor || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {cityParam ? `Pickleball Courts in ${cityParam}` : 'All Pickleball Courts'}
        </h1>
        <p className="text-gray-500">Discover {courts.length} pickleball courts worldwide</p>
      </div>

      {/* Search + Filters */}
      <div className="mb-8 space-y-4">
        <SearchBar placeholder="Search courts by name or city..." className="max-w-xl" />
        <div className="flex flex-wrap gap-2">
          <Link href="/courts" className={`text-sm px-4 py-2 rounded-full font-medium transition-colors ${!indoorParam ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            All Courts
          </Link>
          <Link href="/courts?indoor=true" className={`text-sm px-4 py-2 rounded-full font-medium transition-colors ${indoorParam === 'true' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            🏠 Indoor Only
          </Link>
          <Link href="/courts?indoor=false" className={`text-sm px-4 py-2 rounded-full font-medium transition-colors ${indoorParam === 'false' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            ☀️ Outdoor Only
          </Link>
        </div>
      </div>

      {courts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🏟️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No courts found</h2>
          <p className="text-gray-500">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court: any) => (
            <CourtCard key={court.id} court={court} />
          ))}
        </div>
      )}
    </div>
  );
}
