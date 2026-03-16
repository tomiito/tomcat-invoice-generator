import { useState, useEffect, useCallback } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

export interface Profile {
  id: string
  auth0_id: string
  email: string
  name: string
  phone: string
  address: string
  city: string
  zip: string
  country: string
  vat_id: string
  tax_id: string
}

export interface ProfileFormData {
  name: string
  phone: string
  address: string
  city: string
  zip: string
  country: string
  vat_id: string
  tax_id: string
}

export default function useProfile() {
  const { user, getAccessTokenSilently } = useAuth0()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!user?.sub) return
    setLoading(true)
    setError(null)

    try {
      const token = await getAccessTokenSilently()
      const res = await fetch(
        `/api/profile?auth0_id=${encodeURIComponent(user.sub)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (!res.ok) throw new Error('Failed to fetch profile')

      const data = await res.json()
      setProfile(data.profile)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [user?.sub, getAccessTokenSilently])

  const updateProfile = useCallback(
    async (formData: ProfileFormData) => {
      if (!user?.sub) return
      setSaving(true)
      setError(null)

      try {
        const token = await getAccessTokenSilently()
        const res = await fetch('/api/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ auth0_id: user.sub, ...formData }),
        })

        if (!res.ok) throw new Error('Failed to update profile')

        const data = await res.json()
        setProfile(data.profile)
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        return false
      } finally {
        setSaving(false)
      }
    },
    [user?.sub, getAccessTokenSilently],
  )

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    profile,
    loading,
    saving,
    error,
    updateProfile,
    refetch: fetchProfile,
  }
}
