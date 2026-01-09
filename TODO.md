# TODO.md — Repository Task List

Document Type: Workflow
Last Updated: 2026-01-09
Task Truth Source: **TODO.md**

This file is the single source of truth for actionable work. If another document disagrees, the task record in this file wins (unless the Constitution overrides).

## Goals (from chat)
- Site: High-performance marketing site for “Your Dedicated Marketer”
- Hosting: Cloudflare Pages (GitHub integration)
- Standard: Diamond Standard (performance, accessibility, observability, testing)
- Keep: Sentry, PWA, Search
- Contact flow: Store lead in Supabase (server-only) + sync to HubSpot CRM
	- No email sending
	- Save suspicious submissions but flag them (suspicious = too many requests)
	- Required fields: Name, Email, Phone
	- UX: Return success even if HubSpot sync fails (best-effort)

## Task Schema (Required)
- **ID**: `T-###` (unique, sequential)
- **Priority**: `P0 | P1 | P2 | P3`
- **Type**: `SECURITY | RELEASE | DEPENDENCY | DOCS | QUALITY | BUG | FEATURE | CHORE`
- **Owner**: `AGENT | Trevor`
- **Status**: `READY | BLOCKED | IN-PROGRESS | IN-REVIEW | DONE`
- **Blockers**: `None` or a short description of what prevents progress
- **Context**: why the task exists (1–5 bullets)
- **Acceptance Criteria**: verifiable checklist (broken into subtasks T-###.#)
- **References**: file paths and/or links inside this repo
- **Dependencies**: task IDs (if any)
- **Effort**: `XS | S | M | L | XL` (XS = < 30 min, S = < 2 hr, M = < 4 hr, L = < 1 day, XL = > 1 day)

### Priority Meaning
- **P0**: BLOCKS BUILD or causes security/data loss — fix immediately
- **P1**: High impact; do within 7 days
- **P2**: Important but not urgent; do within 30 days
- **P3**: Backlog/tech debt; do when convenient

### Ownership Rule
- **Owner: AGENT** — task can be executed by Codex/Claude Code/Copilot in-repo
- **Owner: Trevor** — requires external actions (provider dashboards, DNS, billing, approvals)

---

## 🔴 PHASE 0: Build & Security Blockers (P0)
> These MUST be fixed before feature work.

---

## 🟠 PHASE 1: Lead Capture Pipeline (Supabase + HubSpot) (P1)
> Replace email delivery with DB + CRM while preserving spam controls.

### T-054: Provision Supabase project + provide server credentials
Priority: P1
Type: RELEASE
Owner: Trevor
Status: READY
Blockers: None
Context:
- Supabase will store leads (server-only access)
- Requires Supabase project + keys configured in Cloudflare Pages environment variables
Acceptance Criteria:
- [ ] T-054.1: Create Supabase project
- [ ] T-054.2: Provide `SUPABASE_URL`
- [ ] T-054.3: Provide `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- [ ] T-054.4: Create `leads` table (or approve SQL migration plan)
References:
- /env.example
- /docs/DEPLOYMENT.md
Dependencies: None
Effort: S

### T-055: Provision HubSpot private app token + field mapping
Priority: P1
Type: RELEASE
Owner: Trevor
Status: READY
Blockers: None
Context:
- HubSpot is the CRM target; contact records should be created/updated on submission
- Requires a private app token stored as a Cloudflare Pages server-only env var
Acceptance Criteria:
- [ ] T-055.1: Create HubSpot private app
- [ ] T-055.2: Provide `HUBSPOT_PRIVATE_APP_TOKEN` (server-only)
- [ ] T-055.3: Confirm mapping for required fields: Name, Email, Phone
References:
- /docs/DEPLOYMENT.md
- /env.example
Dependencies: None
Effort: XS

### T-080: Store leads in Supabase with suspicion metadata
Priority: P1
Type: FEATURE
Owner: AGENT
Status: BLOCKED
Blockers: Supabase project/table + credentials needed (T-054).
Context:
- Replace email delivery with Supabase lead storage
- Must preserve current UX contract in `submitContactForm`
- Save suspicious submissions but flag them for later review
Acceptance Criteria:
- [ ] T-080.1: Insert lead into Supabase with `is_suspicious` + `suspicion_reason`
- [ ] T-080.2: Store submission metadata needed for downstream HubSpot sync
- [ ] T-080.3: Preserve current `submitContactForm` success/error UX contract
References:
- /lib/actions.ts
- /lib/env.ts
- /docs/DEPLOYMENT.md
Dependencies: T-054, T-079
Effort: M

### T-081: Sync leads to HubSpot and record sync status
Priority: P1
Type: FEATURE
Owner: AGENT
Status: BLOCKED
Blockers: HubSpot token required (T-055) and Supabase storage (T-080).
Context:
- Lead submissions should upsert into HubSpot CRM by email
- HubSpot failures must not break UX; retry should be possible
Acceptance Criteria:
- [ ] T-081.1: Upsert HubSpot contact by email and store HubSpot IDs in Supabase
- [ ] T-081.2: If HubSpot fails, return success and mark lead `hubspot_sync_status = 'needs_sync'`
- [ ] T-081.3: Store HubSpot sync attempt metadata for observability
References:
- /lib/actions.ts
- /lib/env.ts
Dependencies: T-055, T-080
Effort: M

### T-082: Remove email pipeline and add tests for new lead flow
Priority: P1
Type: FEATURE
Owner: AGENT
Status: BLOCKED
Blockers: Supabase + HubSpot flow required first (T-080, T-081).
Context:
- Email sending is no longer part of the contact pipeline
- New flow needs tests for suspicious handling + HubSpot failure behavior
Acceptance Criteria:
- [ ] T-082.1: Remove email-send behavior from `lib/actions.ts`
- [ ] T-082.2: Remove unused Resend config/deps
- [ ] T-082.3: Add unit test(s) for: rate-limit flagged lead saved; HubSpot failure still returns success
References:
- /lib/actions.ts
- /__tests__/lib/actions.rate-limit.test.ts
- /package.json
Dependencies: T-080, T-081
Effort: S

---

## 🟡 PHASE 2: Diamond Standard Quality (P2)
> Accessibility, performance, observability, and testing.

### T-058: Performance baselines + budgets (Lighthouse)
Priority: P2
Type: QUALITY
Owner: AGENT
Status: BLOCKED
Blockers: Lighthouse CLI not installed (install globally or set `LIGHTHOUSE_BIN`).
Context:
- Diamond Standard requires strong Core Web Vitals
- Need baseline measurements before setting strict budgets
Acceptance Criteria:
- [x] T-058.1: Add a local Lighthouse config and script
- [ ] T-058.2: Capture baseline metrics for mobile (home/services/pricing/contact)
- [x] T-058.3: Define budgets as regression guards (not arbitrary hard fails)
- [x] T-058.4: Document targets in `/docs/OBSERVABILITY.md`
References:
- /docs/OBSERVABILITY.md
- /package.json
Dependencies: None
Effort: M

### T-064: Analytics provider selection and rollout
Priority: P2
Type: QUALITY
Owner: Trevor
Status: READY
Blockers: None
Context:
- Diamond Standard marketing site should have conversion tracking
- Provider choice required (GA4/Plausible/etc.)
Acceptance Criteria:
- [ ] T-064.1: Choose analytics provider
- [ ] T-064.2: Provide `NEXT_PUBLIC_ANALYTICS_ID` (if needed)
- [ ] T-064.3: Confirm which events/conversions to track (contact submit, CTA clicks)
References:
- /lib/analytics.ts
- /lib/env.ts
Dependencies: None
Effort: XS

### T-070: Monitor and fix transitive build-tool vulnerabilities
Priority: P2
Type: DEPENDENCY
Owner: AGENT
Status: BLOCKED
Blockers: Await upstream fixes in `@cloudflare/next-on-pages` or Cloudflare runtime updates.
Context:
- npm audit reports High/Moderate issues in `path-to-regexp`, `esbuild`, `undici`.
- These are pulled in by `@cloudflare/next-on-pages`.
- Currently on latest adapter version (1.13.16).
Acceptance Criteria:
- [ ] T-070.1: Check for updates to `@cloudflare/next-on-pages`
- [ ] T-070.2: Attempt `npm update` of transitive deps if possible
References:
- /package.json
Dependencies: None
Effort: S

### T-072: Create missing legal pages (privacy, terms)
Priority: P2
Type: FEATURE
Owner: Trevor
Status: READY
Blockers: None
Context:
- Footer links to /privacy and /terms pages that don't exist
- Required for legal compliance and user trust
- Alternatively, remove links until content is ready
Acceptance Criteria:
- [ ] T-072.1: Decide: create pages or remove links
- [ ] T-072.2: If creating: provide privacy policy content
- [ ] T-072.3: If creating: provide terms of service content
- [ ] T-072.4: Create app/privacy/page.tsx and app/terms/page.tsx (if proceeding)
References:
- /components/Footer.tsx
- /app/
Dependencies: None
Effort: M

## 🟦 PHASE 3: Enhancements (P3)
> Nice-to-have improvements for Diamond Standard.

### T-075: Add case studies to search index
Priority: P3
Type: FEATURE
Owner: AGENT
Status: READY
Blockers: None
Context:
- Search includes blog posts and static pages but not case studies
- Easy enhancement to improve site search
Acceptance Criteria:
- [ ] T-075.1: Import caseStudies from lib/case-studies.ts
- [ ] T-075.2: Map case studies to SearchItem format
- [ ] T-075.3: Include in getSearchIndex() return
References:
- /lib/search.ts
- /lib/case-studies.ts
Dependencies: None
Effort: XS

### T-077: Add focus trap to mobile navigation menu
Priority: P3
Type: QUALITY
Owner: AGENT
Status: READY
Blockers: None
Context:
- Mobile menu doesn't trap focus (accessibility gap)
- Users can tab to elements behind the menu overlay
Acceptance Criteria:
- [ ] T-077.1: Implement focus trap when mobile menu is open
- [ ] T-077.2: Focus first focusable element when menu opens
- [ ] T-077.3: Return focus to hamburger button when menu closes
References:
- /components/Navigation.tsx
Dependencies: None
Effort: S

### T-078: Delete backup and unused files
Priority: P3
Type: CHORE
Owner: AGENT
Status: READY
Blockers: None
Context:
- eslint.config.mjs.bak is a backup file from ESLint migration
- Clean up to reduce repo clutter
Acceptance Criteria:
- [ ] T-078.1: Delete eslint.config.mjs.bak
- [ ] T-078.2: Verify pre-commit-config.yaml is in use or delete it
References:
- /eslint.config.mjs.bak
- /pre-commit-config.yaml
Dependencies: None
Effort: XS

---

## 🟣 PHASE 4: Industry Transition — “Your Dedicated Bookkeeper” (P1/P2)
> Shift positioning from marketing → bookkeeping while keeping the existing design system (colors, fonts, components).

References:
- /TRANSITIONTODO.md

### T-083: Confirm canonical brand names and abbreviations
Priority: P1
Type: DOCS
Owner: Trevor
Status: READY
Blockers: None
Context:
- Many UI/SEO/PWA surfaces use a short brand string (currently “YDM” / “YD Marketer”)
- Implementation must not guess the short name used in navigation, footer, icons, and app title
Acceptance Criteria:
- [ ] T-083.1: Confirm long name: “Your Dedicated Bookkeeper” (or provide exact casing)
- [ ] T-083.2: Confirm short name for UI (e.g., “YD Bookkeeper” / “YDB”)
- [ ] T-083.3: Confirm PWA short_name and Apple web app title values
References:
- /app/layout.tsx
- /public/manifest.json
- /public/logo.svg
Dependencies: None
Effort: XS

### T-084: Define bookkeeping service list, slugs, and copy spec
Priority: P1
Type: DOCS
Owner: Trevor
Status: READY
Blockers: None
Context:
- Current routes and copy are for marketing services (SEO/content/social/email/etc.)
- We need a bookkeeping service IA before changing routes, sitemap, and search
Acceptance Criteria:
- [ ] T-084.1: Provide services table: name, slug, one-line value prop
- [ ] T-084.2: Provide 3–6 “included” bullet items per service (used on service pages)
- [ ] T-084.3: Confirm whether any legacy marketing service routes should redirect or be removed
References:
- /app/services/
- /app/sitemap.ts
- /lib/search.ts
Dependencies: None
Effort: XS

### T-085: Provide domain, contact email, and social links/handles
Priority: P1
Type: RELEASE
Owner: Trevor
Status: READY
Blockers: None
Context:
- Domain/email/social are currently hardcoded in multiple files and docs
- We need correct canonical URLs for SEO schemas and RSS
Acceptance Criteria:
- [ ] T-085.1: Provide NEXT_PUBLIC_SITE_URL (production)
- [ ] T-085.2: Provide CONTACT_EMAIL (production)
- [ ] T-085.3: Provide social profile URLs (or explicitly “none”)
References:
- /env.example
- /app/layout.tsx
- /app/feed.xml/route.ts
Dependencies: None
Effort: XS

### T-086: Decide whether to keep or rewrite Blog and Case Studies
Priority: P1
Type: DOCS
Owner: Trevor
Status: READY
Blockers: None
Context:
- Current blog posts and case studies are marketing-topic oriented
- Navigation, sitemap, and search depend on whether these remain visible
Acceptance Criteria:
- [ ] T-086.1: Choose: rewrite now, hide until ready, or remove
- [ ] T-086.2: If keeping: confirm initial bookkeeping topics and/or placeholder policy
References:
- /content/blog/
- /app/blog/
- /app/case-studies/
Dependencies: None
Effort: XS

---

### T-087: Update global metadata + structured data for bookkeeping brand
Priority: P1
Type: FEATURE
Owner: AGENT
Status: BLOCKED
Blockers: Needs confirmed brand/domain inputs (T-083, T-085)
Context:
- Site-wide SEO metadata and schema.org data currently describe a marketing company
- Must reflect bookkeeping services without changing the design system
Acceptance Criteria:
- [ ] T-087.1: Update default title/template, description, keywords to bookkeeping
- [ ] T-087.2: Update Organization + WebSite structured data (name/email/social)
- [ ] T-087.3: Update OG URL query default title
References:
- /app/layout.tsx
- /app/api/og/route.tsx
Dependencies: T-083, T-085
Effort: S

### T-088: Update PWA manifest + brand SVG text
Priority: P1
Type: FEATURE
Owner: AGENT
Status: BLOCKED
Blockers: Needs canonical brand short name (T-083)
Context:
- PWA manifest and SVG assets still say “Your Dedicated Marketer”
Acceptance Criteria:
- [ ] T-088.1: Update PWA `name`, `short_name`, `description`, and categories for bookkeeping
- [ ] T-088.2: Update PWA shortcuts descriptions to bookkeeping
- [ ] T-088.3: Update SVG text labels from MARKETER → BOOKKEEPER (or chosen short mark)
References:
- /public/manifest.json
- /public/logo.svg
- /public/og-image.svg
- /app/layout.tsx
Dependencies: T-083
Effort: S

### T-089: Update navigation/footer branding and service links
Priority: P1
Type: FEATURE
Owner: AGENT
Status: BLOCKED
Blockers: Needs brand short name + service list (T-083, T-084)
Context:
- Navigation and footer currently render “YD Marketer” and marketing service links
Acceptance Criteria:
- [ ] T-089.1: Replace “YD Marketer” label with approved short brand
- [ ] T-089.2: Update footer Services links to the new bookkeeping services
- [ ] T-089.3: Ensure nav links still match sitemap + search
References:
- /components/Navigation.tsx
- /components/Footer.tsx
Dependencies: T-083, T-084
Effort: XS

### T-090: Replace marketing service IA with bookkeeping service pages
Priority: P1
Type: FEATURE
Owner: AGENT
Status: BLOCKED
Blockers: Needs service list/slugs/copy spec (T-084)
Context:
- `app/services/*` and services overview are marketing-specific
- Must be updated end-to-end: routes, copy, internal links, sitemap, and search
Acceptance Criteria:
- [ ] T-090.1: Update /services landing page cards to bookkeeping services
- [ ] T-090.2: Replace existing marketing service routes with bookkeeping routes (per T-084)
- [ ] T-090.3: Remove or redirect any deprecated service routes (per T-084.3)
References:
- /app/services/page.tsx
- /app/services/
- /components/ServiceDetailLayout.tsx
Dependencies: T-084
Effort: L

### T-091: Update homepage copy to bookkeeping positioning
Priority: P1
Type: FEATURE
Owner: AGENT
Status: BLOCKED
Blockers: Needs service positioning inputs (T-084)
Context:
- Homepage hero/value props/services sections are marketing-specific
Acceptance Criteria:
- [ ] T-091.1: Update Hero headline/subhead and image alt text for bookkeeping
- [ ] T-091.2: Update ValueProps to bookkeeping outcomes (accuracy, clarity, month-end close, etc.)
- [ ] T-091.3: Update ServicesOverview headings/descriptions to match the new service list
- [ ] T-091.4: Update FinalCTA language to bookkeeping
References:
- /components/Hero.tsx
- /components/ValueProps.tsx
- /components/ServicesOverview.tsx
- /components/FinalCTA.tsx
Dependencies: T-084
Effort: M

### T-092: Update Pricing page to bookkeeping tiers and deliverables
Priority: P1
Type: FEATURE
Owner: AGENT
Status: BLOCKED
Blockers: Needs pricing/tier content from Trevor (provide in task comments)
Context:
- Current tiers are based on marketing deliverables (blog posts, SEO, social)
Acceptance Criteria:
- [ ] T-092.1: Replace tier names, features, and add-ons to bookkeeping equivalents
- [ ] T-092.2: Update FAQs to bookkeeping (payment methods can stay if accurate)
- [ ] T-092.3: Ensure structured FAQ data still validates
References:
- /app/pricing/page.tsx
Dependencies: T-084
Effort: M

### T-093: Update About + Contact pages to bookkeeping narrative
Priority: P1
Type: FEATURE
Owner: AGENT
Status: BLOCKED
Blockers: Needs brand/service inputs (T-083, T-084, T-085)
Context:
- About and Contact pages contain extensive marketing-agency narrative
Acceptance Criteria:
- [ ] T-093.1: Rewrite About page hero/story/values/approach to bookkeeping framing
- [ ] T-093.2: Update Contact page hero + “what happens next” steps for bookkeeping
- [ ] T-093.3: Replace hardcoded email with env-driven config
References:
- /app/about/page.tsx
- /app/contact/page.tsx
- /lib/env.ts
Dependencies: T-083, T-084, T-085
Effort: M

### T-094: Update ContactForm fields for bookkeeping intake
Priority: P1
Type: FEATURE
Owner: AGENT
Status: BLOCKED
Blockers: Needs confirmed intake fields (Trevor input; can be added to T-084)
Context:
- Form currently asks for “Current Monthly Marketing Spend” and marketing-oriented message prompt
Acceptance Criteria:
- [ ] T-094.1: Replace marketingSpend field with bookkeeping-relevant field(s)
- [ ] T-094.2: Update Zod schema, client form, and server action handling consistently
- [ ] T-094.3: Ensure spam protections (honeypot + rate limiting) still work
References:
- /components/ContactForm.tsx
- /lib/contact-form-schema.ts
- /lib/actions.ts
Dependencies: T-084
Effort: S

### T-095: Update testimonials + case studies to bookkeeping
Priority: P2
Type: FEATURE
Owner: AGENT
Status: BLOCKED
Blockers: Needs content strategy decision (T-086)
Context:
- Testimonials and case studies are marketing-specific, including metrics like lead gen and marketing ROI
Acceptance Criteria:
- [ ] T-095.1: Replace SocialProof testimonials and metrics with bookkeeping-appropriate content
- [ ] T-095.2: Replace case studies dataset and featured highlight copy for bookkeeping
References:
- /components/SocialProof.tsx
- /components/CaseStudyHighlight.tsx
- /lib/case-studies.ts
Dependencies: T-086
Effort: M

### T-096: Rewrite blog MDX content and taxonomy for bookkeeping (or hide blog)
Priority: P2
Type: DOCS
Owner: AGENT
Status: BLOCKED
Blockers: Needs decision on blog strategy (T-086)
Context:
- Existing blog topics and categories are marketing/SEO oriented
Acceptance Criteria:
- [ ] T-096.1: If keeping: replace marketing posts with bookkeeping posts (titles, descriptions, body)
- [ ] T-096.2: Update category taxonomy away from SEO/Marketing/etc.
- [ ] T-096.3: If hiding: remove blog from nav + search + sitemap until ready
References:
- /content/blog/
- /app/blog/page.tsx
- /lib/blog.ts
Dependencies: T-086
Effort: L

### T-097: Update search index, sitemap, and RSS copy to bookkeeping
Priority: P2
Type: QUALITY
Owner: AGENT
Status: BLOCKED
Blockers: Needs new service routes + blog decision (T-084, T-086)
Context:
- Search/staticPages, sitemap routes, and RSS description currently reference marketing content
Acceptance Criteria:
- [ ] T-097.1: Update `lib/search.ts` staticPages descriptions/tags and routes
- [ ] T-097.2: Update `app/sitemap.ts` to include only valid bookkeeping routes
- [ ] T-097.3: Update RSS channel description to bookkeeping
References:
- /lib/search.ts
- /app/sitemap.ts
- /app/feed.xml/route.ts
Dependencies: T-084, T-086
Effort: S

### T-098: Update env examples and env defaults to bookkeeping identity
Priority: P2
Type: CHORE
Owner: AGENT
Status: BLOCKED
Blockers: Needs domain/email inputs (T-085)
Context:
- `env.example`, `.env.example`, and env default values still reference yourdedicatedmarketer.com
Acceptance Criteria:
- [ ] T-098.1: Update example env files with new values
- [ ] T-098.2: Update default `NEXT_PUBLIC_SITE_NAME` and `CONTACT_EMAIL` in env schemas
References:
- /env.example
- /.env.example
- /lib/env.ts
- /lib/env.public.ts
Dependencies: T-085
Effort: XS

### T-099: Documentation sweep — remove “Marketer” and marketing-specific instructions
Priority: P2
Type: DOCS
Owner: AGENT
Status: BLOCKED
Blockers: Needs canonical brand/domain inputs (T-083, T-085)
Context:
- Multiple docs reference “Your Dedicated Marketer” and marketing positioning
- Must reflect bookkeeping site reality
Acceptance Criteria:
- [ ] T-099.1: Update README and onboarding docs to “Your Dedicated Bookkeeper”
- [ ] T-099.2: Update any domain/email examples to new values
- [ ] T-099.3: If any details cannot be verified, mark **UNKNOWN** and open follow-up tasks
References:
- /README.md
- /DECISIONS.md
- /docs/
Dependencies: T-083, T-085
Effort: M

### T-100: Update test expectations for bookkeeping copy/routes
Priority: P2
Type: QUALITY
Owner: AGENT
Status: BLOCKED
Blockers: Needs copy/route changes first (T-090, T-091, T-093, T-095)
Context:
- Several tests assert marketing copy and will fail after transition
Acceptance Criteria:
- [ ] T-100.1: Update marketing-specific assertions to bookkeeping equivalents
- [ ] T-100.2: Keep structural assertions (hero renders, CTAs exist, etc.)
References:
- /__tests__/components/MarketingSections.test.tsx
- /__tests__/components/pages/pages.test.tsx
Dependencies: T-090, T-091, T-093, T-095
Effort: S

### T-101: Optional — rename npm package/app identifiers to bookkeeper
Priority: P3
Type: CHORE
Owner: AGENT
Status: READY
Blockers: None
Context:
- `package.json` and `package-lock.json` currently use a marketer package name
- Not user-facing, but improves repo correctness
Acceptance Criteria:
- [ ] T-101.1: Update `package.json` name to `your-dedicated-bookkeeper` (or approved value)
- [ ] T-101.2: Update `package-lock.json` root package name accordingly
- [ ] T-101.3: Verify install/build still works locally
References:
- /package.json
- /package-lock.json
Dependencies: None
Effort: XS
