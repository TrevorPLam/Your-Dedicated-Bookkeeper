# Mobile-First Smoke Test Checklist

Last Updated: 2026-01-08

## Goal
Provide a lightweight, repeatable checklist for manual release verification with a mobile-first focus.

## Setup
- Device: real phone or Chrome DevTools device emulation (e.g., 390×844).
- Browser: Chrome or Safari.
- Environment: production URL (preferred) or Pages preview URL.

## Mobile-critical checks
### 1) Navigation + layout
- [ ] Load the homepage and confirm the header/logo render.
- [ ] Open the mobile menu (hamburger) and verify links are tappable.
- [ ] Close the menu and confirm the page is usable (no overlay blocking taps).
- [ ] Scroll the page and ensure no layout shifts or overlap.

### 2) Core pages
- [ ] Home page loads without console errors.
- [ ] Services page loads and cards display.
- [ ] Pricing page loads and CTA buttons are visible.
- [ ] Contact page loads and form fields render correctly.

### 3) Lead capture (contact form)
- [ ] Enter name, email, phone, and message.
- [ ] Submit the form and confirm success messaging.
- [ ] Confirm error messaging appears for missing required fields.

### 4) SEO basics
- [ ] Page title matches expected page.
- [ ] Meta description is present.
- [ ] Open Graph image renders in HTML source.

## Desktop spot check (minimum)
- [ ] Repeat the homepage and contact form checks on a desktop viewport.

## Reporting
If any step fails:
1. Capture a screenshot.
2. Note the URL + device size.
3. Create or update a task in `TODO.md` with acceptance criteria.
