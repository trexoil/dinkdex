import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCoachBySlug } from "@/lib/db";
import { getCoachImage } from "@/lib/listing-images";
import { HiLocationMarker, HiPhone, HiMail, HiGlobe, HiShieldCheck, HiCurrencyDollar, HiBadgeCheck, HiOfficeBuilding } from "react-icons/hi";

const panel = "rounded-[var(--radius-lg)] border border-border bg-surface p-6";

export default async function CoachDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const coach = await getCoachBySlug(slug);

  if (!coach) notFound();

  const coachImage = getCoachImage(coach);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-subtle">
        <Link href="/" className="transition-colors hover:text-fg">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/coaches" className="transition-colors hover:text-fg">Coaches</Link>
        <span className="mx-2">/</span>
        <span className="text-fg">{coach.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8 grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface">
          <Image
            src={coachImage}
            alt={coach.name}
            fill
            priority
            sizes="(min-width: 768px) 220px, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-3">
            <h1 className="text-section text-fg">{coach.name}</h1>
            {coach.verified && <HiShieldCheck className="text-accent" size={24} />}
            {coach.is_premium && (
              <span className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-bg">Premium</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-muted">
            <HiLocationMarker size={16} className="text-accent" />
            <span>{coach.city}, {coach.country}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          {coach.bio && (
            <div className={panel}>
              <h2 className="text-headline text-fg mb-3">About</h2>
              <p className="text-muted leading-relaxed">{coach.bio}</p>
            </div>
          )}

          {/* Certifications */}
          {coach.certifications && coach.certifications.length > 0 && (
            <div className={panel}>
              <h2 className="text-headline text-fg mb-3">Certifications</h2>
              <div className="flex flex-wrap gap-2">
                {coach.certifications.map((cert: string) => (
                  <span key={cert} className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent">
                    <HiBadgeCheck size={16} />
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Courts */}
          {coach.courts && coach.courts.length > 0 && (
            <div className={panel}>
              <h2 className="text-headline text-fg mb-3">Coaches at</h2>
              <div className="space-y-1">
                {coach.courts.map((court: { id: number; name: string; slug: string }) => (
                  <Link key={court.id} href={`/courts/${court.slug}`} className="flex items-center gap-2 py-1 font-medium text-accent transition-colors hover:text-accent-strong">
                    <HiOfficeBuilding size={16} /> {court.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className={`${panel} sticky top-24`}>
            <h3 className="text-headline text-fg mb-4">Book a session</h3>
            <div className="mb-4 space-y-3">
              {coach.hourly_rate && (
                <div className="flex items-center gap-2 text-lg font-semibold text-emerald-400">
                  <HiCurrencyDollar size={20} />
                  RM {coach.hourly_rate}/hr
                </div>
              )}
              <div className="text-sm text-subtle">{coach.experience_years}+ years experience</div>
            </div>

            <div className="mb-4 space-y-2">
              {coach.phone && (
                <a href={`tel:${coach.phone}`} className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-fg">
                  <HiPhone size={16} className="text-accent" /> {coach.phone}
                </a>
              )}
              {coach.email && (
                <a href={`mailto:${coach.email}`} className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-fg">
                  <HiMail size={16} className="text-accent" /> {coach.email}
                </a>
              )}
              {coach.website && (
                <a href={coach.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-fg">
                  <HiGlobe size={16} className="text-accent" /> Website
                </a>
              )}
            </div>

            {/* Lead Capture */}
            <div className="border-t border-border pt-4">
              <p className="mb-3 text-sm text-subtle">Want to book a lesson with {coach.name}?</p>
              <form className="space-y-2">
                <input type="text" placeholder="Your name" className="w-full rounded-[var(--radius-md)] border border-border-strong bg-surface-2 px-3 py-2 text-sm text-fg placeholder:text-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40" />
                <input type="email" placeholder="Your email" className="w-full rounded-[var(--radius-md)] border border-border-strong bg-surface-2 px-3 py-2 text-sm text-fg placeholder:text-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40" />
                <textarea placeholder="Message (skill level, preferred time...)" rows={3} className="w-full rounded-[var(--radius-md)] border border-border-strong bg-surface-2 px-3 py-2 text-sm text-fg placeholder:text-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40" />
                <button type="submit" className="w-full rounded-[var(--radius-md)] bg-accent py-2 text-sm font-semibold text-bg transition-colors hover:bg-accent-strong">
                  Request booking
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
