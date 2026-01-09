# Architecture Decision Records

This document tracks significant architectural decisions for the Your Dedicated Marketer marketing site.

## Format

Each decision follows this structure:
- **Status**: Proposed, Accepted, Deprecated, or Superseded
- **Date**: When the decision was made
- **Context**: The situation requiring a decision
- **Decision**: What was decided
- **Consequences**: Results of the decision

---

## ADR-001: Use Next.js 14 App Router for Static Site

**Status**: Accepted  
**Date**: 2024-12-26

### Context
Need modern framework for marketing site with excellent performance, SEO, and developer experience. Options include Next.js, Astro, Remix, or plain React with Vite.

### Decision
Use Next.js 14 with App Router and static site generation.

### Alternatives Considered
1. **Astro**: Great for content sites but less flexible for interactive components
2. **Remix**: Excellent framework but overkill for static marketing site
3. **Vite + React**: More manual setup, less optimized for static generation

### Consequences

#### Positive
- Excellent performance with static generation
- Built-in image optimization
- Great SEO support
- Large ecosystem and community
- Easy deployment to Cloudflare Pages

#### Negative
- Larger framework than necessary for simple site
- App Router still evolving
- Some third-party libraries not optimized for App Router yet

### Implementation Notes
Use static generation for all pages, Server Actions for contact form.

---

## ADR-002: Deploy to Cloudflare Pages

**Status**: Accepted  
**Date**: 2024-12-26

### Context
Marketing site needs reliable hosting with global CDN, automatic HTTPS, and zero cost for startup phase.

### Decision
Deploy to Cloudflare Pages (free tier).

### Alternatives Considered
1. **Vercel**: Excellent Next.js integration but costs money at scale
2. **Netlify**: Similar to Cloudflare but slightly worse performance
3. **GitHub Pages**: Free but less features and slower

### Consequences

#### Positive
- Free hosting with unlimited bandwidth
- Global CDN with excellent performance
- Automatic HTTPS
- Git-based deployments
- Preview deployments for PRs

#### Negative
- Vendor lock-in (but static site is portable)
- Build time limits on free tier
- Limited to static sites

### Implementation Notes
Use GitHub integration for automatic deployments on push to main.

---

## ADR-003: Use Tailwind CSS for Styling

**Status**: Accepted  
**Date**: 2024-12-26

### Context
Need efficient, maintainable styling solution for marketing site with responsive design.

### Decision
Use Tailwind CSS with custom configuration.

### Alternatives Considered
1. **CSS Modules**: More verbose, harder to maintain consistency
2. **Styled Components**: Runtime overhead, larger bundle size
3. **Vanilla CSS**: Too much manual work for responsive design

### Consequences

#### Positive
- Rapid development with utility classes
- Small production bundle (unused classes purged)
- Consistent design system
- Excellent responsive design utilities
- No runtime overhead

#### Negative
- HTML can look cluttered with many classes
- Learning curve for team members unfamiliar with utility-first CSS
- Requires build step for optimization

### Implementation Notes
Use custom theme extending Tailwind defaults for brand colors and spacing.

---

## ADR-004: Use Dual MDX Approach for Content

**Status**: Accepted  
**Date**: 2026-01-03 (Documented)

### Context
The site needs to process MDX content in two different ways:
1. Static MDX pages that are part of the app structure (compiled at build time)
2. Dynamic blog content stored in `/content` directory (processed at runtime)

### Decision
Use both @next/mdx and next-mdx-remote in parallel for their respective use cases.

### Alternatives Considered
1. **Only @next/mdx**: Would require all content to be in app directory, limiting content management flexibility
2. **Only next-mdx-remote**: Would work but less performant for static pages that could be compiled at build time
3. **Custom MDX processing**: More control but requires significant maintenance overhead

### Consequences

#### Positive
- Optimal performance: build-time compilation for static pages
- Content flexibility: runtime processing for dynamic blog posts
- Best of both worlds: each tool used for its strengths
- Standard tooling: both are official/well-maintained solutions

#### Negative
- Two MDX dependencies to maintain
- Slightly larger bundle size
- Need to remember which approach to use for different content types

### Implementation Notes
- @next/mdx configured in next.config.mjs for app-level MDX files
- next-mdx-remote used in blog/[slug]/page.tsx for dynamic content
- Both share the same rehype/remark plugins for consistency

---

## ADR-005: Use clsx + tailwind-merge Utility Pattern

**Status**: Accepted  
**Date**: 2026-01-03 (Documented)

### Context
Need utility for managing conditional CSS classes and handling Tailwind CSS class conflicts.

### Decision
Implement `cn()` utility function combining clsx and tailwind-merge.

### Alternatives Considered
1. **Only clsx**: Handles conditionals but doesn't resolve Tailwind conflicts
2. **Only tailwind-merge**: Resolves conflicts but less elegant conditional syntax
3. **Custom implementation**: Reinventing the wheel

### Consequences

#### Positive
- Clean conditional class syntax from clsx
- Automatic Tailwind class conflict resolution from tailwind-merge
- Industry-standard pattern used across many projects
- Small bundle size for both libraries

#### Negative
- Two dependencies instead of one
- Developers need to understand both libraries

### Implementation Notes
Defined in lib/utils.ts as `cn()` helper function. Used throughout components for className management.

---

## ADR-006: CSRF Protection via Next.js Server Actions

**Status**: Accepted  
**Date**: 2026-01-03

### Context
Contact form and future forms need CSRF (Cross-Site Request Forgery) protection to prevent unauthorized form submissions from malicious sites. Traditional approaches use explicit CSRF tokens, but Next.js Server Actions provide built-in protection.

### Decision
Rely on Next.js Server Actions built-in CSRF protection instead of implementing explicit token validation.

### Alternatives Considered
1. **Explicit CSRF tokens (double-submit cookie)**: More complex, requires token generation/validation, state management
2. **CSRF middleware library**: Additional dependency, not needed with Server Actions
3. **Custom token implementation**: Reinventing framework capabilities

### Consequences

#### Positive
- Zero implementation effort - built into Next.js
- Framework automatically validates Origin/Referer headers
- No token state to manage
- Works seamlessly with Server Actions pattern
- Reduces attack surface (no token to leak)

#### Negative
- Less explicit/visible than token-based approaches
- Depends on framework implementation (vendor lock-in)
- May need explicit tokens if adding traditional API routes
- Some security auditors may prefer visible token validation

### Implementation Notes
- Contact form uses Server Actions in `lib/actions.ts`
- Next.js validates Origin header on all POST requests to Server Actions
- SameSite cookie policy (Lax) provides additional protection
- Security headers enforced via `middleware.ts`

### Future Considerations
If we add traditional API routes (not Server Actions), we should:
1. Implement explicit CSRF tokens for those endpoints
2. Consider using a library like `csrf-csrf` or `edge-csrf`
3. Document the dual approach (Server Actions vs API routes)

**References:**
- Implementation: `lib/actions.ts`
- Security headers: `middleware.ts`
- Documentation: `SECURITY.md` (CSRF Protection section)

---

## ADR-007: In-Memory Rate Limiting for MVP

**Status**: Accepted (with planned migration)  
**Date**: 2026-01-03

### Context
Contact form needs rate limiting to prevent spam and abuse. Options include in-memory, database-backed, or third-party services. For MVP launch with low traffic, need simple solution that can scale later.

### Decision
Implement in-memory rate limiting for MVP, with documented migration path to persistent storage for production.

### Alternatives Considered
1. **Upstash Redis**: Excellent for serverless, but adds cost and complexity for MVP
2. **Vercel KV**: Great edge support, but requires Vercel deployment
3. **Arcjet**: Purpose-built rate limiting, but adds monthly cost
4. **Database-backed**: Requires database queries for every form submission
5. **No rate limiting**: Leaves form vulnerable to spam and abuse

### Consequences

#### Positive
- Simple implementation: native JavaScript Map
- No external dependencies
- Zero cost
- No database queries
- Fast lookups (O(1))
- Sufficient for MVP with single instance
- Easy to test locally

#### Negative
- ⚠️ **Does not persist across restarts** (acceptable for MVP)
- ⚠️ **Does not work across multiple instances** (serverless problem)
- ⚠️ **Memory usage grows unbounded** without cleanup
- Only limits by email, not by IP
- Can be bypassed by using different email addresses

### Implementation Notes

Current implementation:
```typescript
// lib/actions.ts
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
// Limit: 3 submissions per hour per email
```

Cleanup strategy:
- Expired entries removed on next access
- Map remains in memory (acceptable for low traffic)

### Migration Path

For production at scale (tracked in T-016):

**Phase 1: Choose Solution**
- **Upstash Redis**: Best for serverless/edge
- **Vercel KV**: If deploying to Vercel
- **Arcjet**: If need advanced bot protection

**Phase 2: Implementation**
1. Install chosen rate limiting SDK
2. Update `lib/actions.ts` to use external service
3. Add environment variables for service credentials
4. Add IP-based rate limiting (in addition to email)
5. Test across multiple instances

**Phase 3: Monitoring**
- Track rate limit hits
- Alert on suspicious patterns
- Adjust limits based on legitimate traffic

### Acceptance Criteria for Production

Before high-traffic launch, rate limiting must:
- [ ] Persist across server restarts
- [ ] Work across multiple serverless instances
- [ ] Include IP-based limiting
- [ ] Have monitoring and alerting
- [ ] Be documented in deployment docs

**References:**
- Implementation: `lib/actions.ts` lines 21-48
- Documentation: `SECURITY.md` (Rate Limiting section)
- Migration task: `TODO.md` - T-016
- Production planning: `TODO.md` - T-007

---

## ADR-008: Remove Deprecated next-pwa Package

**Status**: Accepted  
**Date**: 2026-01-03

### Context
The project was using `next-pwa@5.6.0` to automatically generate service workers for Progressive Web App functionality. However, next-pwa is no longer actively maintained (last update 2022) and may have compatibility issues with Next.js 14.

The project has PWA features including:
- Web app manifest (`public/manifest.json`)
- PWA icons (192x192, 512x512, apple-touch-icon)
- Custom install prompt component (`components/InstallPrompt.tsx`)

Need to decide: migrate to maintained fork, implement custom service worker, or remove automated service worker generation.

### Decision
Remove next-pwa package while keeping basic PWA features (manifest, icons, install prompt).

**Rationale:**
1. Marketing site doesn't require offline functionality
2. Service worker caching adds complexity and potential bugs
3. Manifest and install prompt work without next-pwa
4. Reduces bundle size and build complexity
5. Removes dependency on unmaintained package

### Alternatives Considered

1. **Migrate to @ducanh2912/next-pwa (maintained fork)**
   - Pros: Keeps service worker, actively maintained
   - Cons: Adds dependency, complexity, and we don't need offline caching

2. **Custom service worker implementation**
   - Pros: Full control
   - Cons: Maintenance burden, potential bugs, not needed for our use case

3. **Remove all PWA features**
   - Pros: Simplest approach
   - Cons: Loses ability to install as app, which some users may want

### Consequences

#### Positive
- ✅ No unmaintained dependencies
- ✅ Simpler build configuration
- ✅ Reduced bundle size
- ✅ Less complexity in caching strategy
- ✅ Faster builds (no service worker generation)
- ✅ Keep install-to-home-screen functionality

#### Negative
- ❌ No offline functionality (acceptable for marketing site)
- ❌ No automatic caching of assets (CDN handles this)
- ❌ No background sync (not needed)

### Implementation Notes

**Removed:**
- `next-pwa` package from devDependencies
- `withPWA()` wrapper from next.config.mjs
- Service worker configuration (runtime caching rules)

**Kept:**
- `public/manifest.json` - Web app manifest
- PWA icons (icon-192.png, icon-512.png, apple-touch-icon.png)
- `components/InstallPrompt.tsx` - Custom install prompt
- Manifest link in app/layout.tsx

**What Still Works:**
- Users can install the app to their home screen
- App appears in standalone mode when launched from home screen
- Custom branding and shortcuts defined in manifest
- Install prompt appears on supported browsers

### Future Considerations

If offline functionality becomes important:
1. Evaluate @ducanh2912/next-pwa (maintained fork)
2. Consider Workbox for more control
3. Implement incremental caching for specific routes only

For now, the basic installable PWA is sufficient for our marketing use case.

**References:**
- Removed package: `next-pwa@5.6.0`
- Config: `next.config.mjs`
- Manifest: `public/manifest.json`
- Install prompt: `components/InstallPrompt.tsx`
- PWA icons guide: `docs/PWA-ICONS.md`

---

## ADR-009: Sanitize PII in Sentry Events

**Status**: Accepted  
**Date**: 2026-01-04

### Context
Sentry is configured for error tracking, but beforeSend hooks were not removing PII such as emails, phone numbers, or contact form fields. This risks leaking sensitive data into error contexts.

### Decision
Add a shared sanitization helper that redacts email addresses, phone numbers, and common contact form fields from Sentry events before they are sent.

### Alternatives Considered
1. **Rely on Sentry masking only**: Session replay masking does not cover error payloads.
2. **Manual redaction per event**: Risky and inconsistent across the codebase.
3. **Disable sending extra context**: Reduces debugging effectiveness too much.

### Consequences

#### Positive
- ✅ Reduces chance of PII leakage in error payloads
- ✅ Consistent sanitization across client and server events
- ✅ Keeps useful metadata while masking sensitive fields

#### Negative
- ❌ Slight overhead from recursive sanitization
- ❌ Potential redaction of benign strings that look like phone numbers

### Implementation Notes
- Added `lib/sentry-sanitize.ts` to redact email/phone patterns and common form keys.
- Applied `sanitizeSentryEvent()` in both `sentry.client.config.ts` and `sentry.server.config.ts` beforeSend hooks.
- Fields redacted by key include: name, email, phone, company, message, formData.

---

## Template for New ADRs

```markdown
## ADR-XXX: Title

**Status**: Proposed  
**Date**: YYYY-MM-DD

### Context
Problem statement and constraints

### Decision
What we're doing

### Alternatives Considered
1. Option with rejection rationale

### Consequences

#### Positive
- Benefits

#### Negative
- Trade-offs

### Implementation Notes
Technical details
```

---

## Index of Decisions

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| 001 | Use Next.js 14 App Router | Accepted | 2024-12-26 |
| 002 | Deploy to Cloudflare Pages | Accepted | 2024-12-26 |
| 003 | Use Tailwind CSS | Accepted | 2024-12-26 |
| 004 | Use Dual MDX Approach | Accepted | 2026-01-03 |
| 005 | Use clsx + tailwind-merge Utility | Accepted | 2026-01-03 |
| 006 | CSRF Protection via Next.js Server Actions | Accepted | 2026-01-03 |
| 007 | In-Memory Rate Limiting for MVP | Accepted | 2026-01-03 |
| 008 | Remove Deprecated next-pwa Package | Accepted | 2026-01-03 |
| 009 | Sanitize PII in Sentry Events | Accepted | 2026-01-04 |
