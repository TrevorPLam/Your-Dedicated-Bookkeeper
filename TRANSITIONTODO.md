# TRANSITIONTODO.md — Marketer → Bookkeeper Transition Task List

Document Type: Planning
Created: 2026-01-09
Scope Constraint: Keep branding/design system (colors, fonts, components). Update only company name, industry positioning, and service/content offering.

## Important governance note
- `TODO.md` remains the single task truth source (per `CODEBASECONSTITUTION.md` + `READMEAI.md`).
- This file is a **transition checklist** to be converted into `TODO.md` tasks (or a curated subset) once decisions (service list, domain, etc.) are confirmed.

---

## What the repo currently contains (observed)
This codebase is still heavily “Your Dedicated Marketer” + marketing-services oriented across:

### Global brand + SEO metadata
- `app/layout.tsx`: default title template, description, keywords, `Organization` schema (name/email/social), and OG image URL query all mention “Your Dedicated Marketer” and digital marketing.
- `app/api/og/route.tsx`: OG image defaults/tags are marketing-specific.
- `public/manifest.json`: name/description/categories/short_name are marketing-specific.
- `public/logo.svg`, `public/og-image.svg`: contain “MARKETER” and “Your Dedicated Marketer”.

### Pages and components
- Homepage content is marketing-specific:
  - `components/Hero.tsx`, `components/ServicesOverview.tsx`, `components/ValueProps.tsx`, `components/FinalCTA.tsx`
- Services are marketing-specific and hardcoded in:
  - `app/services/page.tsx`
  - `components/ServicesOverview.tsx`
  - `components/Footer.tsx` (services links)
  - `app/sitemap.ts` (service routes)
  - `lib/search.ts` (staticPages search index)
- Case studies/testimonials are marketing-specific:
  - `lib/case-studies.ts`, `components/CaseStudyHighlight.tsx`, `components/SocialProof.tsx`

### Contact pipeline UI
- `app/contact/page.tsx`: hardcoded marketing copy and `CONTACT_EMAIL`.
- `components/ContactForm.tsx` + `lib/contact-form-schema.ts`: includes a “Current Monthly Marketing Spend” field and marketing-oriented prompts.
- `lib/actions.ts`: still has marketing-email content pieces and references (and overall TODO roadmap mentions replacing email pipeline).

### Tests
- Unit tests assert marketing copy:
  - `__tests__/components/MarketingSections.test.tsx`
  - `__tests__/components/pages/pages.test.tsx`

### Content
- Blog MDX content under `content/blog/` is marketing-topic oriented (e.g., SEO, social, email marketing).

---

## Decisions required before implementation (Owner: Trevor)
These unblock correct edits and avoid guesswork.

### D-001: Canonical brand strings
- Decide the canonical display name: “Your Dedicated Bookkeeper”.
- Decide the short name / initials used in UI + PWA:
  - Current values: `YDM`, “YD Marketer”.
  - Proposed: **UNKNOWN** (e.g., “YDB”, “YD Bookkeeper”).

Acceptance criteria:
- Provide:
  - `SITE_NAME_LONG`
  - `SITE_NAME_SHORT`
  - `PWA_SHORT_NAME`

### D-002: Canonical service list + slugs
- Replace marketing services routes under `app/services/*`.
- Provide a list of bookkeeping services to offer and their URL slugs.

Acceptance criteria:
- Provide a table:
  - `service_name`, `service_slug`, `one_sentence_value_prop`, `3–6 features`, `faq questions (optional)`

### D-003: Domain/email/social handles
Currently hardcoded/mentioned:
- `contact@yourdedicatedmarketer.com`
- `@yourdedicatedmarketer`
- `yourdedicatedmarketer.com` referenced in multiple docs/examples

Acceptance criteria:
- Provide:
  - `NEXT_PUBLIC_SITE_URL` target domain
  - `CONTACT_EMAIL` target email
  - Social links/handles (or explicitly “none”)

### D-004: Keep or rewrite Blog + Case Studies?
- Option A: Keep both and rewrite for bookkeeping.
- Option B: Keep structure but hide in nav until bookkeeping content is ready.
- Option C: Remove (not recommended unless you explicitly want it).

Acceptance criteria:
- Choose A/B/C and confirm initial set of posts/case studies.

---

## Transition tasks (convert these into `TODO.md` items)

### TT-001 (P0) — Replace global brand name + metadata (Core)
Owner: AGENT

Update brand strings in the global metadata and structured data.

Primary files:
- `app/layout.tsx`
- `app/api/og/route.tsx`

Acceptance criteria:
- Default title template uses “Your Dedicated Bookkeeper”.
- Meta description + keywords are bookkeeping-oriented.
- `Organization` schema uses new name and new email/social links.
- Twitter creator handle updated or removed if not applicable.
- OG image default title/description/tags updated to bookkeeping.

### TT-002 (P0) — Update PWA manifest + app-title metadata
Owner: AGENT

Primary files:
- `public/manifest.json`
- `app/layout.tsx` (`apple-mobile-web-app-title`)

Acceptance criteria:
- `name`, `short_name`, `description`, `categories`, and shortcuts reflect bookkeeping.
- No “marketing” references remain.

### TT-003 (P0) — Update public brand assets (SVGs)
Owner: AGENT

Primary files:
- `public/logo.svg`
- `public/og-image.svg`

Acceptance criteria:
- Replace “MARKETER” text with “BOOKKEEPER” (or your chosen short mark).
- Replace “Your Dedicated Marketer” with “Your Dedicated Bookkeeper”.

### TT-004 (P0) — Remove “YD Marketer” UI label
Owner: AGENT

Primary files:
- `components/Navigation.tsx`
- `components/Footer.tsx`

Acceptance criteria:
- Logo label text uses new short brand (“YD Bookkeeper” / “YDB” / per D-001).
- Footer brand paragraph updated to bookkeeping positioning.

---

### TT-010 (P1) — Redesign Services information architecture
Owner: AGENT (implementation) + Trevor (copy/spec via D-002)

Primary files:
- `app/services/page.tsx`
- `app/services/*/page.tsx` (existing slugs: `seo`, `content`, `social`, `email`, `strategy`, `crm`, `funnel`, `reporting`)

Acceptance criteria:
- Marketing service cards replaced with bookkeeping service cards.
- Service slugs match D-002.
- Old marketing routes:
  - Either removed, or converted, or redirected (decision: **UNKNOWN**).

### TT-011 (P1) — Update homepage service section
Owner: AGENT

Primary files:
- `components/ServicesOverview.tsx`

Acceptance criteria:
- Headline and description are bookkeeping-focused.
- Cards align with the new service list.

### TT-012 (P1) — Update homepage hero + value props
Owner: AGENT

Primary files:
- `components/Hero.tsx`
- `components/ValueProps.tsx`
- `components/FinalCTA.tsx`

Acceptance criteria:
- Hero headline/subhead and CTA supporting copy match bookkeeping positioning.
- Value props describe bookkeeping outcomes (accuracy, compliance readiness, cash flow clarity, month-end close, etc.).
- Remove explicit “marketing” language.

---

### TT-020 (P1) — Update Pricing page for bookkeeping offerings
Owner: AGENT (implementation) + Trevor (pricing/copy)

Primary files:
- `app/pricing/page.tsx`

Acceptance criteria:
- Tier names, features, add-ons, and FAQs reflect bookkeeping.
- No SEO/content/social/email marketing deliverables remain.

---

### TT-030 (P1) — Update About page narrative to bookkeeping
Owner: AGENT (implementation) + Trevor (final copy approval)

Primary files:
- `app/about/page.tsx`

Acceptance criteria:
- Remove “digital marketing success/agency” framing.
- Replace story/values/approach to bookkeeping-oriented language.

---

### TT-040 (P1) — Update Contact page + contact details
Owner: AGENT (implementation) + Trevor (D-003)

Primary files:
- `app/contact/page.tsx`

Acceptance criteria:
- Replace marketing-focused hero and “what happens next” steps.
- Email address comes from configuration (prefer `validatedEnv.CONTACT_EMAIL`), not hardcoded.
- Phone number is **UNKNOWN** (either provide real number or remove).

### TT-041 (P1) — Update ContactForm fields for bookkeeping lead qualification
Owner: AGENT + Trevor (field requirements)

Primary files:
- `components/ContactForm.tsx`
- `lib/contact-form-schema.ts`
- `lib/actions.ts` (payload handling, email template until Supabase/HubSpot work lands)

Acceptance criteria:
- Replace “Current Monthly Marketing Spend” with bookkeeping-relevant intake (exact fields **UNKNOWN**).
- Placeholder text removed/updated (“marketing goals…”).
- Server action continues sanitizing and handling the new fields.

Note:
- This must be reconciled with the existing roadmap in `TODO.md` (Supabase + HubSpot). Don’t break those tasks.

---

### TT-050 (P1) — Update case studies to bookkeeping
Owner: AGENT (implementation) + Trevor (content)

Primary files:
- `lib/case-studies.ts`
- `components/CaseStudyHighlight.tsx`

Acceptance criteria:
- Case study titles, challenges, solutions, results, and services reflect bookkeeping.
- If you don’t have real case studies yet: replace with clearly placeholder-safe copy, or remove the section (decision: **UNKNOWN**).

### TT-051 (P1) — Update testimonials (SocialProof)
Owner: AGENT + Trevor (quotes)

Primary files:
- `components/SocialProof.tsx`

Acceptance criteria:
- Remove marketing-specific quotes.
- Replace metrics with bookkeeping-appropriate metrics (or remove metrics if you can’t support them).

---

### TT-060 (P1) — Update search index static pages and tags
Owner: AGENT

Primary files:
- `lib/search.ts`

Acceptance criteria:
- `staticPages` descriptions/tags match bookkeeping.
- If service routes change, search entries reflect the new IA.

### TT-061 (P1) — Update sitemap to reflect new routes
Owner: AGENT

Primary files:
- `app/sitemap.ts`

Acceptance criteria:
- Sitemap lists only the valid bookkeeping service routes.
- No marketing-only service routes remain.

### TT-062 (P1) — Update RSS feed description
Owner: AGENT

Primary files:
- `app/feed.xml/route.ts`

Acceptance criteria:
- Channel description updated to bookkeeping.

---

### TT-070 (P1) — Update env examples and defaults for new site identity
Owner: AGENT + Trevor (D-003)

Primary files:
- `env.example`
- `.env.example`
- `lib/env.ts`
- `lib/env.public.ts`

Acceptance criteria:
- Defaults and docs no longer mention `yourdedicatedmarketer.com` or marketing.
- `NEXT_PUBLIC_SITE_NAME` default updated.
- `CONTACT_EMAIL` default updated.

---

### TT-080 (P1) — Rewrite or replace blog content to bookkeeping
Owner: Trevor (content) + AGENT (implementation)

Primary files:
- `content/blog/*.mdx`
- `app/blog/*`

Acceptance criteria:
- Blog post topics are bookkeeping/accounting oriented.
- Category taxonomy updated (currently includes `SEO`, `Marketing`, etc.).
- If you choose to pause blog: remove from nav + sitemap + search until ready.

---

### TT-090 (P1) — Update tests to match new copy/routes
Owner: AGENT

Primary files:
- `__tests__/components/MarketingSections.test.tsx`
- `__tests__/components/pages/pages.test.tsx`
- Any other snapshot/text assertions discovered during test run

Acceptance criteria:
- Tests assert bookkeeping-facing headings and CTAs.
- Tests still validate key UX structure (hero renders, services section renders, etc.).

---

### TT-100 (P2) — Documentation sweep: replace “Marketer” positioning
Owner: AGENT

Primary files (non-exhaustive; many docs reference Marketer):
- `README.md`
- `DECISIONS.md`
- `docs/DEPLOYMENT.md`
- `docs/start-here/README.md`
- `docs/product/SERVICES.md`
- `docs/product/CONTENT-STRATEGY.md`
- `docs/architecture/ARCHITECTURE.md`

Acceptance criteria:
- Documentation describes “Your Dedicated Bookkeeper”.
- Any domain/email examples updated to new values.
- If a doc can’t be updated without decisions, mark sections as **UNKNOWN** and create follow-up tasks.

---

## Sanity checklist (run after implementation)
Owner: AGENT

- `npm test` (or the repo’s standard verification command set per `repo.manifest.yaml` — **UNKNOWN** not yet checked here)
- Search:
  - Search dialog returns service pages and bookkeeping tags.
- SEO:
  - Verify metadata title template renders correctly across /, /services, /pricing, /contact.
- PWA:
  - Manifest name/short_name correct; install prompt copy isn’t marketing-specific.

---

## Quick inventory of marketing-specific hotspots (for conversion)
(Non-exhaustive; starting points found during analysis)
- Brand + metadata: `app/layout.tsx`, `app/api/og/route.tsx`
- Services: `app/services/**`, `components/ServicesOverview.tsx`, `components/Footer.tsx`, `lib/search.ts`, `app/sitemap.ts`
- Copy: `components/Hero.tsx`, `components/ValueProps.tsx`, `components/FinalCTA.tsx`, `components/SocialProof.tsx`, `components/CaseStudyHighlight.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `app/pricing/page.tsx`
- PWA/assets: `public/manifest.json`, `public/logo.svg`, `public/og-image.svg`
- Forms: `components/ContactForm.tsx`, `lib/contact-form-schema.ts`, `lib/actions.ts`
- Tests: `__tests__/components/MarketingSections.test.tsx`, `__tests__/components/pages/pages.test.tsx`
