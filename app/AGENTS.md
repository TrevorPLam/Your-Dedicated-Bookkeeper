# app/AGENTS.md — Next.js App Router Pages

Last Updated: 2026-01-06
Applies To: Any agent working in app/

## Purpose
This folder contains all pages and routes using Next.js 14 App Router. The site uses **Static Site Generation (SSG)** — all pages are pre-rendered at build time.

---

## Architecture

**Deployment Model:** Static Site Generation (SSG)
**Hosting:** Cloudflare Pages with global CDN
**Runtime:** Edge (for API routes only)

---

## Folder Structure

```
app/
├── AGENTS.md           # This file
├── layout.tsx          # Root layout (Navigation, Footer, Providers)
├── page.tsx            # Homepage
├── globals.css         # Global styles (Tailwind imports)
├── providers.tsx       # Client-side providers (ErrorBoundary)
├── loading.tsx         # Global loading state
├── not-found.tsx       # 404 page
├── robots.ts           # robots.txt generation
├── sitemap.ts          # sitemap.xml generation
│
├── about/page.tsx      # /about
├── contact/page.tsx    # /contact
├── pricing/page.tsx    # /pricing
├── search/page.tsx     # /search
│
├── blog/
│   ├── page.tsx        # /blog (listing)
│   └── [slug]/page.tsx # /blog/:slug (individual posts)
│
├── case-studies/
│   ├── page.tsx        # /case-studies (listing)
│   └── [slug]/page.tsx # /case-studies/:slug
│
├── services/
│   ├── page.tsx        # /services (overview)
│   ├── seo/page.tsx    # /services/seo
│   ├── content/page.tsx # /services/content
│   ├── social/page.tsx # /services/social
│   └── email/page.tsx  # /services/email
│
├── feed.xml/route.ts   # RSS feed
│
└── api/
    └── og/route.tsx    # OG image generation (Edge)
```

---

## Routing Patterns

### Static Pages
Most pages are static with no dynamic segments:
```
/about, /contact, /pricing, /search, /services/*
```

### Dynamic Routes
Two routes use dynamic segments:
- `/blog/[slug]` — Blog posts from `content/blog/*.mdx`
- `/case-studies/[slug]` — Case studies from `lib/case-studies.ts`

Both use `generateStaticParams()` for SSG:
```typescript
export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}
```

### API Routes
Only one API route exists:
- `/api/og` — Dynamic OG image generation (Edge runtime)

---

## Metadata Pattern

Every page exports a `metadata` object:

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title | Your Dedicated Marketer',
  description: 'Page description for SEO.',
  // Optional: OpenGraph, Twitter, etc.
}
```

For dynamic pages, use `generateMetadata()`:
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  return {
    title: post?.title,
    description: post?.description,
  }
}
```

---

## Layout Structure

```
RootLayout (app/layout.tsx)
├── <SkipToContent />
├── <Navigation searchItems={...} />
├── <Providers>
│   ├── <ErrorBoundary>
│   ├── <Breadcrumbs />
│   └── {children} ← Page content
├── <Footer />
└── <InstallPrompt />
```

---

## Conventions

### Page Files
- File: `page.tsx` (required for route to exist)
- Export: `default function PageName()`
- Metadata: Export `metadata` or `generateMetadata()`

### Server vs Client
- **Pages are Server Components by default**
- Only add `'use client'` if the page needs client-side interactivity
- Currently, ALL pages are server components

### Data Fetching
- **NO client-side data fetching** (site is fully static)
- Data comes from: `lib/blog.ts`, `lib/case-studies.ts`, `lib/search.ts`
- All data is resolved at build time

---

## Service Page Pattern

All service pages (`/services/*`) follow the same template using `ServiceDetailLayout`:

```typescript
import ServiceDetailLayout from '@/components/ServiceDetailLayout'

export default function SEOServicePage() {
  return (
    <ServiceDetailLayout
      icon={Search}
      title="SEO Services"
      description="..."
      included={['Item 1', 'Item 2']}
      process={[{ title: 'Step 1', description: '...' }]}
      whoItsFor={['Audience 1', 'Audience 2']}
      pricing={[{ tier: 'Starter', description: '...', href: '/pricing' }]}
      faqs={[{ question: '...', answer: '...' }]}
    />
  )
}
```

---

## Do NOT

- Add client-side data fetching (breaks SSG)
- Create API routes for data (no database)
- Use `'use client'` on pages unless absolutely required
- Add authentication (site is public)
- Import server-only modules in client components

---

## Creating a New Page

1. Create folder (if nested route) or `page.tsx` directly
2. Export default page component
3. Export `metadata` for SEO
4. Use existing components from `components/`
5. Import data from `lib/` if needed
6. Update sitemap.ts if adding new static pages
7. Update navigation if page should be in menu

---

## Special Files Reference

| File | Purpose |
|------|---------|
| `layout.tsx` | Wraps all pages, provides shared UI |
| `loading.tsx` | Loading UI while page loads |
| `not-found.tsx` | 404 error page |
| `error.tsx` | Runtime error page (not currently used) |
| `robots.ts` | Generates robots.txt |
| `sitemap.ts` | Generates sitemap.xml |
