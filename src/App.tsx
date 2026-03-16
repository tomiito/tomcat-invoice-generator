import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import CreateInvoice from './pages/CreateInvoice'
import ViewInvoice from './pages/ViewInvoice'
import Settings from './pages/Settings'
import Clients from './pages/Clients'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoices/new" element={<CreateInvoice />} />
          <Route path="/invoices/:id" element={<ViewInvoice />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
