import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Dashboard from './pages/Dashboard'
import CreateInvoice from './pages/CreateInvoice'
import Settings from './pages/Settings'
import Clients from './pages/Clients'
import NotFound from './pages/NotFound'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
})

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
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('renders Clients at /clients', () => {
    renderRoute('/clients')
    expect(screen.getByText('Clients')).toBeInTheDocument()
  })

  it('renders NotFound for unknown routes', () => {
    renderRoute('/nope')
    expect(screen.getByText('404')).toBeInTheDocument()
  })
})
