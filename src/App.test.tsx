import { describe, it, expect } from 'vitest'
import './test/mocks/auth0'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import CreateInvoice from './pages/CreateInvoice'
import Settings from './pages/Settings'
import Clients from './pages/Clients'
import NotFound from './pages/NotFound'
import App from './App'

function renderRoute(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/invoices/new" element={<CreateInvoice />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: 'Dashboard' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Invoice Generator')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })
})

describe('Routing', () => {
  it('renders Dashboard at /', () => {
    renderRoute('/')
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders CreateInvoice at /invoices/new', () => {
    renderRoute('/invoices/new')
    expect(screen.getByText('Create Invoice')).toBeInTheDocument()
  })

  it('renders Settings at /settings', () => {
    renderRoute('/settings')
    expect(screen.getByText('Loading profile...')).toBeInTheDocument()
  })

  it('renders Clients at /clients', () => {
    renderRoute('/clients')
    expect(screen.getByText('Loading clients...')).toBeInTheDocument()
  })

  it('renders NotFound for unknown routes', () => {
    renderRoute('/nope')
    expect(screen.getByText('404')).toBeInTheDocument()
  })
})
