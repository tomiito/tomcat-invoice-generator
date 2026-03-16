const currencyLocaleMap: Record<string, string> = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  ARS: 'es-AR',
  BRL: 'pt-BR',
}

export function formatCurrency(
  amount: number,
  currency: string = 'USD',
): string {
  const locale = currencyLocaleMap[currency] ?? 'en-US'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatInvoiceNumber(num: number): string {
  return `INV-${String(num).padStart(3, '0')}`
}
