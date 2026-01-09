import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Main } from '@/components/layout/main'
import { LayoutProvider  } from '@/context/layout-provider'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()

    if (!auth.accessToken) {
      throw redirect({ to: '/sign-in' })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <SidebarProvider defaultOpen>
      <LayoutProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <Main>
            <Outlet />
          </Main>
        </div>
      </LayoutProvider>
    </SidebarProvider>
  )
}
