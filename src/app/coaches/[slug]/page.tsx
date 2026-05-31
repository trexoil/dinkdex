import { notFound } from "next/navigation";
import Link from "next/link";
import { getCoachBySlug } from "@/lib/db";
import { HiLocationMarker, HiPhone, HiMail, HiGlobe, HiShieldCheck, HiCurrencyDollar, HiBadgeCheck } from "react-icons/hi";

export default async function CoachDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const coach = await getCoachBySlug(slug);

  if (!coach) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/coaches" className="hover:text-brand-600">Coaches</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{coach.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-2xl flex-shrink-0">
            {coach.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-gray-900">{coach.name}</h1>
              {coach.verified && <HiShieldCheck className="text-brand-600" size={24} />}
              {coach.is_premium && (
                <span className="bg-brand-100 text-brand-700 text-sm font-medium px-3 py-1 rounded-full">Premium</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <HiLocationMarker size={16} />
              <span>{coach.city}, {coach.country}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Bio */}
          {coach.bio && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-semibold text-gray-900 mb-3">About</h2>
              <p className="text-gray-600">{coach.bio}</p>
            </div>
          )}

          {/* Certifications */}
          {coach.certifications && coach.certifications.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Certifications</h2>
              <div className="flex flex-wrap gap-2">
                {coach.certifications.map((cert: string) => (
                  <span key={cert} className="flex items-center gap-1.5 bg-brand-50 text-brand-700 text-sm px-3 py-1.5 rounded-full">
                    <HiBadgeCheck size={16} />
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Courts */}
          {coach.courts && coach.courts.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Coaches At</h2>
              <div className="space-y-2">
                {coach.courts.map((court: any) => (
                  <Link key={court.id} href={`/courts/${court.slug}`} className="block text-brand-600 hover:text-brand-700 font-medium">
                    🏟️ {court.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-brand-200 rounded-2xl p-6 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Book a Session</h3>
            <div className="space-y-3 mb-4">
              {coach.hourly_rate && (
                <div className="flex items-center gap-2 text-green-700 font-semibold text-lg">
                  <HiCurrencyDollar size={20} />
                  RM {coach.hourly_rate}/hr
                </div>
              )}
              <div className="text-sm text-gray-500">{coach.experience_years}+ years experience</div>
            </div>

            <div className="space-y-2 mb-4">
              {coach.phone && (
                <a href={`tel:${coach.phone}`} className="flex items-center gap-3 text-gray-600 hover:text-brand-600 transition-colors text-sm">
                  <HiPhone size={16} /> {coach.phone}
                </a>
              )}
              {coach.email && (
                <a href={`mailto:${coach.email}`} className="flex items-center gap-3 text-gray-600 hover:text-brand-600 transition-colors text-sm">
                  <HiMail size={16} /> {coach.email}
                </a>
              )}
              {coach.website && (
                <a href={coach.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-brand-600 transition-colors text-sm">
                  <HiGlobe size={16} /> Website
                </a>
              )}
            </div>

            {/* Lead Capture */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-500 mb-3">Want to book a lesson with {coach.name}?</p>
              <form className="space-y-2">
                <input type="text" placeholder="Your name" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                <input type="email" placeholder="Your email" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                <textarea placeholder="Message (skill level, preferred time...)" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={3} />
                <button type="submit" className="w-full bg-brand-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors">
                  Request Booking
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
