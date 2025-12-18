import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
// import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TasksDialogs } from './components/tasks-dialogs'
// import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import { TasksProvider } from './components/tasks-provider'
// import { TasksTable } from './components/tasks-table'
// import { tasks } from './data/tasks'
import { Approval } from './components/approval'

export function HistoryApproval() {
  return (
    <TasksProvider>
      <Header fixed>
        {/* <Search /> */}
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Approval History</h2>
          </div>
          {/* <TasksPrimaryButtons /> */}
        </div>
        <Approval></Approval>
      </Main>
      <TasksDialogs />
    </TasksProvider>
  )
}
