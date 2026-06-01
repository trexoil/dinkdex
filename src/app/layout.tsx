import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "DinkDex — Find Pickleball Courts & Coaches Near You",
  description: "Discover pickleball courts, coaches, tournaments, and community. The ultimate pickleball directory for players worldwide.",
  keywords: "pickleball courts, pickleball coaches, pickleball near me, pickleball lessons, indoor pickleball",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0c0f] text-[#f1f5f9] antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
