import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockUseAuth0 = vi.fn()

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => mockUseAuth0(),
}))

import ProtectedRoute from './ProtectedRoute'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ProtectedRoute', () => {
  it('shows loading state', () => {
    mockUseAuth0.mockReturnValue({ isLoading: true, isAuthenticated: false })
    render(
      <ProtectedRoute>
        <p>Protected content</p>
      </ProtectedRoute>,
    )
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows login page when not authenticated', () => {
    mockUseAuth0.mockReturnValue({
      isLoading: false,
      isAuthenticated: false,
      loginWithRedirect: vi.fn(),
    })
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <p>Protected content</p>
        </ProtectedRoute>
      </MemoryRouter>,
    )
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument()
  })

  it('renders children when authenticated', () => {
    mockUseAuth0.mockReturnValue({ isLoading: false, isAuthenticated: true })
    render(
      <ProtectedRoute>
        <p>Protected content</p>
      </ProtectedRoute>,
    )
    expect(screen.getByText('Protected content')).toBeInTheDocument()
  })
})
