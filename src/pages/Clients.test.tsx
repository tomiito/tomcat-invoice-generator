import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockGetToken = vi.fn().mockResolvedValue('mock-token')

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    user: { sub: 'auth0|123' },
    isAuthenticated: true,
    isLoading: false,
    getAccessTokenSilently: mockGetToken,
  }),
}))

import Clients from './Clients'

const mockClient = {
  id: 'c1',
  user_id: 'u1',
  is_business: true,
  business_name: 'Acme Corp',
  first_name: null,
  last_name: null,
  email: 'acme@test.com',
  country: 'United States',
  street: '123 Main St',
  city: 'New York',
  zip: '10001',
  vat_number: 'VAT123',
  created_at: '2026-03-16',
}

beforeEach(() => {
  vi.clearAllMocks()
})

function mockFetchWith(clients: unknown[]) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ clients }),
  })
}

describe('Clients', () => {
  it('shows loading state', () => {
    globalThis.fetch = vi.fn().mockReturnValue(new Promise(() => {}))
    render(<Clients />)
    expect(screen.getByText('Loading clients...')).toBeInTheDocument()
  })

  it('shows empty state when no clients', async () => {
    mockFetchWith([])
    render(<Clients />)
    await waitFor(() => {
      expect(
        screen.getByText(
          'No clients yet. Create your first client to get started.',
        ),
      ).toBeInTheDocument()
    })
  })

  it('renders client list', async () => {
    mockFetchWith([mockClient])
    render(<Clients />)
    await waitFor(() => {
      expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    })
    expect(screen.getByText('Business')).toBeInTheDocument()
    expect(screen.getByText('United States')).toBeInTheDocument()
    expect(screen.getByText('acme@test.com')).toBeInTheDocument()
  })

  it('navigates to create form', async () => {
    mockFetchWith([])
    render(<Clients />)
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'New Client' }),
      ).toBeInTheDocument()
    })
    await userEvent.click(screen.getByRole('button', { name: 'New Client' }))
    await waitFor(() => {
      expect(
        screen.getByLabelText('Client is registered as a business'),
      ).toBeInTheDocument()
    })
  })

  it('navigates to edit form', async () => {
    mockFetchWith([mockClient])
    render(<Clients />)
    await waitFor(() => {
      expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    })
    await userEvent.click(screen.getByText('Edit'))
    await waitFor(() => {
      expect(screen.getByText('Edit Client')).toBeInTheDocument()
    })
    expect(screen.getByLabelText('Business name *')).toHaveValue('Acme Corp')
  })
})
