import { useState, useEffect, useCallback } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

export interface Client {
  id: string
  user_id: string
  is_business: boolean
  business_name: string | null
  first_name: string | null
  last_name: string | null
  email: string | null
  country: string
  street: string
  city: string
  zip: string
  vat_number: string | null
  created_at: string
}

export interface ClientFormData {
  is_business: boolean
  business_name: string
  first_name: string
  last_name: string
  email: string
  country: string
  street: string
  city: string
  zip: string
  vat_number: string
}

export const emptyClientForm: ClientFormData = {
  is_business: false,
  business_name: '',
  first_name: '',
  last_name: '',
  email: '',
  country: '',
  street: '',
  city: '',
  zip: '',
  vat_number: '',
}

export function clientToForm(client: Client): ClientFormData {
  return {
    is_business: client.is_business,
    business_name: client.business_name || '',
    first_name: client.first_name || '',
    last_name: client.last_name || '',
    email: client.email || '',
    country: client.country,
    street: client.street,
    city: client.city,
    zip: client.zip,
    vat_number: client.vat_number || '',
  }
}

export function getClientDisplayName(client: Client): string {
  if (client.is_business && client.business_name) {
    return client.business_name
  }
  return (
    [client.first_name, client.last_name].filter(Boolean).join(' ') || 'Unnamed'
  )
}

export default function useClients() {
  const { user, getAccessTokenSilently } = useAuth0()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = useCallback(async () => {
    if (!user?.sub) return
    setLoading(true)
    setError(null)

    try {
      const token = await getAccessTokenSilently()
      const res = await fetch(
        `/api/clients?auth0_id=${encodeURIComponent(user.sub)}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (!res.ok) throw new Error('Failed to fetch clients')
      const data = await res.json()
      setClients(data.clients)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [user?.sub, getAccessTokenSilently])

  const createClient = useCallback(
    async (formData: ClientFormData) => {
      if (!user?.sub) return null
      const token = await getAccessTokenSilently()
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ auth0_id: user.sub, ...formData }),
      })
      if (!res.ok) throw new Error('Failed to create client')
      const data = await res.json()
      setClients((prev) => [data.client, ...prev])
      return data.client as Client
    },
    [user?.sub, getAccessTokenSilently],
  )

  const updateClient = useCallback(
    async (id: string, formData: ClientFormData) => {
      if (!user?.sub) return null
      const token = await getAccessTokenSilently()
      const res = await fetch('/api/clients', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ auth0_id: user.sub, id, ...formData }),
      })
      if (!res.ok) throw new Error('Failed to update client')
      const data = await res.json()
      setClients((prev) => prev.map((c) => (c.id === id ? data.client : c)))
      return data.client as Client
    },
    [user?.sub, getAccessTokenSilently],
  )

  const deleteClient = useCallback(
    async (id: string) => {
      if (!user?.sub) return
      const token = await getAccessTokenSilently()
      const res = await fetch('/api/clients', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ auth0_id: user.sub, id }),
      })
      if (!res.ok) throw new Error('Failed to delete client')
      setClients((prev) => prev.filter((c) => c.id !== id))
    },
    [user?.sub, getAccessTokenSilently],
  )

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  return {
    clients,
    loading,
    error,
    createClient,
    updateClient,
    deleteClient,
    refetch: fetchClients,
  }
}
