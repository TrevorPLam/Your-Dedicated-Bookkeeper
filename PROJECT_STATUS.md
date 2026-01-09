# PROJECT_STATUS.md — Working Status & Decisions

Document Type: Operations
Canonical Status: Canonical
Owner: Trevor
Audience: Humans + agents
Last Updated: 2026-01-08

## Purpose
A lightweight place to record the current state of the project, major decisions, and open questions.
This is not a task list; tasks belong in `TODO.md`.

## Current snapshot
- Phase: Phase 0 Complete / Ready for Phase 1 (Lead Capture)
- Environment: Next.js 15.5.2 (Downgraded from 16), Cloudflare Pages Adapter Installed.
- Last known “green” state (commit/tag): T-052 completion (Pages build passes locally).
- Key risks: 
    - Next.js 15.x lock-in: `@cloudflare/next-on-pages` has peer dependency conflicts with Next.js 16.
    - Edge Runtime limitations: `fs` usage required explicitly marking some routes as `force-static`.
- Testing posture: Added E2E coverage for contact submission success, rate limiting, and search empty state; configured Vitest coverage thresholds.

## Decisions (append-only)
Use this format:

- Date: 2026-01-07
  - Decision: Downgrade to Next.js 15.5.2 and ESLint 9.
  - Why: `@cloudflare/next-on-pages` adapter did not strictly support Next.js 16, causing peer dependency install failures and runtime build issues.
  - Alternatives considered: Forcing peer deps (failed at runtime), Custom build adapter (too high effort).
  - Trade-offs: Cannot use Next.js 16 features until Cloudflare adapter updates.
  - Follow-up (task IDs in TODO.md): None immediately, but monitor Cloudflare updates.

- Date: 2026-01-07
  - Decision: Use manual `archive/eslint.config.mjs` style configuration.
  - Why: The `next lint` CLI command was broken in the mixed version environment (Next 15 + new ESLint).
  - Alternatives considered: Fixing `next lint`.
  - Trade-offs: Usage of `eslint .` instead of `next lint` in scripts.

- Date: 2026-01-07
  - Decision: Mark `feed.xml` and `search` routes as `dynamic = 'force-static'`.
  - Why: They use `fs` (via `lib/blog.ts`) which is not available in the Cloudflare Edge Runtime unless pre-rendered at build time.
  - Follow-up (task IDs in TODO.md): N/A

## Open questions
- Q: What is the canonical short brand used in UI/PWA?
  - Context: Navigation/footer and PWA assets currently say “YD Marketer” / “YDM”.
  - Needed input: Short display name + PWA short_name + Apple web app title.
  - Task (BLOCKED) ID: T-083

- Q: What bookkeeping services should exist and what are the slugs?
  - Context: Existing `/services/*` routes are marketing-specific and drive sitemap/search/nav.
  - Needed input: Service list + slugs + short copy spec + whether to redirect old routes.
  - Task (BLOCKED) ID: T-084

- Q: What is the production domain/email and do we have social profiles?
  - Context: SEO structured data and docs include `yourdedicatedmarketer.com` and `contact@yourdedicatedmarketer.com`.
  - Needed input: `NEXT_PUBLIC_SITE_URL`, `CONTACT_EMAIL`, and social URLs (or “none”).
  - Task (BLOCKED) ID: T-085

- Q: Keep or hide Blog/Case Studies during the bookkeeping transition?
  - Context: Current content is marketing-focused; nav/sitemap/search should match strategy.
  - Needed input: Decision + initial bookkeeping topics/case studies or placeholder policy.
  - Task (BLOCKED) ID: T-086
