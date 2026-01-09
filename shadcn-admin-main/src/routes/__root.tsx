import { createRootRoute, Outlet, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createRootRoute({
  component: Root,
})

function Root() {
  const router = useRouter()
  const { auth } = useAuthStore()

  useEffect(() => {
    const handler = () => {
      const hasToken = document.cookie.includes('access_token=')

      if (!hasToken) {
        auth.reset()
        router.navigate({ to: '/sign-in', replace: true })
      }
    }

    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  return <Outlet />
}
