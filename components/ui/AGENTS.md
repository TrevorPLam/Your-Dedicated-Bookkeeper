# components/ui/AGENTS.md — Design System Primitives

Last Updated: 2026-01-06
Applies To: Any agent working in components/ui/

## Purpose
This folder contains the core design system primitives. These are the "Lego blocks" used to build all UI across the application. **Consistency is critical** — do NOT create ad-hoc styling.

---

## Component Reference

| Component | Purpose | Key Props | Variants |
|-----------|---------|-----------|----------|
| `Button.tsx` | Actions and links | `variant`, `size`, `disabled` | primary, secondary, text |
| `Card.tsx` | Content containers | `className` | — |
| `Container.tsx` | Max-width wrapper | `className` | — |
| `Section.tsx` | Page sections with padding | `className` | — |
| `Input.tsx` | Text input fields | `label`, `error`, `...inputProps` | — |
| `Select.tsx` | Dropdown selects | `label`, `error`, `options` | — |
| `Textarea.tsx` | Multi-line text input | `label`, `error`, `...textareaProps` | — |
| `Accordion.tsx` | Collapsible content | `items[]` | — |
| `Skeleton.tsx` | Loading placeholders | `className` | — |

---

## Button Component

```tsx
import Button from '@/components/ui/Button'

// Variants
<Button variant="primary">Primary Action</Button>   // Teal background
<Button variant="secondary">Secondary</Button>      // Outlined
<Button variant="text">Text Link</Button>           // No background

// Sizes
<Button size="small">Small</Button>    // py-2 px-4
<Button size="medium">Medium</Button>  // py-3 px-6 (default)
<Button size="large">Large</Button>    // py-4 px-8

// States
<Button disabled>Disabled</Button>
```

---

## Form Components

All form components follow the same pattern:

```tsx
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'

// Input with label and error
<Input
  label="Email"
  type="email"
  error={errors.email?.message}
  {...register('email')}
/>

// Select with options
<Select
  label="Category"
  options={[
    { value: 'seo', label: 'SEO' },
    { value: 'content', label: 'Content' },
  ]}
  error={errors.category?.message}
  {...register('category')}
/>

// Textarea
<Textarea
  label="Message"
  rows={4}
  error={errors.message?.message}
  {...register('message')}
/>
```

---

## Layout Components

```tsx
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'

// Container: Centers content with max-width
<Container>
  <h1>Page content here</h1>
</Container>

// Section: Adds vertical padding
<Section>
  <Container>
    <h2>Section content</h2>
  </Container>
</Section>

// Card: Visual grouping with background/shadow
<Card>
  <h3>Card title</h3>
  <p>Card content</p>
</Card>
```

---

## Design Tokens

These components use tokens defined in `tailwind.config.ts`:

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `charcoal` | #0F1115 | Primary text, dark backgrounds |
| `off-white` | #F6F7F9 | Light backgrounds |
| `teal` | #0EA5A4 | Primary actions, links |
| `teal-dark` | #0d8f8e | Hover states |
| `amber` | #F59E0B | Accents, warnings |
| `success` | #10B981 | Success states |
| `error` | #EF4444 | Error states |

### Typography
| Token | Size | Usage |
|-------|------|-------|
| `text-h1` | 3.5rem | Page titles |
| `text-h2` | 2.5rem | Section headings |
| `text-h3` | 1.75rem | Card headings |
| `text-body` | 1rem | Body text |
| `text-body-lg` | 1.125rem | Lead paragraphs |
| `text-meta` | 0.875rem | Captions, metadata |

---

## Rules

### DO
- Use existing components before creating new ones
- Follow the established variant patterns
- Maintain accessibility (focus states, aria labels)
- Use design tokens from tailwind.config.ts

### DO NOT
- Create one-off styled components
- Use arbitrary Tailwind values (e.g., `bg-[#123456]`)
- Modify these components without design review
- Add complex business logic to UI primitives

---

## Adding a New UI Component

1. **Check if existing component can be extended** (add a variant)
2. **Create component file**: `ComponentName.tsx`
3. **Follow the pattern**: forwardRef, TypeScript interface, cn() for classes
4. **Add to this documentation**: Update the component table
5. **Add tests**: Create tests in `__tests__/components/ui/`

### Template

```tsx
import React from 'react'
import { cn } from '@/lib/utils'

export interface NewComponentProps {
  /** Description */
  prop?: string
  className?: string
  children?: React.ReactNode
}

const NewComponent = React.forwardRef<HTMLDivElement, NewComponentProps>(
  ({ prop, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('base-styles', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

NewComponent.displayName = 'NewComponent'

export default NewComponent
```

---

## Testing

Tests for UI components are in `__tests__/components/ui/components.test.tsx`.

Test coverage should include:
- Rendering with default props
- All variants render correctly
- Accessibility attributes present
- Event handlers work (for interactive components)
