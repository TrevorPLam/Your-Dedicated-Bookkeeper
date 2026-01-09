import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

describe('HomePage', () => {
  it('renders hero and CTA content', async () => {
    render(<HomePage />)

    expect(screen.getByRole('heading', { name: /growth-focused marketing/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /schedule free consultation/i })).toBeInTheDocument()
    expect(await screen.findByText(/trusted by growing businesses/i)).toBeInTheDocument()
  })
})
