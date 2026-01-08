import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { getMe } from '@/lib/api/auth'

export const Route = createRootRoute({
  component: () => <Outlet />,
})

function RootComponent() {
  const { auth } = useAuthStore()

  useEffect(() => {
    if (!auth.accessToken || auth.user) return

    getMe(auth.accessToken)
      .then((user) => {
        auth.setUser({
          accountNo: String(user.userID),
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role ?? [],
          exp: Date.now() + 1000 * 60 * 60,
        })
      })
      .catch(() => {
        auth.reset()
      })
  }, [auth])

  return (
    <>
      {/* THIS IS REQUIRED */}
      <Outlet />
    </>
  )
}
