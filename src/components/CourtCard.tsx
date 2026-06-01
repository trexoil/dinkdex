import Link from "next/link";
import Image from "next/image";
import { HiLocationMarker, HiShieldCheck } from "react-icons/hi";
import { getCourtImage } from "@/lib/listing-images";

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
    photo?: string | null;
    photos?: unknown;
    is_premium: boolean;
    verified: boolean;
    description: string | null;
  };
}

export default function CourtCard({ court }: CourtCardProps) {
  const imageUrl = getCourtImage(court);

  return (
    <Link href={`/courts/${court.slug}`} className="group block">
      <article className="card flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={imageUrl}
            alt={court.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

          <div className="absolute left-3 top-3 flex gap-2">
            {court.is_premium && (
              <span className="rounded-md bg-accent px-2.5 py-1 text-[11px] font-bold tracking-wide text-bg">
                PREMIUM
              </span>
            )}
            {court.verified && (
              <span className="flex items-center gap-1 rounded-md bg-fg/95 px-2 py-1 text-[11px] font-semibold text-bg">
                <HiShieldCheck size={12} /> Verified
              </span>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <h3 className="text-lg font-semibold tracking-tight">{court.name}</h3>
            <div className="mt-0.5 flex items-center gap-1 text-sm text-white/80">
              <HiLocationMarker size={14} /> {court.city}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          {court.description && (
            <p className="text-muted mb-4 line-clamp-2 text-sm leading-relaxed">
              {court.description}
            </p>
          )}
          <div className="mt-auto flex flex-wrap gap-2 text-xs text-subtle">
            <span className="rounded-md border border-border px-2.5 py-1">
              {court.court_count} courts
            </span>
            {court.has_lights && (
              <span className="rounded-md border border-border px-2.5 py-1">
                Lights
              </span>
            )}
            {court.surface_type && (
              <span className="rounded-md border border-border px-2.5 py-1 capitalize">
                {court.surface_type}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
