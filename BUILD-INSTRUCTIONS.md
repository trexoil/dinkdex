# DinkDex Build Instructions — Next.js + Neon

## Tech Stack
- **Framework:** Next.js 16 (App Router, TypeScript, Turbopack)
- **Database:** Neon (PostgreSQL via `pg` — NOT Prisma)
- **Styling:** Tailwind CSS v4
- **Icons:** react-icons
- **Deploy:** Vercel (auto-deploy from GitHub)

---

## Step 1: Scaffold Project

```bash
npx create-next-app@latest dinkdex --typescript --tailwind --eslint --app --src-dir --no-import-alias --turbopack
cd dinkdex
npm install pg react-icons dotenv
```

## Step 2: Config Files

### `next.config.ts`
```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  serverExternalPackages: ['pg'],
};
export default nextConfig;
```

### `vercel.json`
```json
{ "framework": "nextjs" }
```

### `.env`
```
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
```

---

## Step 3: Database Schema

Create `prisma/schema.sql` with tables for your entities. Standard pattern:

1. **Main entity table** (e.g., `courts`, `services`, `products`, `tools`)
2. **Secondary entity table** (e.g., `coaches`, `providers`, `suppliers`)
3. **Junction table** for many-to-many relationships
4. **`leads` table** — email/lead capture
5. **`submissions` table** — user-submitted listing suggestions

Include indexes on: `slug`, `city`, `is_premium`, and foreign keys.

## Step 4: Database Connection (Critical — DNS Workaround)

Create `src/lib/db.ts`:

```ts
import { Pool } from 'pg'
import * as dns from 'dns'

const HOSTNAME = 'your-neon-hostname'  // e.g., ep-xxx-pooler.us-east-1.aws.neon.tech

async function resolveHost(): Promise<string> {
  return new Promise((resolve, reject) => {
    dns.resolve4(HOSTNAME, (err, addrs) => {
      if (err || !addrs.length) reject(err || new Error('No IPv4 addresses'))
      else resolve(addrs[0])
    })
  })
}

let pool: Pool | null = null
let poolInit: Promise<void> | null = null

async function getPool(): Promise<Pool> {
  if (pool) return pool
  if (!poolInit) {
    poolInit = (async () => {
      const ipv4 = await resolveHost()
      pool = new Pool({
        host: ipv4,
        database: 'neondb',
        user: 'neondb_owner',
        password: 'your-password',
        port: 5432,
        ssl: { rejectUnauthorized: false, servername: HOSTNAME },
        connectionTimeoutMillis: 10000,
      })
    })()
  }
  await poolInit
  return pool!
}

export async function query(text: string, params?: any[]) {
  const p = await getPool()
  const client = await p.connect()
  try { return await client.query(text, params) }
  finally { client.release() }
}
```

### Why the DNS Workaround?

When the Neon hostname is resolved, this server's DNS returns IPv6 addresses first. Node.js tries IPv6 but Neon doesn't accept it → timeout. The fix:
1. `dns.resolve4()` forces IPv4 lookup
2. Use the IP address as `host`
3. Set `servername: HOSTNAME` in `ssl` options for SNI routing

### Create Query Helpers

Export functions for each page pattern:
- `getAllItems({ search?, city?, featured?, limit?, offset? })`
- `getItemBySlug(slug)`
- `getCities()`
- `getFeaturedItems(limit?)`
- `createLead(data)` / `createSubmission(data)`

---

## Step 5: Push Schema + Seed Data

### `prisma/push-schema.js`
Node script that connects via the DNS workaround and runs `schema.sql`.

### Seed files
Create `prisma/entity-seed.js` with arrays of objects. Each object = one listing.

### `prisma/seed-pg.js`
Script that:
1. Clears existing data
2. Inserts entities
3. Inserts secondary entities
4. Links junction tables

### Run
```bash
node prisma/push-schema.js
node prisma/seed-pg.js
```

---

## Step 6: Layout + Globals

### `src/app/globals.css`
```css
@import "tailwindcss";
/* Define brand color variables */
@theme { --color-brand-50: ... --color-brand-900: ... }
/* Gradient text + hero gradient */
```

### `src/app/layout.tsx`
```tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// Root layout with Header + Footer wrapping {children}
```

---

## Step 7: Components

| Component | Type | Purpose |
|---|---|---|
| **Header.tsx** | Client | Responsive nav, mobile hamburger menu |
| **Footer.tsx** | Server | 4-column links + copyright |
| **SearchBar.tsx** | Client | Input + submit → navigates to `/listings?search=...` |
| **ItemCard.tsx** | Server | Reusable listing card with badges, amenities, location |
| **SecondaryCard.tsx** | Server | Card for secondary entity (coaches, providers) |

---

## Step 8: Pages

### Homepage (`/`)
Server component. Calls `getFeaturedItems()`, `getSecondaryItems()`, `getCities()`.
Sections: Hero search → Stats bar → Featured items grid → Featured secondary grid → CTA.

### Listing Index (`/[items]/`)
Server component with `searchParams`. 
```tsx
const params = await searchParams;
const items = await getAllItems({ search: params.search, city: params.city });
```
Filter buttons (all / indoor / outdoor style), search bar, item grid.

### Listing Detail (`/[items]/[slug]`)
Server component with `params`.
```tsx
const { slug } = await params;  // Must await! Next.js 16
const item = await getItemBySlug(slug);
```
Breadcrumb → Header with badges → Description → Details grid → Amenities → Sidebar with contact + lead capture form.

### Submit Page (`/submit`)
Client component. Form fields → POST to `/api/submit`. Shows success message on completion.

### Pricing Page (`/pricing`)
Server component. Hardcoded plan data. Free / Premium / Pro with feature lists.

---

## Step 9: API Routes

### `/api/leads` (POST)
Accepts `{ email, name?, type?, message? }`. Inserts into `leads` table.

### `/api/submit` (POST)
Accepts `{ name, email, listingName?, listingAddress?, message? }`. Inserts into `submissions` table.

---

## Step 10: Vercel Deployment

```bash
# GitHub setup
git init && git branch -m main
git config user.email "your@email.com"
git config user.name "your-name"
git remote add origin https://${GITHUB_TOKEN}@github.com/your-org/your-repo.git
git add -A && git commit -m "Initial commit"
git push -u origin main

# Vercel API deploy
curl -X POST -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v13/deployments?skipAutoDetectionConfirmation=1" \
  -d '{"name":"project-name","gitSource":{"type":"github","repoId":123456,"ref":"main"},"target":"production"}'

# Set env var
curl -X POST -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v10/projects/$PROJECT_ID/env" \
  -d '{"type":"plain","key":"DATABASE_URL","value":"postgresql://...","target":["production","preview","development"]}'

# Connect Git for auto-deploy
curl -X POST -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v9/projects/$PROJECT_ID/link" \
  -d '{"type":"github","repo":"your-org/your-repo","repoId":123456}'
```

After Git connect, push a commit to trigger the first deployment:
```bash
git commit --allow-empty -m "chore: trigger deploy"
git push origin main
```

---

## Next.js 16 Gotchas

| Issue | Fix |
|---|---|
| `params` returns Promise | `const { slug } = await params` |
| `searchParams` returns Promise | `const params = await searchParams` |
| node_modules TS errors | `typescript: { ignoreBuildErrors: true }` in next.config.ts |
| pg in server components | `serverExternalPackages: ['pg']` in next.config.ts |
| Neon DNS IPv6 timeout | Use `dns.resolve4()` + IP host + `servername` in SSL (see Step 4) |

---

## File Structure Summary

```
project/
├── prisma/
│   ├── schema.sql            # Full SQL schema
│   ├── entity-seed.js        # Seed data arrays
│   ├── seed-pg.js            # Seed runner script
│   └── push-schema.js        # Schema push script
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Homepage
│   │   ├── globals.css       # Tailwind + brand styles
│   │   ├── [items]/
│   │   │   ├── page.tsx      # Listing index
│   │   │   └── [slug]/
│   │   │       └── page.tsx  # Listing detail
│   │   ├── [secondary]/
│   │   │   ├── page.tsx      # Secondary index
│   │   │   └── [slug]/
│   │   │       └── page.tsx  # Secondary detail
│   │   ├── submit/page.tsx   # Submit listing form
│   │   ├── pricing/page.tsx  # Pricing plans
│   │   └── api/
│   │       ├── leads/route.ts
│   │       └── submit/route.ts
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── SearchBar.tsx
│   │   ├── ItemCard.tsx
│   │   └── SecondaryCard.tsx
│   └── lib/
│       └── db.ts             # DB connection + query helpers
├── .env                      # DATABASE_URL
├── next.config.ts
├── vercel.json
└── package.json
```
