import Link from "next/link";
import { HiStar, HiLocationMarker, HiShieldCheck, HiLightningBolt } from "react-icons/hi";

interface CourtCardProps {
  court: {
    id: number;
    name: string;
    slug: string;
    city: string;
    state: string;
    country: string;
    indoor: boolean;
    court_count: number;
    has_lights: boolean;
    surface_type: string | null;
    amenities: string[];
    is_premium: boolean;
    verified: boolean;
    description: string | null;
  };
}

export default function CourtCard({ court }: CourtCardProps) {
  return (
    <Link href={`/courts/${court.slug}`} className="block group">
      <div className={`border rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${court.is_premium ? 'border-brand-300 bg-brand-50/50' : 'border-gray-100 bg-white'}`}>
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">{court.name}</h3>
                {court.verified && <HiShieldCheck className="text-brand-600" size={16} title="Verified" />}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <HiLocationMarker size={14} />
                <span>{court.city}, {court.state || court.country}</span>
              </div>
            </div>
            {court.is_premium && (
              <span className="bg-brand-100 text-brand-700 text-xs font-medium px-2.5 py-1 rounded-full">Premium</span>
            )}
          </div>

          {court.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{court.description}</p>
          )}

          <div className="flex flex-wrap gap-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${court.indoor ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
              {court.indoor ? '🏠 Indoor' : '☀️ Outdoor'}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-600 font-medium">
              {court.court_count} court{court.court_count > 1 ? 's' : ''}
            </span>
            {court.has_lights && (
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 font-medium">
                <HiLightningBolt className="inline mr-0.5" size={12} /> Lights
              </span>
            )}
            {court.surface_type && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-600 font-medium capitalize">
                {court.surface_type}
              </span>
            )}
          </div>

          {court.amenities && court.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {court.amenities.slice(0, 4).map((a: string) => (
                <span key={a} className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                  {a.replace(/_/g, ' ')}
                </span>
              ))}
              {court.amenities.length > 4 && (
                <span className="text-xs text-gray-400">+{court.amenities.length - 4} more</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
