import { Link } from '@tanstack/react-router'
import { MoreVertical } from 'lucide-react'
import useDialogState from '@/hooks/use-dialog-state'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOutDialog } from '@/components/sign-out-dialog'

export function ProfileDropdown() {
  const [open, setOpen] = useDialogState()
  const { auth } = useAuthStore()

  const user = auth.user
  
  // eslint-disable-next-line no-console
  console.log('AUTH USER:', user)

  return (
    <>
      <div className="flex items-center gap-3 px-3 py-2">
        {/* 3-dot button */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuItem asChild>
              <Link to="/settings">Profile</Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={() => setOpen(true)}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User info (always visible) */}
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-medium">
            {user?.firstName} {user?.lastName}
          </span>
          {/* <span className="text-xs text-muted-foreground">
            {user?.email}
          </span> */}
        </div>
      </div>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
