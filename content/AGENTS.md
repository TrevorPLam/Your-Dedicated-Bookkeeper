# content/AGENTS.md — CMS-like Content

Last Updated: 2026-01-06
Applies To: Any agent working in content/

## Purpose
This folder contains content managed as files (file-based CMS pattern). Currently only blog posts are stored here, with potential for expansion to other content types.

---

## Folder Structure

```
content/
├── AGENTS.md       # This file
└── blog/           # Blog posts in MDX format
    ├── content-marketing-small-budget.mdx
    ├── email-marketing-roi.mdx
    ├── marketing-metrics-that-matter.mdx
    ├── seo-basics-small-business.mdx
    └── social-media-strategy-2025.mdx
```

---

## Blog Posts

### File Format
- **Extension:** `.mdx` (Markdown with JSX support)
- **Location:** `content/blog/`
- **Naming:** `kebab-case-slug.mdx` (slug becomes URL)

### Frontmatter Schema (Required)

```yaml
---
title: "Post Title"           # Required: Display title
description: "Brief summary"  # Required: SEO meta description
date: "2024-12-28"           # Required: YYYY-MM-DD format
author: "Author Name"         # Required: Author attribution
category: "Category Name"     # Required: Single category
featured: false              # Optional: Show on homepage (default: false)
---
```

### Frontmatter Rules
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | ✅ | Displayed as h1, used in OG tags |
| `description` | string | ✅ | Meta description, max ~160 chars |
| `date` | string | ✅ | ISO date format (YYYY-MM-DD) |
| `author` | string | ✅ | Falls back to "Your Dedicated Marketer Team" |
| `category` | string | ✅ | Falls back to "Marketing" |
| `featured` | boolean | ❌ | Default: false |

---

## Content Guidelines

### Markdown Features Supported
- Headings (## through ####)
- Lists (ordered and unordered)
- Code blocks with syntax highlighting
- Links (internal and external)
- Images (use relative paths or external URLs)
- Bold, italic, strikethrough
- Blockquotes
- Tables

### MDX Features
MDX allows embedding React components, but currently the blog uses **pure Markdown only**. If adding React components to blog posts:
1. Import the component in `BlogPostContent.tsx`
2. Pass it to the MDX renderer
3. Document the available components here

---

## Adding a New Blog Post

### Step-by-Step
1. Create file: `content/blog/your-post-slug.mdx`
2. Add frontmatter with all required fields
3. Write content in Markdown
4. Build to verify: `npm run build`
5. Preview locally: `npm run dev` → `/blog/your-post-slug`

### Template

```mdx
---
title: "Your Post Title"
description: "A brief description of your post for SEO and social sharing."
date: "2026-01-06"
author: "Your Dedicated Marketer Team"
category: "Marketing"
featured: false
---

Introduction paragraph that hooks the reader.

## First Section

Content goes here...

## Second Section

More content...

## Conclusion

Wrap up with a call to action.
```

---

## Data Flow

```
content/blog/*.mdx
       ↓
lib/blog.ts (parses with gray-matter)
       ↓
getAllPosts(), getPostBySlug()
       ↓
app/blog/page.tsx (listing)
app/blog/[slug]/page.tsx (individual post)
```

---

## Categories

Current categories in use:
- Content Marketing
- Email Marketing
- Marketing
- SEO
- Social Media

To add a new category, simply use it in a post's frontmatter. Categories are extracted dynamically from posts.

---

## SEO Considerations

- **Title:** Used for page title and OG title
- **Description:** Used for meta description and OG description
- **Slug:** Becomes the URL path (`/blog/your-slug`)
- **Date:** Used for sorting and display, affects freshness signals

---

## Future Expansion

If adding other content types (e.g., case studies, testimonials):
1. Create new folder: `content/[type]/`
2. Create parser in `lib/[type].ts`
3. Follow the same frontmatter + MDX pattern
4. Document the schema in this file
