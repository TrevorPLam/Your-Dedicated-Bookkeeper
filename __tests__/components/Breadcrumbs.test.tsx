import { render, screen } from '@testing-library/react'
import Breadcrumbs from '@/components/Breadcrumbs'
import { usePathnameMock } from '../../vitest.setup'

describe('Breadcrumbs', () => {
  it('does not render on home page', () => {
    usePathnameMock.mockReturnValue('/')
    const { container } = render(<Breadcrumbs />)

    expect(container.firstChild).toBeNull()
  })

  it('renders breadcrumbs for nested routes with structured data', () => {
    usePathnameMock.mockReturnValue('/services/seo')
    render(<Breadcrumbs />)

    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument()
    expect(screen.getByText('Services')).toBeInTheDocument()
    expect(screen.getByText('Seo')).toHaveAttribute('aria-current', 'page')
    const ldJson = document.querySelector('script[type="application/ld+json"]')
    expect(ldJson?.textContent).toContain('BreadcrumbList')
  })
})
