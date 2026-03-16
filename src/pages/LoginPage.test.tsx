import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockLoginWithRedirect = vi.fn()

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    loginWithRedirect: mockLoginWithRedirect,
  }),
}))

import LoginPage from './LoginPage'

describe('LoginPage', () => {
  it('renders login heading and button', () => {
    render(<LoginPage />)
    expect(screen.getByText('Invoice Generator')).toBeInTheDocument()
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument()
  })

  it('calls loginWithRedirect with google connection on click', async () => {
    render(<LoginPage />)
    await userEvent.click(screen.getByText('Sign in with Google'))
    expect(mockLoginWithRedirect).toHaveBeenCalledWith({
      authorizationParams: { connection: 'google-oauth2' },
    })
  })
})
