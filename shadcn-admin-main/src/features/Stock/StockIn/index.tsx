import { useNavigate } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { TasksDialogs } from '../components/tasks-dialogs'
import { TasksProvider } from '../components/tasks-provider'
import { Approval } from '@/features/dashboard/components/approval'
import { Button } from '@/components/ui/button'

export function StockIn() {
  const navigate = useNavigate()

  return (
    <TasksProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <h2 className='text-2xl font-bold tracking-tight'>Stock In List</h2>
        </div>

        <Approval />

        <div className='flex flex-wrap items-end justify-between gap-2'>
          <Button onClick={() => navigate({ to: '/Stock/StockIn/Add' })}>
            Add Transaction
          </Button>
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}