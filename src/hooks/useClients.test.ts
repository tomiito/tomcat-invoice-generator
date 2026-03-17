import { describe, it, expect } from 'vitest'
import {
  getClientDisplayName,
  clientToForm,
  emptyClientForm,
} from './useClients'
import type { Client } from './useClients'

const businessClient: Client = {
  id: '1',
  user_id: 'u1',
  is_business: true,
  business_name: 'Acme Corp',
  first_name: null,
  last_name: null,
  email: 'acme@test.com',
  country: 'US',
  street: '123 Main',
  city: 'NYC',
  zip: '10001',
  vat_number: 'VAT123',
  created_at: '2026-01-01',
}

const individualClient: Client = {
  id: '2',
  user_id: 'u1',
  is_business: false,
  business_name: null,
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@test.com',
  country: 'UK',
  street: '456 High St',
  city: 'London',
  zip: 'SW1A',
  vat_number: null,
  created_at: '2026-01-01',
}

describe('getClientDisplayName', () => {
  it('returns business name for business client', () => {
    expect(getClientDisplayName(businessClient)).toBe('Acme Corp')
  })

  it('returns full name for individual client', () => {
    expect(getClientDisplayName(individualClient)).toBe('John Doe')
  })

  it('returns Unnamed for client with no name', () => {
    expect(
      getClientDisplayName({
        ...individualClient,
        first_name: null,
        last_name: null,
      }),
    ).toBe('Unnamed')
  })
})

describe('clientToForm', () => {
  it('converts business client to form data', () => {
    const form = clientToForm(businessClient)
    expect(form.is_business).toBe(true)
    expect(form.business_name).toBe('Acme Corp')
    expect(form.country).toBe('US')
  })

  it('converts individual client to form data', () => {
    const form = clientToForm(individualClient)
    expect(form.is_business).toBe(false)
    expect(form.first_name).toBe('John')
    expect(form.last_name).toBe('Doe')
  })
})

describe('emptyClientForm', () => {
  it('has all fields empty/false', () => {
    expect(emptyClientForm.is_business).toBe(false)
    expect(emptyClientForm.business_name).toBe('')
    expect(emptyClientForm.country).toBe('')
  })
})
