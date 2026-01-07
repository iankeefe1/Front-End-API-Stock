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



/* =======================
   API Row Type
======================= */

type ProductRow = {
  productId: number
  productName: string
  counterparty : string
  productCategory: string
  price: number
  listingDate: string
}

/* =======================
   Columns Definition
======================= */

const columns: ColumnDef<ProductRow>[] = [
  {
    key: "productName",
    label: "Product Name",
    filterable: true,
    filterType: "string",
  },
  {
    key: "counterparty",
    label: "Counter Party Name",
    filterable: true,
    filterType: "string",
  },
  {
    key: "productCategory",
    label: "Category",
    filterable: true,
    filterType: "string",
  },
  {
    key: "price",
    label: "Price",
    filterable: true,
    filterType: "number",
  },
  {
    key: "listingDate",
    label: "Listing Date",
    filterable: true,
    filterType: "date",
  },
]


export function Catalogue() {
  const navigate = useNavigate()

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
            List Catalogue
          </h2>
        </div>

        {/* ✅ GENERIC DATATABLE CALLING .NET API */}
        <DataTable<ProductRow>
          endpoint={`${API_BASE_URL}/Product/GetAllProducts`}
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
                onClick={() => navigate({ to: "/catalogue/add",
                                          search: {
                                            productid: row.productId,
                                            pagestate: "view", // or "1"
                                          }, })}
              >
                View
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

        <div className="flex flex-wrap items-end justify-between gap-2">
          <Button onClick={() => navigate({ to: "/catalogue/add" })}>
            Add Transaction
          </Button>
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}
