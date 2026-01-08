import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { API_BASE_URL } from '@/config/api'

export default function App() {
  const { auth } = useAuthStore()

  useEffect(() => {
    const token = auth.accessToken
    if (!token || auth.user) return

    fetch(`${API_BASE_URL}/Users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized')
        return res.json()
      })
      .then((data) => {
        auth.setUser({
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role ?? [],
          exp: Date.now() + 24 * 60 * 60 * 1000,
        })
      })
      .catch(() => {
        auth.reset()
      })
  }, [auth])

  return null // IMPORTANT: router renders via main.tsx
}
