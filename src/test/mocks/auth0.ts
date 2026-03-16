import { vi } from 'vitest'

export const mockAuth0 = {
  isAuthenticated: true,
  isLoading: false,
  user: { sub: 'auth0|123', email: 'test@test.com', name: 'Test User' },
  loginWithRedirect: vi.fn(),
  logout: vi.fn(),
  getAccessTokenSilently: vi.fn().mockResolvedValue('mock-token'),
}

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => mockAuth0,
  Auth0Provider: ({ children }: { children: React.ReactNode }) => children,
}))
