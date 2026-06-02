export const dynamic = "force-dynamic"

import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import CourtCard from "@/components/CourtCard";
import CoachCard from "@/components/CoachCard";
import { getFeaturedCourts, getFeaturedCoaches, getCities, getCourtCounts } from "@/lib/db";

export default async function HomePage() {
  const [featuredCourts, featuredCoaches, cities, counts] = await Promise.all([
    getFeaturedCourts(6),
    getFeaturedCoaches(3),
    getCities(),
    getCourtCounts(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="hero-gradient text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Find Your <span className="text-yellow-400">Dink</span>. Find Your Court.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {counts.courts}+ pickleball courts in {counts.countries} countries. {counts.coaches}+ certified coaches. Find yours today.
          </p>
          <SearchBar placeholder="Search by city, court name, or coach..." className="max-w-2xl mx-auto" />
          <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm text-gray-400">
            <span>Popular:</span>
            {cities.slice(0, 5).map((c: any) => (
              <Link key={c.city} href={`/courts?city=${encodeURIComponent(c.city)}`} className="text-brand-300 hover:text-white transition-colors">
                {c.city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-3 gap-4 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          {[
            { label: 'Courts Listed', value: `${counts.courts}+`, icon: '🏟️' },
            { label: 'Countries', value: `${counts.countries}`, icon: '🌍' },
            { label: 'Coaches', value: `${counts.coaches}+`, icon: '🎾' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="font-bold text-xl text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courts */}
      {featuredCourts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Courts</h2>
              <p className="text-gray-500 mt-1">Top-rated pickleball facilities worldwide</p>
            </div>
            <Link href="/courts" className="text-brand-600 font-medium hover:text-brand-700 text-sm">
              View all courts →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourts.map((court: any) => (
              <CourtCard key={court.id} court={court} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Coaches */}
      {featuredCoaches.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Coaches</h2>
              <p className="text-gray-500 mt-1">Professional pickleball instructors near you</p>
            </div>
            <Link href="/coaches" className="text-brand-600 font-medium hover:text-brand-700 text-sm">
              View all coaches →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCoaches.map((coach: any) => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Own a Pickleball Court?</h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            List your court on DinkDex and get discovered by thousands of pickleball players. Free basic listing. Premium features available.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/submit" className="bg-brand-600 text-white px-6 py-3 rounded-xl hover:bg-brand-700 transition-colors font-medium">
              Add Your Court
            </Link>
            <Link href="/pricing" className="bg-white text-brand-600 border border-brand-300 px-6 py-3 rounded-xl hover:bg-brand-50 transition-colors font-medium">
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
