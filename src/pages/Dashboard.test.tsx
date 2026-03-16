import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Dashboard from './Dashboard'

describe('Dashboard', () => {
  it('renders the heading', () => {
    render(<Dashboard />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('shows placeholder text', () => {
    render(<Dashboard />)
    expect(
      screen.getByText('Your invoices will appear here.'),
    ).toBeInTheDocument()
  })
})
