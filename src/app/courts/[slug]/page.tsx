import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCourtBySlug } from "@/lib/db";
import { getCourtImage } from "@/lib/listing-images";
import { HiLocationMarker, HiPhone, HiGlobe, HiShieldCheck, HiLightningBolt, HiHome, HiSun, HiViewGrid, HiCube } from "react-icons/hi";

const panel = "rounded-[var(--radius-lg)] border border-border bg-surface p-6";

export default async function CourtDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const court = await getCourtBySlug(slug);

  if (!court) notFound();

  const courtImage = getCourtImage(court);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-subtle">
        <Link href="/" className="transition-colors hover:text-fg">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/courts" className="transition-colors hover:text-fg">Courts</Link>
        <span className="mx-2">/</span>
        <span className="text-fg">{court.name}</span>
      </nav>

      <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface">
        <Image
          src={courtImage}
          alt={court.name}
          fill
          priority
          sizes="(min-width: 1024px) 896px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/35 via-transparent to-transparent" />
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <h1 className="text-section text-fg">{court.name}</h1>
          {court.verified && <HiShieldCheck className="text-accent" size={24} title="Verified" />}
          {court.is_premium && (
            <span className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-bg">Premium</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-muted">
          <HiLocationMarker size={16} className="text-accent" />
          <span>{court.address}, {court.city}, {court.state}, {court.country}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          {court.description && (
            <div className={panel}>
              <h2 className="text-headline text-fg mb-3">About</h2>
              <p className="text-muted leading-relaxed">{court.description}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className={panel}>
            <h2 className="text-headline text-fg mb-4">Court details</h2>
            <div className="grid grid-cols-2 gap-5">
              <div className="flex items-center gap-3">
                {court.indoor ? <HiHome className="text-accent" size={22} /> : <HiSun className="text-accent" size={22} />}
                <div>
                  <div className="text-sm text-subtle">Type</div>
                  <div className="font-medium text-fg">{court.indoor ? 'Indoor' : 'Outdoor'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <HiViewGrid className="text-accent" size={22} />
                <div>
                  <div className="text-sm text-subtle">Courts</div>
                  <div className="font-medium text-fg">{court.court_count} court{court.court_count > 1 ? 's' : ''}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <HiLightningBolt className="text-accent" size={22} />
                <div>
                  <div className="text-sm text-subtle">Lights</div>
                  <div className="font-medium text-fg">{court.has_lights ? 'Yes' : 'No'}</div>
                </div>
              </div>
              {court.surface_type && (
                <div className="flex items-center gap-3">
                  <HiCube className="text-accent" size={22} />
                  <div>
                    <div className="text-sm text-subtle">Surface</div>
                    <div className="font-medium capitalize text-fg">{court.surface_type}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Amenities */}
          {court.amenities && court.amenities.length > 0 && (
            <div className={panel}>
              <h2 className="text-headline text-fg mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {court.amenities.map((a: string) => (
                  <span key={a} className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm capitalize text-muted">
                    {a.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className={`${panel} sticky top-24`}>
            <h3 className="text-headline text-fg mb-4">Contact &amp; book</h3>
            <div className="space-y-3">
              {court.phone && (
                <a href={`tel:${court.phone}`} className="flex items-center gap-3 text-muted transition-colors hover:text-fg">
                  <HiPhone size={18} className="text-accent" />
                  <span>{court.phone}</span>
                </a>
              )}
              {court.website && (
                <a href={court.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted transition-colors hover:text-fg">
                  <HiGlobe size={18} className="text-accent" />
                  <span>Visit website</span>
                </a>
              )}
              {court.booking_url && (
                <a href={court.booking_url} target="_blank" rel="noopener noreferrer" className="mt-4 block rounded-[var(--radius-md)] bg-accent py-3 text-center font-semibold text-bg transition-colors hover:bg-accent-strong">
                  Book a court →
                </a>
              )}
            </div>

            {/* Lead Capture */}
            <div className="mt-5 border-t border-border pt-5">
              <p className="mb-3 text-sm text-subtle">Interested in this court? Get notified about availability and events.</p>
              <form className="space-y-2">
                <input type="email" placeholder="Your email" className="w-full rounded-[var(--radius-md)] border border-border-strong bg-surface-2 px-3 py-2 text-sm text-fg placeholder:text-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40" />
                <button type="submit" className="w-full rounded-[var(--radius-md)] border border-border-strong py-2 text-sm font-medium text-fg transition-colors hover:bg-surface-2">
                  Get updates
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
