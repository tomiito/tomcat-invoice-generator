import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Mock fetch for relative URLs (jsdom doesn't support them)
const originalFetch = globalThis.fetch
globalThis.fetch = vi.fn(async (input, init) => {
  if (typeof input === 'string' && input.startsWith('/')) {
    return new Response(JSON.stringify({}), { status: 200 })
  }
  return originalFetch(input, init)
})
