import { notFound } from "next/navigation";
import Link from "next/link";
import { getCourtBySlug } from "@/lib/db";
import { HiLocationMarker, HiPhone, HiGlobe, HiClock, HiShieldCheck, HiLightningBolt, HiStar } from "react-icons/hi";

export default async function CourtDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const court = await getCourtBySlug(slug);

  if (!court) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/courts" className="hover:text-brand-600">Courts</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{court.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{court.name}</h1>
              {court.verified && <HiShieldCheck className="text-brand-600" size={24} title="Verified" />}
              {court.is_premium && (
                <span className="bg-brand-100 text-brand-700 text-sm font-medium px-3 py-1 rounded-full">Premium</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <HiLocationMarker size={16} />
              <span>{court.address}, {court.city}, {court.state}, {court.country}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          {court.description && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-semibold text-gray-900 mb-3">About</h2>
              <p className="text-gray-600">{court.description}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Court Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{court.indoor ? '🏠' : '☀️'}</span>
                <div>
                  <div className="text-sm text-gray-500">Type</div>
                  <div className="font-medium">{court.indoor ? 'Indoor' : 'Outdoor'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎾</span>
                <div>
                  <div className="text-sm text-gray-500">Courts</div>
                  <div className="font-medium">{court.court_count} court{court.court_count > 1 ? 's' : ''}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <HiLightningBolt className="text-yellow-500" size={24} />
                <div>
                  <div className="text-sm text-gray-500">Lights</div>
                  <div className="font-medium">{court.has_lights ? 'Yes' : 'No'}</div>
                </div>
              </div>
              {court.surface_type && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏗️</span>
                  <div>
                    <div className="text-sm text-gray-500">Surface</div>
                    <div className="font-medium capitalize">{court.surface_type}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Amenities */}
          {court.amenities && court.amenities.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {court.amenities.map((a: string) => (
                  <span key={a} className="bg-gray-50 text-gray-700 text-sm px-3 py-1.5 rounded-full capitalize">
                    {a.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Contact Card */}
          <div className="bg-white border border-brand-200 rounded-2xl p-6 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Contact & Book</h3>
            <div className="space-y-3">
              {court.phone && (
                <a href={`tel:${court.phone}`} className="flex items-center gap-3 text-gray-600 hover:text-brand-600 transition-colors">
                  <HiPhone size={18} />
                  <span>{court.phone}</span>
                </a>
              )}
              {court.website && (
                <a href={court.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-brand-600 transition-colors">
                  <HiGlobe size={18} />
                  <span>Visit Website</span>
                </a>
              )}
              {court.booking_url && (
                <a href={court.booking_url} target="_blank" rel="noopener noreferrer" className="block bg-brand-600 text-white text-center py-3 rounded-xl hover:bg-brand-700 transition-colors font-medium mt-4">
                  Book a Court →
                </a>
              )}
            </div>

            {/* Lead Capture */}
            <div className="border-t border-gray-100 mt-4 pt-4">
              <p className="text-sm text-gray-500 mb-3">Interested in this court? Get notified about availability and events.</p>
              <form className="space-y-2">
                <input type="email" placeholder="Your email" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                  Get Updates
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
