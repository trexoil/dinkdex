import Link from "next/link";

const columns = [
  {
    heading: "Discover",
    links: [
      { href: "/courts", label: "Courts" },
      { href: "/coaches", label: "Coaches" },
      { href: "/submit", label: "Add Listing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/pricing", label: "Pricing" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Popular Cities",
    links: [
      { href: "/courts?city=Kuala+Lumpur", label: "Kuala Lumpur" },
      { href: "/courts?city=Singapore", label: "Singapore" },
      { href: "/courts?city=Kuching", label: "Kuching" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <h4 className="mb-3 font-semibold text-fg">DinkDex</h4>
            <p className="text-sm text-muted">The pickleball court &amp; coach directory.</p>
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="mb-3 font-semibold text-fg">{col.heading}</h4>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-muted transition-colors hover:text-fg">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-border pt-8 text-center text-sm text-subtle">
          © {new Date().getFullYear()} DinkDex. Built for the pickleball community.
        </div>
      </div>
    </footer>
  );
}
