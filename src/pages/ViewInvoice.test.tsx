import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ViewInvoice from './ViewInvoice'

describe('ViewInvoice', () => {
  it('renders with the invoice id from params', () => {
    render(
      <MemoryRouter initialEntries={['/invoices/abc-123']}>
        <Routes>
          <Route path="/invoices/:id" element={<ViewInvoice />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Invoice abc-123')).toBeInTheDocument()
  })
})
