import { useState } from 'react'
import type { ClientFormData } from '../hooks/useClients'
import { emptyClientForm } from '../hooks/useClients'
import { COUNTRIES } from '../utils/countries'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

interface ClientFormProps {
  initial?: ClientFormData
  onSubmit: (data: ClientFormData) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export default function ClientForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}: ClientFormProps) {
  const [form, setForm] = useState<ClientFormData>(
    () => initial ?? { ...emptyClientForm },
  )
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  function handleChange(field: keyof ClientFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFormError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (!form.country || !form.street || !form.city || !form.zip) {
      setFormError('Country, street, city, and zip are required.')
      return
    }
    if (form.is_business && !form.business_name) {
      setFormError('Business name is required for business clients.')
      return
    }
    if (!form.is_business && !form.first_name) {
      setFormError('First name is required.')
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(form)
    } catch {
      setFormError('Failed to save client.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_business"
          checked={form.is_business}
          onChange={(e) => handleChange('is_business', e.target.checked)}
          className="rounded"
        />
        <Label htmlFor="is_business">Client is registered as a business</Label>
      </div>

      {form.is_business ? (
        <div className="space-y-2">
          <Label htmlFor="business_name">Business name *</Label>
          <Input
            id="business_name"
            value={form.business_name}
            onChange={(e) => handleChange('business_name', e.target.value)}
            required
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First name *</Label>
            <Input
              id="first_name"
              value={form.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last name *</Label>
            <Input
              id="last_name"
              value={form.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
              required
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="client_country">Country *</Label>
        <Select
          value={form.country}
          onValueChange={(value) => handleChange('country', value ?? '')}
        >
          <SelectTrigger id="client_country">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="street">Street *</Label>
        <Input
          id="street"
          value={form.street}
          onChange={(e) => handleChange('street', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="client_city">City *</Label>
          <Input
            id="client_city"
            value={form.city}
            onChange={(e) => handleChange('city', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client_zip">Zip / Postcode *</Label>
          <Input
            id="client_zip"
            value={form.zip}
            onChange={(e) => handleChange('zip', e.target.value)}
            required
          />
        </div>
      </div>

      {form.is_business && (
        <div className="space-y-2">
          <Label htmlFor="vat_number">VAT number (optional)</Label>
          <Input
            id="vat_number"
            value={form.vat_number}
            onChange={(e) => handleChange('vat_number', e.target.value)}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="client_email">Email</Label>
        <Input
          id="client_email"
          type="email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
      </div>

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
