import Link from "next/link";
import Image from "next/image";
import { HiCheck } from "react-icons/hi";
import { pageImages } from "@/lib/listing-images";

const plans = [
  {
    name: 'Free',
    price: 'RM 0',
    period: 'forever',
    description: 'Get listed. Get discovered.',
    features: [
      'Basic court/coach profile',
      'Appear in search results',
      'Contact info displayed',
      'City & category pages',
    ],
    cta: 'Get Started Free',
    href: '/submit',
    featured: false,
  },
  {
    name: 'Premium',
    price: 'RM 99',
    period: '/month',
    description: 'Stand out. Get more players.',
    features: [
      'Everything in Free',
      'Top placement in search',
      'Featured on homepage',
      'Photo gallery',
      'Booking link integration',
      'Lead capture form',
      'Analytics dashboard',
      'Verified badge',
    ],
    cta: 'Go Premium',
    href: '/submit',
    featured: true,
  },
  {
    name: 'Pro',
    price: 'RM 199',
    period: '/month',
    description: 'For serious court owners & coaches.',
    features: [
      'Everything in Premium',
      'Priority support',
      'Bulk court management',
      'API access',
      'Custom branding',
      'Dedicated landing page',
      'Weekly lead reports',
      'First in search results',
    ],
    cta: 'Go Pro',
    href: '/submit',
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="mb-14 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <h1 className="text-section text-fg mb-3">Simple, transparent pricing</h1>
            <p className="text-muted max-w-lg">
              Free to get listed. Upgrade when you&rsquo;re ready to grow with better placement, galleries, leads, and reporting.
            </p>
          </div>
          <div className="relative min-h-[260px] lg:min-h-[360px]">
            <Image
              src={pageImages.pricing}
              alt="Court owner reviewing listing growth beside a pickleball court"
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/45 via-transparent to-transparent lg:bg-gradient-to-r lg:from-surface/10 lg:to-transparent" />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-[var(--radius-lg)] border p-8 ${
              plan.featured
                ? 'border-accent bg-accent/[0.06] ring-1 ring-accent'
                : 'border-border bg-surface'
            }`}
          >
            {plan.featured && (
              <span className="mb-4 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-bg">
                Most Popular
              </span>
            )}
            <h3 className="text-headline text-fg mb-1">{plan.name}</h3>
            <div className="mb-2 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-fg">{plan.price}</span>
              <span className="text-sm text-subtle">{plan.period}</span>
            </div>
            <p className="text-muted mb-6 text-sm">{plan.description}</p>
            <ul className="mb-8 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted">
                  <HiCheck className="mt-0.5 shrink-0 text-accent" size={16} /> {f}
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={`block rounded-[var(--radius-md)] py-3 text-center font-semibold transition-colors ${
                plan.featured
                  ? 'bg-accent text-bg hover:bg-accent-strong'
                  : 'border border-border-strong text-fg hover:bg-surface-2'
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
