/**
 * Tailwind CSS configuration with brand design system.
 * 
 * **Purpose:**
 * Defines the visual design system for the entire application.
 * All styling should use these tokens - no arbitrary values.
 * 
 * **Color Palette:**
 * 
 * | Token       | Hex       | Usage                          |
 * |-------------|-----------|--------------------------------|
 * | charcoal    | #0F1115   | Text, dark backgrounds         |
 * | off-white   | #F6F7F9   | Page backgrounds               |
 * | slate       | #6B7280   | Secondary text                 |
 * | teal        | #0EA5A4   | Primary actions, links, CTAs   |
 * | teal-dark   | #0d8f8e   | Hover states for teal          |
 * | teal-light  | #10b5b4   | Lighter teal accents           |
 * | amber       | #F59E0B   | Warnings, accents              |
 * | success     | #10B981   | Success states, confirmations  |
 * | error       | #EF4444   | Error states, validation       |
 * 
 * **Typography:**
 * 
 * | Token    | Size    | Line Height | Weight | Usage          |
 * |----------|---------|-------------|--------|----------------|
 * | h1       | 3.5rem  | 1.1         | 700    | Page titles    |
 * | h2       | 2.5rem  | 1.2         | 600    | Section heads  |
 * | h3       | 1.75rem | 1.3         | 500    | Card headings  |
 * | body     | 1rem    | 1.7         | 400    | Body text      |
 * | body-lg  | 1.125rem| 1.7         | 400    | Lead paragraphs|
 * | meta     | 0.875rem| 1.5         | 400    | Captions, dates|
 * 
 * **Font Families:**
 * - `font-sans`: Inter (default body text)
 * - `font-authority`: IBM Plex Sans (headings, emphasis)
 * 
 * **Usage Examples:**
 * ```tsx
 * // Colors
 * <div className="bg-charcoal text-white">
 * <button className="bg-teal hover:bg-teal-dark">
 * <p className="text-slate">
 * 
 * // Typography
 * <h1 className="text-h1">Page Title</h1>
 * <p className="text-body-lg">Lead paragraph</p>
 * 
 * // Fonts
 * <h2 className="font-authority">Authority heading</h2>
 * ```
 * 
 * **Rules:**
 * - NEVER use arbitrary values like bg-[#123456]
 * - ALWAYS use defined tokens for consistency
 * - See components/ui/AGENTS.md for component-level usage
 * 
 * @see docs/UI_DESIGN_SYSTEM.md for design guidelines
 * @see components/ui/AGENTS.md for component usage
 */

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /**
         * Brand Colors
         * Primary palette for the YD Marketer brand
         */
        charcoal: '#0F1115',      // Primary dark - text, nav, footers
        'off-white': '#F6F7F9',   // Primary light - page backgrounds
        slate: '#6B7280',         // Secondary text color
        teal: {
          DEFAULT: '#0EA5A4',     // Primary brand color - CTAs, links
          dark: '#0d8f8e',        // Hover state
          light: '#10b5b4',       // Lighter variant
        },
        amber: '#F59E0B',         // Accent color - highlights, warnings
        /**
         * Functional Colors
         * Semantic colors for UI states
         */
        success: '#10B981',       // Success messages, confirmations
        error: '#EF4444',         // Error states, validation errors
      },
      /**
       * Font Family Configuration
       * Maps to CSS variables set in layout.tsx
       */
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        authority: ['IBM Plex Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      /**
       * Typography Scale
       * Predefined text styles with size, line-height, and weight
       */
      fontSize: {
        'h1': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'h2': ['2.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        'h3': ['1.75rem', { lineHeight: '1.3', fontWeight: '500' }],
        'body': ['1rem', { lineHeight: '1.7', fontWeight: '400' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7', fontWeight: '400' }],
        'meta': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}

export default config
