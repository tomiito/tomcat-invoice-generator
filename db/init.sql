-- Tomcat Invoice Generator - Database Schema

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users profile (synced from Auth0 on first login)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth0_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  zip TEXT,
  country TEXT,
  vat_id TEXT,
  tax_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_business BOOLEAN DEFAULT false,
  business_name TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  country TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  zip TEXT NOT NULL,
  vat_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Invoices (metadata only - PDF regenerated client-side)
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  invoice_number TEXT NOT NULL,
  currency TEXT DEFAULT 'USD',
  subtotal NUMERIC(12,2) NOT NULL,
  vat_amount NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) NOT NULL,
  status TEXT DEFAULT 'awaiting_payment',
  period_from DATE,
  period_to DATE,
  invoice_date DATE NOT NULL,
  due_date DATE,
  payment_details TEXT,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Line items
CREATE TABLE line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  unit_type TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL,
  rate NUMERIC(12,2) NOT NULL,
  amount NUMERIC(12,2) NOT NULL
);

-- Auto-increment invoice number per user
CREATE TABLE invoice_counters (
  user_id UUID PRIMARY KEY REFERENCES profiles(id),
  next_number INTEGER DEFAULT 1
);

-- Indexes for common queries
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_line_items_invoice_id ON line_items(invoice_id);
