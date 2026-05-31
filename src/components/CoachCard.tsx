import Link from "next/link";
import { HiStar, HiLocationMarker, HiShieldCheck, HiCurrencyDollar } from "react-icons/hi";

interface CoachCardProps {
  coach: {
    id: number;
    name: string;
    slug: string;
    bio: string | null;
    certifications: string[];
    experience_years: number;
    hourly_rate: number | null;
    city: string;
    country: string;
    is_premium: boolean;
    verified: boolean;
    courts?: { id: number; name: string; slug: string }[];
  };
}

export default function CoachCard({ coach }: CoachCardProps) {
  return (
    <Link href={`/coaches/${coach.slug}`} className="block group">
      <div className={`border rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${coach.is_premium ? 'border-brand-300 bg-brand-50/50' : 'border-gray-100 bg-white'}`}>
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-lg">
                  {coach.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{coach.name}</h3>
                    {coach.verified && <HiShieldCheck className="text-brand-600" size={16} />}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <HiLocationMarker size={14} />
                    <span>{coach.city}, {coach.country}</span>
                  </div>
                </div>
              </div>
            </div>
            {coach.is_premium && (
              <span className="bg-brand-100 text-brand-700 text-xs font-medium px-2.5 py-1 rounded-full">Premium</span>
            )}
          </div>

          {coach.bio && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{coach.bio}</p>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-600 font-medium">
              {coach.experience_years}+ yrs exp
            </span>
            {coach.hourly_rate && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 font-medium">
                <HiCurrencyDollar className="inline mr-0.5" size={12} />RM {coach.hourly_rate}/hr
              </span>
            )}
            {coach.certifications && coach.certifications.slice(0, 2).map((cert: string) => (
              <span key={cert} className="text-xs px-2 py-1 rounded-full bg-brand-50 text-brand-700 font-medium">
                {cert}
              </span>
            ))}
          </div>

          {coach.courts && coach.courts.length > 0 && (
            <p className="text-xs text-gray-400">
              Coaches at: {coach.courts.map((c: any) => c.name).join(', ')}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
