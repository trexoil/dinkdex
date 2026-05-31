'use client';

import { useState } from "react";
import Link from "next/link";

export default function SubmitPage() {
  const [form, setForm] = useState({ name: '', email: '', listingName: '', listingAddress: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', listingName: '', listingAddress: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Your Listing</h1>
      <p className="text-gray-500 mb-8">List your pickleball court or coaching service on DinkDex. Free basic listing.</p>

      {status === 'success' ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">✅</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Submission Received!</h2>
          <p className="text-gray-600 mb-4">We'll review your listing and get it published within 24-48 hours.</p>
          <Link href="/" className="text-brand-600 font-medium hover:text-brand-700">← Back to Home</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-gray-100 rounded-2xl p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
            <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Email *</label>
            <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Listing Name (court or coaching business) *</label>
            <input required type="text" value={form.listingName} onChange={e => setForm({ ...form, listingName: e.target.value })} placeholder="e.g., Kuching Pickleball Centre" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input type="text" value={form.listingAddress} onChange={e => setForm({ ...form, listingAddress: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details</label>
            <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={4} placeholder="Tell us about your court or coaching service..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          {status === 'error' && (
            <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
          )}
          <button type="submit" disabled={status === 'loading'} className="w-full bg-brand-600 text-white py-3 rounded-xl hover:bg-brand-700 transition-colors font-medium disabled:opacity-50">
            {status === 'loading' ? 'Submitting...' : 'Submit Listing'}
          </button>
        </form>
      )}
    </div>
  );
}
