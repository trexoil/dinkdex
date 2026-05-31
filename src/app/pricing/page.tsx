import Link from "next/link";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Simple, Transparent Pricing</h1>
        <p className="text-gray-500 max-w-lg mx-auto">Free to get listed. Upgrade when you're ready to grow.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.name} className={`border rounded-2xl p-8 ${plan.featured ? 'border-brand-500 bg-brand-50/30 ring-2 ring-brand-500' : 'border-gray-200 bg-white'}`}>
            {plan.featured && (
              <span className="bg-brand-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block">Most Popular</span>
            )}
            <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
            <div className="mb-2">
              <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
              <span className="text-gray-500 text-sm">{plan.period}</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">{plan.description}</p>
            <ul className="space-y-2.5 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-brand-600 mt-0.5">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href={plan.href} className={`block text-center py-3 rounded-xl font-medium transition-colors ${plan.featured ? 'bg-brand-600 text-white hover:bg-brand-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
