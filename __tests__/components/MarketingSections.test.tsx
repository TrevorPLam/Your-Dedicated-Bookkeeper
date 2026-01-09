import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'
import ValueProps from '@/components/ValueProps'
import ServicesOverview from '@/components/ServicesOverview'
import SocialProof from '@/components/SocialProof'

describe('Marketing sections', () => {
  it('renders hero headline and primary CTAs', () => {
    render(<Hero />)

    expect(
      screen.getByRole('heading', { name: /growth-focused marketing for small businesses/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /schedule free consultation/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /view services/i })).toBeInTheDocument()
  })

  it('renders the value proposition cards', () => {
    render(<ValueProps />)

    expect(screen.getByRole('heading', { level: 3, name: /data-driven strategy/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /no surprise costs/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /we execute, not just plan/i })).toBeInTheDocument()
  })

  it('renders the services overview section', () => {
    render(<ServicesOverview />)

    expect(
      screen.getByRole('heading', { name: /marketing services that drive growth/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /seo services/i })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /learn more/i })).toHaveLength(4)
  })

  it('renders testimonials and metrics', () => {
    render(<SocialProof />)

    expect(screen.getByRole('heading', { name: /trusted by growing businesses/i })).toBeInTheDocument()
    expect(screen.getByText(/sarah johnson/i)).toBeInTheDocument()
    expect(screen.getByText(/127%/i)).toBeInTheDocument()
  })
})
