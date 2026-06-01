import Link from "next/link";
import Image from "next/image";
import { HiLocationMarker, HiShieldCheck } from "react-icons/hi";
import { getCoachImage } from "@/lib/listing-images";

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
    photo?: string | null;
    is_premium: boolean;
    verified: boolean;
    courts?: { id: number; name: string; slug: string }[];
  };
}

export default function CoachCard({ coach }: CoachCardProps) {
  const imageUrl = getCoachImage(coach);

  return (
    <Link href={`/coaches/${coach.slug}`} className="group block">
      <article className="card flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={coach.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

          <div className="absolute left-3 top-3 flex gap-2">
            {coach.is_premium && (
              <span className="rounded-md bg-accent px-2.5 py-1 text-[11px] font-bold tracking-wide text-bg">
                PREMIUM
              </span>
            )}
            {coach.verified && (
              <span className="flex items-center gap-1 rounded-md bg-fg/95 px-2 py-1 text-[11px] font-semibold text-bg">
                <HiShieldCheck size={12} /> Verified
              </span>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <h3 className="text-lg font-semibold tracking-tight">{coach.name}</h3>
            <div className="mt-0.5 flex items-center gap-1 text-sm text-white/80">
              <HiLocationMarker size={14} /> {coach.city}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          {coach.bio && (
            <p className="text-muted mb-4 line-clamp-2 text-sm leading-relaxed">
              {coach.bio}
            </p>
          )}
          <div className="mt-auto flex flex-wrap gap-2 text-xs">
            <span className="rounded-md border border-border px-2.5 py-1 text-muted">
              {coach.experience_years}+ yrs
            </span>
            {coach.hourly_rate && (
              <span className="rounded-md bg-accent/10 px-2.5 py-1 font-medium text-accent">
                RM {coach.hourly_rate}/hr
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
