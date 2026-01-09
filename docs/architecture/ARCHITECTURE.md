# Architecture

> **Last Updated:** 2026-01-03  
> **Canonical Status:** Canonical  
> **Purpose:** High-level system architecture overview  
> **See Also:** [CODEBASE-ANALYSIS.md](./CODEBASE-ANALYSIS.md), [DOCS_INDEX.md](../DOCS_INDEX.md)

## System Overview
Your Dedicated Marketer is a static marketing website built with Next.js 14 and deployed to Cloudflare Pages. All pages are pre-rendered at build time for maximum performance. Contact form submissions are sent via Resend API.

## Infrastructure
**Deployment Model**: Static Site Generation (SSG)  
**Hosting**: Cloudflare Pages with global CDN  
**Scaling Strategy**: Automatic via Cloudflare CDN (no manual scaling needed)

## Components

### Marketing Pages
- **Purpose**: Public-facing website pages (home, services, about, contact)
- **Technology**: Next.js 14 App Router with static generation
- **Dependencies**: React 18, Tailwind CSS

### Blog System
- **Purpose**: Content marketing and SEO
- **Technology**: MDX files processed at build time
- **Dependencies**: next-mdx-remote or contentlayer

### Contact Form
- **Purpose**: Lead capture and client inquiries
- **Technology**: React Hook Form with Zod validation, server action
- **Dependencies**: Resend API for email delivery

## Data Flow
```
User Browser
    ↓
Static HTML/CSS/JS (from Cloudflare CDN)
    ↓
Contact Form Submission
    ↓
Next.js Server Action
    ↓
Resend API
    ↓
Email to YD Marketer inbox
```

## Key Design Patterns
- **Static Site Generation**: All pages pre-rendered at build time
- **Server Actions**: Contact form uses Next.js server actions for API routes
- **Component Composition**: Reusable UI components with Tailwind CSS
- **MDX for Blog**: Write blog posts in Markdown with React components

## Performance Considerations
- **Caching strategy**: 
  - Static assets cached at CDN edge (1 year)
  - HTML pages cached with revalidation
  - Images optimized with next/image
- **Asset optimization**: 
  - Images: WebP format, responsive sizes, lazy loading
  - Fonts: Self-hosted, subset to required glyphs
  - JavaScript: Code-split by route, tree-shaking
  - CSS: Purged unused Tailwind classes
- **Build optimization**:
  - Incremental Static Regeneration for blog posts
  - Parallel builds for faster deployment

## Security Architecture
- **Forms**: 
  - Client-side validation with Zod
  - Server-side validation in server actions
  - Rate limiting to prevent spam
- **HTTPS**: Enforced by Cloudflare
- **No authentication**: Static site requires no login
- **Content Security Policy**: Restrictive CSP headers

## Disaster Recovery
- **Backup strategy**: 
  - Code stored in Git repository
  - Cloudflare Pages maintains deployment history
  - Build artifacts can be recreated from source
- **Failover approach**: 
  - Automatic via Cloudflare's multi-region CDN
  - No manual intervention needed
- **Rollback**: 
  - Instant rollback to previous deployment via Cloudflare dashboard
