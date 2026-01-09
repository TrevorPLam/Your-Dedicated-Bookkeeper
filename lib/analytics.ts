/**
 * Analytics event tracking abstraction layer.
 *
 * @module lib/analytics
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: Provider-agnostic analytics tracking. Wraps multiple
 * analytics providers (GA4, Plausible) with unified API.
 *
 * **CURRENT STATE**: T-064 pending - analytics provider not selected yet.
 * - NEXT_PUBLIC_ANALYTICS_ID not set → events log to console
 * - GA4 gtag present → sends to Google Analytics
 * - Plausible window.plausible present → sends to Plausible
 *
 * **USAGE**:
 * ```typescript
 * import { trackEvent, trackFormSubmission, trackCTAClick } from '@/lib/analytics'
 *
 * // Custom event
 * trackEvent({ action: 'signup_click', category: 'conversion', label: 'hero' })
 *
 * // Helper functions
 * trackFormSubmission('contact', true)  // form name, success boolean
 * trackCTAClick('homepage', 'hero')     // page, location
 * ```
 *
 * **AI ITERATION HINTS**:
 * - Adding new provider? Add check in trackEvent after Plausible block
 * - Follow pattern: check for window object existence first
 * - Use consistent event naming: snake_case for actions
 * - Dev mode always logs to console (via logInfo)
 *
 * **EVENT NAMING CONVENTION**:
 * - action: verb_noun (e.g., form_submit, cta_click, page_view)
 * - category: conversion | engagement | navigation | error
 * - label: optional context (e.g., button location, form name)
 *
 * **HELPER FUNCTIONS AVAILABLE**:
 * - trackFormSubmission(formName, success) - contact form tracking
 * - trackCTAClick(page, location) - CTA button tracking
 * - trackPageView() - manual page view (auto-handled by providers usually)
 *
 * **DEPENDS ON**: T-064 for provider selection
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **Purpose:**
 * - Provide unified API for analytics tracking
 * - Support multiple providers (GA4, Plausible) transparently
 * - Console logging in development for debugging
 *
 * **Supported Providers:**
 * - Google Analytics 4 (via gtag.js)
 * - Plausible Analytics
 * - Extensible for others
 *
 * **Configuration:**
 * - GA4: Set NEXT_PUBLIC_ANALYTICS_ID in env
 * - Plausible: Include script in layout
 * - No config needed for dev logging
 *
 * **Usage:**
 * ```typescript
 * import { trackEvent, trackFormSubmission } from '@/lib/analytics'
 *
 * // Track custom event
 * trackEvent({
 *   action: 'signup_click',
 *   category: 'conversion',
 *   label: 'homepage_hero'
 * })
 *
 * // Track form submission
 * trackFormSubmission('contact', true)
 * ```
 *
 * **Development Behavior:**
 * - Events logged to console instead of sent to providers
 * - Prefix: [Analytics]
 */

import { logInfo } from './logger'

function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

function isTest(): boolean {
  return process.env.NODE_ENV === 'test'
}

/**
 * Analytics event structure following GA4 conventions.
 * 
 * @property action - Event name (e.g., 'button_click')
 * @property category - Event category (e.g., 'engagement')
 * @property label - Optional label for additional context
 * @property value - Optional numeric value
 */
interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
}

/**
 * Track a custom event
 * Supports Google Analytics, Plausible, or custom analytics
 */
export function trackEvent({ action, category, label, value }: AnalyticsEvent) {
  if (isDevelopment() || isTest()) {
    logInfo('Analytics event', { action, category, label, value })
    return
  }

  // Google Analytics 4
  if (typeof window !== 'undefined') {
    const w = window as Window & { gtag?: (...args: unknown[]) => void }
    if (w.gtag) {
      w.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }
  }

  // Plausible Analytics
  if (typeof window !== 'undefined') {
    const w = window as Window & { plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void }
    if (w.plausible) {
      w.plausible(action, {
        props: { category, label, value },
      })
    }
  }

  // Add other analytics providers here
}

/**
 * Track page view
 */
export function trackPageView(url: string) {
  if (isDevelopment() || isTest()) {
    logInfo('Analytics page view', { url })
    return
  }

  // Google Analytics 4
  if (typeof window !== 'undefined') {
    const w = window as Window & { gtag?: (...args: unknown[]) => void }
    if (w.gtag) {
      w.gtag('config', process.env.NEXT_PUBLIC_ANALYTICS_ID, {
        page_path: url,
      })
    }
  }

  // Plausible Analytics (automatic)
  // No need to manually track page views with Plausible
}

/**
 * Track form submission
 */
export function trackFormSubmission(formName: string, success = true) {
  trackEvent({
    action: 'form_submission',
    category: 'form',
    label: formName,
    value: success ? undefined : 0,
  })
}

/**
 * Track button click
 */
export function trackButtonClick(buttonName: string, _location: string) {
  trackEvent({
    action: 'button_click',
    category: 'engagement',
    label: buttonName,
  })
}

/**
 * Track CTA click
 */
export function trackCTAClick(ctaText: string, _destination: string) {
  trackEvent({
    action: 'cta_click',
    category: 'engagement',
    label: ctaText,
  })
}

/**
 * Track outbound link
 */
export function trackOutboundLink(url: string) {
  trackEvent({
    action: 'outbound_link',
    category: 'navigation',
    label: url,
  })
}

/**
 * Track file download
 */
export function trackDownload(fileName: string) {
  trackEvent({
    action: 'download',
    category: 'engagement',
    label: fileName,
  })
}

/**
 * Track scroll depth
 */
export function trackScrollDepth(depth: 25 | 50 | 75 | 100) {
  trackEvent({
    action: 'scroll_depth',
    category: 'engagement',
    value: depth,
  })
}

/**
 * Track time on page
 */
export function trackTimeOnPage(seconds: number) {
  trackEvent({
    action: 'time_on_page',
    category: 'engagement',
    value: seconds,
  })
}
