type ListingImageSource = {
  id?: number | null;
  slug?: string | null;
  photo?: string | null;
  photos?: unknown;
};

export const courtImagesBySlug: Record<string, string> = {
  "kenanga-city-pickleball-stadium": "/images/court-kenanga-city-stadium.png",
  "pickleball-hub-mont-kiara": "/images/court-mont-kiara-mall.png",
  "kuching-pickleball-centre": "/images/hero-golden-hour.jpg",
  "penang-pickleball-arena": "/images/court-penang-arena.png",
  "jb-pickleball-club": "/images/hero-courts-sunset.jpg",
  "kota-kinabalu-pickleball-courts": "/images/court-kota-kinabalu-sports-complex.png",
  "pickleball-desa-parkcity": "/images/community-play.jpg",
  "ipoh-pickleball-centre": "/images/court-ipoh-indoor-centre.png",
  "singapore-pickleball-kallang": "/images/indoor-facility.jpg",
  "venice-beach-pickleball": "/images/court-venice-beach.png",
  "chicken-n-pickle-overland-park": "/images/court-overland-park-social.png",
  "sydney-pickleball-club": "/images/court-sydney-park-club.png",
  "pickleball-london-canary-wharf": "/images/court-london-rooftop.png",
  "dubai-pickleball-club": "/images/court-dubai-indoor-club.png",
  "hong-kong-pickleball-centre": "/images/court-hong-kong-centre.png",
  "auckland-pickleball-park": "/images/court-auckland-park.png",
  "bangkok-pickleball-center": "/images/court-bangkok-indoor.png",
  "jakarta-pickleball-gbk": "/images/court-jakarta-gbk.png",
};

export const coachImagesBySlug: Record<string, string> = {
  "coach-hafiz-rahman": "/images/coach-male.jpg",
  "coach-sarah-lim": "/images/coach-female.jpg",
  "coach-wilson-ng": "/images/coach-wilson-ng.png",
  "coach-azman-yusof": "/images/coach-azman-yusof.png",
  "coach-priya-devi": "/images/coach-priya-devi.png",
  "coach-jason-tan": "/images/coach-jason-tan.png",
  "coach-marcus-tan": "/images/coach-marcus-tan.png",
  "coach-dave-pickle-pro": "/images/coach-dave-pickle-pro.png",
};

export const pageImages = {
  courts: "/images/page-courts-directory.png",
  coaches: "/images/page-coaches-directory.png",
  pricing: "/images/page-pricing-growth.png",
  submit: "/images/page-submit-listing.png",
} as const;

const courtFallbacks = Object.values(courtImagesBySlug);
const coachFallbacks = Object.values(coachImagesBySlug);

function firstImage(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value;

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = firstImage(item);
      if (found) return found;
    }
  }

  if (value && typeof value === "object") {
    const source = value as { url?: unknown; src?: unknown; image?: unknown };
    return firstImage(source.url) ?? firstImage(source.src) ?? firstImage(source.image);
  }

  return null;
}

function fallbackImage(list: string[], id?: number | null) {
  const index = Math.abs(Number(id ?? 0)) % list.length;
  return list[index];
}

export function getCourtImage(court: ListingImageSource) {
  const slugImage = court.slug ? courtImagesBySlug[court.slug] : null;
  return firstImage(court.photo) ?? firstImage(court.photos) ?? slugImage ?? fallbackImage(courtFallbacks, court.id);
}

export function getCoachImage(coach: ListingImageSource) {
  const slugImage = coach.slug ? coachImagesBySlug[coach.slug] : null;
  return firstImage(coach.photo) ?? slugImage ?? fallbackImage(coachFallbacks, coach.id);
}
