import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockGetAccessTokenSilently = vi.fn().mockResolvedValue('mock-token')

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    user: { sub: 'auth0|123', email: 'test@test.com', name: 'Test User' },
    isAuthenticated: true,
    isLoading: false,
    getAccessTokenSilently: mockGetAccessTokenSilently,
  }),
}))

import Settings from './Settings'

beforeEach(() => {
  vi.clearAllMocks()
  globalThis.fetch = vi.fn()
})

function mockFetchProfile(profile = {}) {
  const defaultProfile = {
    id: 'uuid-1',
    auth0_id: 'auth0|123',
    email: 'test@test.com',
    name: 'Test User',
    phone: '+1234567890',
    address: '123 Main St',
    city: 'Buenos Aires',
    zip: 'B1234',
    country: 'Argentina',
    vat_id: '12345',
    tax_id: '67890',
    ...profile,
  }
  ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ profile: defaultProfile }),
  })
  return defaultProfile
}

describe('Settings', () => {
  it('shows loading state initially', () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise(() => {}),
    )
    render(<Settings />)
    expect(screen.getByText('Loading profile...')).toBeInTheDocument()
  })

  it('renders profile form with data', async () => {
    mockFetchProfile()
    render(<Settings />)

    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveValue('Test User')
    })
    expect(screen.getByLabelText('Phone')).toHaveValue('+1234567890')
    expect(screen.getByLabelText('Address')).toHaveValue('123 Main St')
    expect(screen.getByLabelText('City')).toHaveValue('Buenos Aires')
    expect(screen.getByLabelText('Zip / Postcode')).toHaveValue('B1234')
    expect(screen.getByLabelText('VAT ID, GST ID or Equivalent')).toHaveValue(
      '12345',
    )
    expect(screen.getByLabelText('Tax ID')).toHaveValue('67890')
  })

  it('renders invoice settings section', async () => {
    mockFetchProfile()
    render(<Settings />)

    await waitFor(() => {
      expect(screen.getByText('Invoice Settings')).toBeInTheDocument()
    })
    expect(screen.getByText('INV-001')).toBeInTheDocument()
    expect(screen.getByText('Service')).toBeInTheDocument()
  })

  it('saves profile on button click', async () => {
    mockFetchProfile()
    render(<Settings />)

    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveValue('Test User')
    })
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ profile: { name: 'Updated Name' } }),
    })

    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(
        screen.getByText('Profile saved successfully.'),
      ).toBeInTheDocument()
    })
  })

  it('shows error when save fails', async () => {
    mockFetchProfile()
    render(<Settings />)

    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveValue('Test User')
    })
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
    })

    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(screen.getByText('Failed to update profile')).toBeInTheDocument()
    })
  })
})
