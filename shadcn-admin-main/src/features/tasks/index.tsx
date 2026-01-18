import { useNavigate } from "@tanstack/react-router"
import { API_BASE_URL} from "@/config/api"
import { ConfigDrawer } from "@/components/config-drawer"
import { Header } from "@/components/layout/header"
import { Main } from "@/components/layout/main"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { ThemeSwitch } from "@/components/theme-switch"
import { TasksDialogs } from "./components/tasks-dialogs"
import { TasksProvider } from "./components/tasks-provider"
// import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

import { DataTable, type ColumnDef } from "@/components/datatable"
import { useAuthStore } from '@/stores/auth-store'



/* =======================
   API Row Type
======================= */

type ProductRow = {
  approvalid: number
  transactiontype: string
  transactioncode : string
  requester: string
  step : string
  workflowurl : string
}

/* =======================
   Columns Definition
======================= */

const columns: ColumnDef<ProductRow>[] = [
  {
    key: "transactiontype",
    label: "Transaction Type",
    filterable: true,
    filterType: "string",
  },
  {
    key: "transactioncode",
    label: "Transaction Number",
    filterable: true,
    filterType: "string",
  },
  {
    key: "requester",
    label: "Requester",
    filterable: true,
    filterType: "string",
  },
  {
    key: "step",
    label: "Step",
    filterable: true,
    filterType: "string",
  }
]

export function Tasks() {
  const navigate = useNavigate()
  const { auth } = useAuthStore()
  const user = auth.user
  return (
    <TasksProvider>
          <Header fixed>
            <div className="ms-auto flex items-center space-x-4">
              <ThemeSwitch />
              <ConfigDrawer />
              <ProfileDropdown />
            </div>
          </Header>
    
          <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Inbox
              </h2>
            </div>
    
            {/* ✅ GENERIC DATATABLE CALLING .NET API */}
            <DataTable<ProductRow>
              endpoint={`${API_BASE_URL}/Approval/GetAllInbox/${user?.userID}`}
              columns={columns}
              renderActions={(row) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
    
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
    
                  {/* ✅ View always available */}
                  <DropdownMenuItem
                    onClick={() =>
                      navigate({
                        from: '/', // ✅ FORCE ROOT CONTEXT
                        to: row.workflowurl, // "/catalogue/add"
                        search: {
                          approvalid: row.approvalid,
                          pagestate: 'approval',
                        },
                      })
                    }
                  >
                    Approve / Reject
                  </DropdownMenuItem>
    
                  {/* ✅ Only show Edit for special data */}
                  {/* {row.price > 100 && ( // 🧠 Example condition: only expensive items are editable
                    <DropdownMenuItem
                      onClick={() => alert(`Edit Product ID: ${row.productId}`)}
                    >
                      Edit
                    </DropdownMenuItem>
                  )} */}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            />
    
            {/* <div className="flex flex-wrap items-end justify-between gap-2">
              <Button onClick={() => navigate({ to: "/catalogue/add" })}>
                Add Transaction
              </Button>
            </div> */}
          </Main>
    
          <TasksDialogs />
        </TasksProvider>
  )
}
