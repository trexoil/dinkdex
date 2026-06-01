'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiCheckCircle, HiArrowLeft } from "react-icons/hi";
import { pageImages } from "@/lib/listing-images";

const inputClass =
  "w-full rounded-[var(--radius-md)] border border-border-strong bg-surface-2 px-4 py-2.5 text-fg placeholder:text-subtle transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40";

export default function SubmitPage() {
  const [form, setForm] = useState({ name: "", email: "", listingName: "", listingAddress: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", listingName: "", listingAddress: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <div className="relative mb-7 aspect-[16/11] overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface">
            <Image
              src={pageImages.submit}
              alt="Preparing a pickleball court listing"
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/45 via-transparent to-transparent" />
          </div>
          <h1 className="text-section text-fg mb-2">Add your listing</h1>
          <p className="text-muted">
            List your pickleball court or coaching service on DinkDex. Free basic listing.
          </p>
        </div>

        {status === "success" ? (
          <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-8 text-center">
            <HiCheckCircle className="mx-auto mb-3 text-emerald-400" size={48} />
            <h2 className="text-headline text-fg mb-2">Submission received</h2>
            <p className="text-muted mb-5">
              We&rsquo;ll review your listing and get it published within 24-48 hours.
            </p>
            <Link href="/" className="inline-flex items-center gap-1.5 font-medium text-accent transition-colors hover:text-accent-strong">
              <HiArrowLeft size={16} /> Back to home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 rounded-[var(--radius-lg)] border border-border bg-surface p-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted">Your name *</label>
              <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted">Your email *</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted">Listing name (court or coaching business) *</label>
              <input required type="text" value={form.listingName} onChange={(e) => setForm({ ...form, listingName: e.target.value })} placeholder="e.g., Kuching Pickleball Centre" className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted">Address</label>
              <input type="text" value={form.listingAddress} onChange={(e) => setForm({ ...form, listingAddress: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted">Additional details</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} placeholder="Tell us about your court or coaching service..." className={inputClass} />
            </div>
            {status === "error" && (
              <p className="text-sm text-red-400">Something went wrong. Please try again.</p>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-[var(--radius-md)] bg-accent py-3 font-semibold text-bg transition-colors hover:bg-accent-strong disabled:opacity-60"
            >
              {status === "loading" ? "Submitting..." : "Submit listing"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
