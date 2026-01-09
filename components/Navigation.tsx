/**
 * Site navigation component with responsive mobile menu.
 *
 * @component Navigation
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🤖 AI METACODE — Quick Reference for AI Agents
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **FILE PURPOSE**: Global site navigation. Renders in root layout on ALL pages.
 * Handles desktop nav, mobile hamburger menu, and search integration.
 *
 * **RENDERING**: Client component ('use client') for mobile menu state.
 *
 * **MODIFYING NAV LINKS**:
 * Edit the `navLinks` array (line ~45). Changes auto-apply to both
 * desktop and mobile menus. Format: { href: '/path', label: 'Label' }
 *
 * **LAYOUT STRUCTURE**:
 * ```
 * <nav sticky>
 *   <Logo>                          |
 *   <DesktopLinks> (hidden md:flex) | md+ viewport
 *   <SearchDialog> <CTA Button>     |
 *   -----------------------------------
 *   <MobileSearch> <Hamburger>      | < md viewport
 *   <MobileMenu if open>            |
 * </nav>
 * ```
 *
 * **ACCESSIBILITY**:
 * - Escape key closes mobile menu
 * - aria-expanded on hamburger button
 * - aria-label on mobile menu container
 * - focus-visible outlines on all interactive elements
 *
 * **AI ITERATION HINTS**:
 * - Adding nav link? Add to navLinks array, update sitemap.ts
 * - Changing logo? Update Link content around line 85
 * - Mobile menu: controlled by isMobileMenuOpen state
 * - Search: SearchDialog component handles its own state
 *
 * **PROPS**:
 * - searchItems: SearchItem[] — passed from layout.tsx via getSearchIndex()
 *
 * **STYLING NOTES**:
 * - bg-charcoal: dark header background
 * - sticky top-0 z-50: fixed header behavior
 * - Breakpoint: md (768px) for desktop/mobile switch
 *
 * **POTENTIAL ISSUES**:
 * - [ ] Mobile menu doesn't trap focus (a11y improvement)
 * - [ ] No active link highlighting
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * **Features:**
 * - Sticky header with dark charcoal background
 * - Desktop: Horizontal nav links with search and CTA
 * - Mobile: Hamburger menu with slide-down panel
 * - Keyboard accessible (Escape closes mobile menu)
 *
 * **Behavior:**
 * - Mobile menu closes on link click
 * - Mobile menu closes on Escape key
 * - Search dialog integrated for both desktop and mobile
 *
 * **Usage:**
 * ```tsx
 * // In layout.tsx
 * import Navigation from '@/components/Navigation'
 * import { getSearchIndex } from '@/lib/search'
 *
 * const searchItems = getSearchIndex()
 * <Navigation searchItems={searchItems} />
 * ```
 *
 * **Modifying Navigation Links:**
 * Edit the `navLinks` array below. Changes apply to both
 * desktop and mobile menus automatically.
 *
 * @see components/SearchDialog for search functionality
 */

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import SearchDialog from '@/components/SearchDialog'
import type { SearchItem } from '@/lib/search'

/**
 * Navigation link configuration.
 * Add/remove items here to update both desktop and mobile menus.
 */
const navLinks = [
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/blog', label: 'Blog' },
  { href: '/feed.xml', label: 'RSS' },
  { href: '/about', label: 'About' },
]

/**
 * Navigation component props.
 * 
 * @property searchItems - Search index from lib/search.ts
 */
interface NavigationProps {
  searchItems: SearchItem[]
}

/**
 * Main navigation component.
 * Renders in root layout - appears on all pages.
 */
export default function Navigation({ searchItems }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <nav className="bg-charcoal shadow-sm sticky top-0 z-50" role="navigation" aria-label="Primary">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-white hover:text-white/90 transition-colors">
            YD Marketer
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-white font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {link.label}
              </Link>
            ))}
            <SearchDialog items={searchItems} />
            <Link href="/contact">
              <Button variant="primary" size="small">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <SearchDialog items={searchItems} variant="mobile" />
            <button
              onClick={toggleMobileMenu}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-charcoal border-t border-white/10"
          role="menu"
          aria-label="Mobile navigation"
        >
          <div className="px-6 py-4 space-y-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-white hover:text-white font-semibold py-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                onClick={() => setIsMobileMenuOpen(false)}
                role="menuitem"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="primary" size="medium" className="w-full">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
