/**
 * Root layout component for the entire application.
 *
 * @module app/layout
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: Root layout wrapping ALL pages. Defines HTML structure,
 * global metadata, fonts, navigation, and footer. Changes here affect
 * every page on the site.
 *
 * **RENDERING**: Server component (no 'use client'). Children rendered
 * inside Providers wrapper which IS a client component.
 *
 * **COMPONENT HIERARCHY**:
 * ```
 * <html>
 *   <head>  ← metadata export handles this
 *   <body>
 *     <SkipToContent />     ← a11y jump link
 *     <Navigation />         ← sticky header (client)
 *     <Providers>            ← ErrorBoundary + Breadcrumbs (client)
 *       <main>{children}</main>
 *     </Providers>
 *     <Footer />             ← site footer (server)
 *     <InstallPrompt />      ← PWA install (client)
 *   </body>
 * </html>
 * ```
 *
 * **METADATA**:
 * - Default title with template: "%s | Your Dedicated Marketer"
 * - Child pages override with their own metadata export
 * - OG image generated via /api/og route
 * - Structured data: Organization + WebSite schemas in <head>
 *
 * **FONTS** (Google Fonts via next/font):
 * - Inter: --font-inter (body text, sans-serif default)
 * - IBM Plex Sans: --font-plex (headings, .font-authority class)
 *
 * **AI ITERATION HINTS**:
 * - Adding global script? Add to <head> section
 * - Changing fonts? Update font imports and CSS variables
 * - Changing nav links? Edit Navigation.tsx navLinks array
 * - Adding global provider? Wrap in Providers component
 *
 * **PWA CONFIG**:
 * - manifest.json linked in metadata
 * - Apple touch icons in metadata
 * - Theme color: #0ea5e9
 * - InstallPrompt handles A2HS flow
 *
 * **SEARCH**: getSearchIndex() called at layout level,
 * passed to Navigation for SearchDialog.
 *
 * **KNOWN ISSUES**:
 * - [ ] No skip link target (#main-content) on some pages
 * - [ ] Structured data URLs hardcoded (should use env)
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **Purpose:**
 * - Defines the HTML document structure
 * - Provides global metadata for SEO
 * - Wraps all pages with Navigation, Footer, and Providers
 * - Configures fonts, PWA settings, and structured data
 *
 * **Component Hierarchy:**
 * ```
 * <html>
 *   <head>  (PWA meta, structured data)
 *   <body>
 *     <SkipToContent />     (accessibility)
 *     <Navigation />         (sticky header)
 *     <Providers>            (error boundary, breadcrumbs)
 *       <main>{children}</main>
 *     </Providers>
 *     <Footer />
 *     <InstallPrompt />     (PWA install)
 *   </body>
 * </html>
 * ```
 *
 * **SEO Configuration:**
 * - Default title with template for child pages
 * - OpenGraph and Twitter card metadata
 * - Organization and WebSite structured data
 * - Robots directives for search engines
 *
 * **Fonts:**
 * - Inter: Primary sans-serif (body text)
 * - IBM Plex Sans: Authority font (headings, emphasis)
 *
 * **PWA:**
 * - Manifest linked for installability
 * - Apple touch icons configured
 * - Theme color set
 *
 * **Dynamic Imports:**
 * - Providers: Client-side only (ErrorBoundary needs browser)
 * - InstallPrompt: Client-side only (PWA API)
 *
 * @see app/AGENTS.md for page conventions
 * @see tailwind.config.ts for theme customization
 */

import type { Metadata } from 'next'
import { IBM_Plex_Sans, Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SkipToContent from '@/components/SkipToContent'
import Providers from '@/app/providers'
import InstallPrompt from '@/components/InstallPrompt'
import { getPublicBaseUrl } from '@/lib/env.public'
import { getSearchIndex } from '@/lib/search'

// Font configuration with CSS variables
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-plex',
  display: 'swap',
  weight: ['400', '600', '700'],
})

const siteUrl = getPublicBaseUrl()
const ogImageUrl = new URL('/api/og?title=Your%20Dedicated%20Bookkeeper', siteUrl).toString()

/**
 * Global metadata applied to all pages.
 * Child pages can override with their own metadata export.
 * 
 * Title template: "%s | Your Dedicated Bookkeeper"
 * - Child page title replaces %s
 * - Example: "Essentials Books | Your Dedicated Bookkeeper"
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Your Dedicated Bookkeeper | Professional Bookkeeping Services That Keep You Compliant',
    template: '%s | Your Dedicated Bookkeeper',
  },
  description: 'Expert bookkeeping services for businesses that want accurate financial records. We specialize in monthly bookkeeping, financial reporting, and compliance services that keep you tax-ready.',
  keywords: ['bookkeeping services', 'monthly bookkeeping', 'financial reporting', 'accounts payable', 'accounts receivable', 'bookkeeping company', 'small business bookkeeping'],
  authors: [{ name: 'Your Dedicated Bookkeeper' }],
  creator: 'Your Dedicated Bookkeeper',
  publisher: 'Your Dedicated Bookkeeper',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Your Dedicated Bookkeeper',
    title: 'Your Dedicated Bookkeeper | Professional Bookkeeping Services That Keep You Compliant',
    description:
      'Expert bookkeeping services for businesses that want accurate financial records. We specialize in monthly bookkeeping, financial reporting, and compliance services that keep you tax-ready.',
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: 'Your Dedicated Bookkeeper brand preview image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Dedicated Bookkeeper | Professional Bookkeeping Services That Keep You Compliant',
    description:
      'Expert bookkeeping services for businesses that want accurate financial records. Monthly bookkeeping, financial reporting, and compliance services that keep you tax-ready.',
    images: [ogImageUrl],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const searchItems = getSearchIndex()

  return (
    <html lang="en" className={`${inter.variable} ${plexSans.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="YD Bookkeeper" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Your Dedicated Bookkeeper',
              description: 'Expert bookkeeping services for businesses that want accurate financial records.',
              url: siteUrl,
              logo: new URL('/logo.png', siteUrl).toString(),
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                email: 'contact@yourdedicatedbookkeeper.com',
              },
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'US',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                reviewCount: '127',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Your Dedicated Bookkeeper',
              url: siteUrl,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${siteUrl}/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="font-sans bg-off-white text-charcoal">
        <SkipToContent />
        <Navigation searchItems={searchItems} />
        <Providers>
          <main id="main-content" tabIndex={-1} className="focus-visible:outline-none">
            {children}
          </main>
        </Providers>
        <Footer />
        <InstallPrompt />
      </body>
    </html>
  )
}
