import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-semibold mb-3">DinkDex</h4>
            <p className="text-sm">The pickleball court & coach directory.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Discover</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courts" className="hover:text-white transition-colors">Courts</Link></li>
              <li><Link href="/coaches" className="hover:text-white transition-colors">Coaches</Link></li>
              <li><Link href="/submit" className="hover:text-white transition-colors">Add Listing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Popular Cities</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courts?city=Kuala+Lumpur" className="hover:text-white transition-colors">Kuala Lumpur</Link></li>
              <li><Link href="/courts?city=Singapore" className="hover:text-white transition-colors">Singapore</Link></li>
              <li><Link href="/courts?city=Kuching" className="hover:text-white transition-colors">Kuching</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          © {new Date().getFullYear()} DinkDex. Built for the pickleball community. 🏓
        </div>
      </div>
    </footer>
  );
}
