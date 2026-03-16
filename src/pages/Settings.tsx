import { useState } from 'react'
import useProfile from '../hooks/useProfile'
import type { Profile, ProfileFormData } from '../hooks/useProfile'
import { formatInvoiceNumber } from '../utils/format'
import { COUNTRIES } from '../utils/countries'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Button } from '../components/ui/button'

function profileToForm(profile: Profile): ProfileFormData {
  return {
    name: profile.name || '',
    phone: profile.phone || '',
    address: profile.address || '',
    city: profile.city || '',
    zip: profile.zip || '',
    country: profile.country || '',
    vat_id: profile.vat_id || '',
    tax_id: profile.tax_id || '',
  }
}

function SettingsForm({
  profile,
  saving,
  error,
  updateProfile,
}: {
  profile: Profile
  saving: boolean
  error: string | null
  updateProfile: (data: ProfileFormData) => Promise<boolean | undefined>
}) {
  const [form, setForm] = useState<ProfileFormData>(() =>
    profileToForm(profile),
  )
  const [saved, setSaved] = useState(false)

  function handleChange(field: keyof ProfileFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  async function handleSave() {
    const success = await updateProfile(form)
    if (success) setSaved(true)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal or business details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">Zip / Postcode</Label>
              <Input
                id="zip"
                value={form.zip}
                onChange={(e) => handleChange('zip', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={form.country}
              onValueChange={(value) => handleChange('country', value ?? '')}
            >
              <SelectTrigger id="country">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax Information</CardTitle>
          <CardDescription>Enter your VAT/GST and tax details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vat_id">VAT ID, GST ID or Equivalent</Label>
            <Input
              id="vat_id"
              value={form.vat_id}
              onChange={(e) => handleChange('vat_id', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tax_id">Tax ID</Label>
            <Input
              id="tax_id"
              value={form.tax_id}
              onChange={(e) => handleChange('tax_id', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Settings</CardTitle>
          <CardDescription>
            Invoice number and type configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Invoice number</span>
            <span className="font-medium">{formatInvoiceNumber(1)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Invoice type</span>
            <span className="font-medium">Service</span>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && (
        <p className="text-sm text-green-600">Profile saved successfully.</p>
      )}

      <Button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save'}
      </Button>
    </div>
  )
}

export default function Settings() {
  const { profile, loading, saving, error, updateProfile } = useProfile()

  if (loading || !profile) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    )
  }

  return (
    <SettingsForm
      profile={profile}
      saving={saving}
      error={error}
      updateProfile={updateProfile}
    />
  )
}
