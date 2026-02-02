import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { API_BASE_URL } from '@/config/api'

export default function App() {
  const { auth } = useAuthStore()

  // restore user from token
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
          userID: data.userID,
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role ?? [],
          exp: Date.now() + 30 * 60 * 1000,
        })
      })
      .catch(() => {
        auth.reset()
      })
  }, [auth])

  // ✅ AUTO LOGOUT WHEN EXP EXPIRES
  useEffect(() => {
    const checkSession = () => {
      const user = auth.user
      if (user && Date.now() > user.exp) {
        auth.reset()
        window.location.href = "/login"
      }
    }

    checkSession()
    const interval = setInterval(checkSession, 10000)

    return () => clearInterval(interval)
  }, [auth])

  return null
}
