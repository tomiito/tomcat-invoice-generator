import { describe, it, expect } from 'vitest'
import { formatCurrency, formatInvoiceNumber } from './format'

describe('formatCurrency', () => {
  it('formats USD by default', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('formats decimal amounts', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })

  it('formats large amounts', () => {
    expect(formatCurrency(376203)).toBe('$376,203.00')
  })

  it('formats EUR', () => {
    const result = formatCurrency(5600, 'EUR')
    expect(result).toContain('5.600,00')
  })

  it('formats GBP', () => {
    const result = formatCurrency(2800, 'GBP')
    expect(result).toContain('2,800.00')
  })

  it('falls back to en-US for unknown currency', () => {
    const result = formatCurrency(100, 'JPY')
    expect(result).toContain('100')
  })
})

describe('formatInvoiceNumber', () => {
  it('pads single digit', () => {
    expect(formatInvoiceNumber(1)).toBe('INV-001')
  })

  it('pads double digit', () => {
    expect(formatInvoiceNumber(42)).toBe('INV-042')
  })

  it('does not pad triple digit', () => {
    expect(formatInvoiceNumber(123)).toBe('INV-123')
  })

  it('handles numbers beyond 999', () => {
    expect(formatInvoiceNumber(1000)).toBe('INV-1000')
  })
})
