import { useEffect, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

export default function useProfileSync() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const hasSynced = useRef(false)

  useEffect(() => {
    if (!isAuthenticated || !user || hasSynced.current) return

    async function syncProfile() {
      try {
        const token = await getAccessTokenSilently()
        await fetch('/api/auth/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            auth0_id: user!.sub,
            email: user!.email,
            name: user!.name,
          }),
        })
        hasSynced.current = true
      } catch (error) {
        console.error('Failed to sync profile:', error)
      }
    }

    syncProfile()
  }, [isAuthenticated, user, getAccessTokenSilently])
}
