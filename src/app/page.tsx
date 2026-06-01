export const dynamic = "force-dynamic"

import Link from "next/link";
import Image from "next/image";
import { HiShieldCheck, HiGlobeAlt, HiPhotograph, HiLocationMarker, HiArrowRight } from "react-icons/hi";
import SearchBar from "@/components/SearchBar";
import CourtCard from "@/components/CourtCard";
import CoachCard from "@/components/CoachCard";
import { getFeaturedCourts, getFeaturedCoaches } from "@/lib/db";
import { getCourtImage } from "@/lib/listing-images";

const locations = [
  { name: "Kuala Lumpur", country: "Malaysia", courts: "18+", image: "/images/court-kenanga-city-stadium.png" },
  { name: "Singapore", country: "Singapore", courts: "15+", image: "/images/indoor-facility.jpg" },
  { name: "Bangkok", country: "Thailand", courts: "12+", image: "/images/court-bangkok-indoor.png" },
  { name: "Los Angeles", country: "USA", courts: "40+", image: "/images/court-venice-beach.png" },
];

const valueProps = [
  {
    icon: HiShieldCheck,
    title: "Verified by hand",
    desc: "Every court and coach is checked by a real person before it goes live.",
  },
  {
    icon: HiGlobeAlt,
    title: "Local and global",
    desc: "Neighborhood courts in KL and Kuching, plus iconic spots in LA and Bali.",
  },
  {
    icon: HiPhotograph,
    title: "Real venue photos",
    desc: "Actual photography on every listing — no stock images, no surprises.",
  },
];

export default async function HomePage() {
  const [featuredCourts, featuredCoaches] = await Promise.all([
    getFeaturedCourts(6),
    getFeaturedCoaches(3),
  ]);

  const lead = featuredCourts[0];
  const leadImage = lead ? getCourtImage(lead) : "/images/page-courts-directory.png";
  const restCourts = featuredCourts.slice(1);

  return (
    <>
      {/* ============ HERO — subject: find a court ============ */}
      <section className="relative flex min-h-[86vh] items-center overflow-hidden">
        <Image
          src="/images/hero-golden-hour.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Left-weighted darkening keeps copy readable while the image breathes */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-bg/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />

        <div className="container-page relative z-10 w-full">
          <div className="max-w-2xl py-24">
            <p className="eyebrow mb-5">Courts · Coaches · Community</p>
            <h1 className="text-hero text-fg mb-6">
              Find where you&rsquo;ll<br className="hidden sm:block" /> play next.
            </h1>
            <p className="text-subhead text-muted mb-9 max-w-xl">
              The modern directory for serious pickleball players — verified
              courts and coaches, from Kuala Lumpur to LA.
            </p>

            <SearchBar
              className="max-w-xl"
              placeholder="Search by court, coach, or city…"
            />

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-subtle">
              <span>Popular</span>
              {["Kuala Lumpur", "Singapore", "Los Angeles"].map((c) => (
                <Link
                  key={c}
                  href={`/courts?city=${encodeURIComponent(c)}`}
                  className="text-muted transition-colors hover:text-fg"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURED COURTS — subject: the courts ============ */}
      {featuredCourts.length > 0 && (
        <section className="container-page pt-24 pb-20">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-2">Where people actually play</p>
              <h2 className="text-section text-fg">Featured courts</h2>
            </div>
            <Link
              href="/courts"
              className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-fg sm:flex"
            >
              Explore all courts <HiArrowRight size={15} />
            </Link>
          </div>

          {/* Spotlight lead card — the one element carrying the hierarchy */}
          {lead && (
            <Link
              href={`/courts/${lead.slug}`}
              className="card group mb-6 block"
            >
              <div className="grid lg:grid-cols-2">
                <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[340px]">
                  <Image
                    src={leadImage}
                    alt={lead.name}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute left-4 top-4 flex gap-2">
                    {lead.is_premium && (
                      <span className="rounded-md bg-accent px-2.5 py-1 text-[11px] font-bold tracking-wide text-bg">
                        PREMIUM
                      </span>
                    )}
                    {lead.verified && (
                      <span className="flex items-center gap-1 rounded-md bg-fg/95 px-2.5 py-1 text-[11px] font-semibold text-bg">
                        <HiShieldCheck size={13} /> Verified
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-center p-7 lg:p-10">
                  <div className="mb-2 flex items-center gap-1.5 text-sm text-subtle">
                    <HiLocationMarker size={15} className="text-accent" />
                    {lead.city}
                    {lead.country ? `, ${lead.country}` : ""}
                  </div>
                  <h3 className="text-headline text-fg mb-3">{lead.name}</h3>
                  {lead.description && (
                    <p className="text-muted mb-6 line-clamp-3 leading-relaxed">
                      {lead.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs text-muted">
                    <span className="rounded-md border border-border px-2.5 py-1">
                      {lead.court_count} courts
                    </span>
                    {lead.has_lights && (
                      <span className="rounded-md border border-border px-2.5 py-1">
                        Lights
                      </span>
                    )}
                    {lead.surface_type && (
                      <span className="rounded-md border border-border px-2.5 py-1 capitalize">
                        {lead.surface_type}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Balanced grid — no asymmetric dead space */}
          {restCourts.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {restCourts.map((court) => (
                <CourtCard key={court.id} court={court} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ============ FEATURED COACHES ============ */}
      {featuredCoaches.length > 0 && (
        <section className="container-page py-20">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-2">Learn from the best</p>
              <h2 className="text-section text-fg">Featured coaches</h2>
            </div>
            <Link
              href="/coaches"
              className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-fg sm:flex"
            >
              Meet all coaches <HiArrowRight size={15} />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCoaches.map((coach) => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>
        </section>
      )}

      {/* ============ TRENDING LOCATIONS ============ */}
      <section className="container-page py-20">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-2">Go global</p>
            <h2 className="text-section text-fg">Trending locations</h2>
          </div>
          <Link
            href="/courts"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-fg sm:flex"
          >
            See all locations <HiArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {locations.map((loc) => (
            <Link
              key={loc.name}
              href={`/courts?city=${encodeURIComponent(loc.name)}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)]"
            >
              <Image
                src={loc.image}
                alt={loc.name}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="mb-1 text-xs font-medium tracking-wide text-accent">
                  {loc.country}
                </div>
                <div className="text-lg font-semibold tracking-tight text-white">
                  {loc.name}
                </div>
                <div className="mt-0.5 text-sm text-white/75">
                  {loc.courts} courts
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ WHY DINKDEX — honest value props, not white cards ============ */}
      <section className="border-t border-border py-20">
        <div className="container-page">
          <div className="grid gap-x-10 gap-y-12 md:grid-cols-3">
            {valueProps.map(({ icon: Icon, title, desc }) => (
              <div key={title}>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-accent/12 text-accent">
                  <Icon size={22} />
                </div>
                <h3 className="text-headline text-fg mb-2">{title}</h3>
                <p className="text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="container-page pt-4 pb-28">
        <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface px-8 py-14 md:px-14 md:py-16">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow mb-3">For court owners &amp; coaches</p>
              <h2 className="text-section text-fg">
                Get discovered by thousands of players.
              </h2>
            </div>
            <div className="flex shrink-0 gap-3">
              <Link href="/submit" className="btn btn-primary">
                List your court
              </Link>
              <Link href="/pricing" className="btn btn-secondary">
                See pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
