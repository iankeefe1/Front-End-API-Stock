import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDown } from "lucide-react"

/* =======================
   Types
======================= */

type Row = {
  transaction: string
  transactionnumber: string
  date: number
  requester: "Open" | "Filled" | "Rejected"
}

type FilterState = {
  operator: "contains" | "equals"
  value: string
}

type Filters = Partial<Record<keyof Row, FilterState>>

type SortState = {
  key: keyof Row
  dir: "asc" | "desc"
} | null

type ColumnFilterProps = {
  current?: FilterState
  onSortAsc: () => void
  onSortDesc: () => void
  onApply: (operator: FilterState["operator"], value: string) => void
  onClear: () => void
}

/* =======================
   Data
======================= */

const DATA: Row[] = [
  { transaction: "NextGen Trust", transactionnumber: "Gold", date: 820.4, requester: "Open" },
  { transaction: "NextGen Finance", transactionnumber: "Stock", date: 807.38, requester: "Rejected" },
  { transaction: "NextGen Holdings", transactionnumber: "Crypto", date: 799.12, requester: "Filled" },
  { transaction: "NextGen Enterprises", transactionnumber: "Bond", date: 761.55, requester: "Filled" },
  { transaction: "NextGen Alpha", transactionnumber: "Stock", date: 900.12, requester: "Open" },
  { transaction: "NextGen Beta", transactionnumber: "Crypto", date: 1020.55, requester: "Filled" },
]

const COLUMN_LABELS: Record<keyof Row, string> = {
  transaction: "Transaction",
  transactionnumber: "Transaction Number",
  date: "Transaction Date",
  requester: "Requester",
}

/* =======================
   Column Filter
======================= */

function ColumnFilter({
  current,
  onSortAsc,
  onSortDesc,
  onApply,
  onClear,
}: ColumnFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 focus:bg-white/20"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64 p-3 space-y-2">
        <DropdownMenuItem onClick={onSortAsc}>↑ Sort Ascending</DropdownMenuItem>
        <DropdownMenuItem onClick={onSortDesc}>↓ Sort Descending</DropdownMenuItem>
        <DropdownMenuSeparator />

        <Select
          value={current?.operator ?? "contains"}
          onValueChange={(v: FilterState["operator"]) =>
            onApply(v, current?.value ?? "")
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="contains">Contains</SelectItem>
            <SelectItem value="equals">Equals</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Value..."
          value={current?.value ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onApply(current?.operator ?? "contains", e.target.value)
          }
        />

        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1">
            Apply
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={onClear}>
            Clear
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* =======================
   App
======================= */

export function Approval() {
  const [filters, setFilters] = React.useState<Filters>({})
  const [sort, setSort] = React.useState<SortState>(null)
  const [pageSize, setPageSize] = React.useState<number>(5)

  const applyFilter = (
    key: keyof Row,
    operator: FilterState["operator"],
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [key]: { operator, value } }))
  }

  const clearFilter = (key: keyof Row) => {
    setFilters((prev) => {
      const copy = { ...prev }
      delete copy[key]
      return copy
    })
  }

  const filteredData = React.useMemo<Row[]>(() => {
    let result = [...DATA]

    Object.entries(filters).forEach(([key, filter]) => {
      if (!filter) return
      const typedKey = key as keyof Row
      result = result.filter((row) => {
        const cell = String(row[typedKey]).toLowerCase()
        const val = filter.value.toLowerCase()
        return filter.operator === "contains"
          ? cell.includes(val)
          : cell === val
      })
    })

    if (sort) {
      result.sort((a, b) => {
        const aVal = a[sort.key]
        const bVal = b[sort.key]
        if (aVal < bVal) return sort.dir === "asc" ? -1 : 1
        if (aVal > bVal) return sort.dir === "asc" ? 1 : -1
        return 0
      })
    }

    return result.slice(0, pageSize)
  }, [filters, sort, pageSize])

  const columns: (keyof Row)[] = ["transaction", "transactionnumber", "date", "requester"]

  return (
    <div className="p-6">
      <Table>
        <TableHeader>
          <TableRow className="bg-black hover:bg-black">
            {columns.map((col) => (
              <TableHead key={col} className="text-white hover:text-white">
                <div className="flex items-center gap-1 capitalize">
                  {COLUMN_LABELS[col]}
                  <ColumnFilter
                    current={filters[col]}
                    onSortAsc={() => setSort({ key: col, dir: "asc" })}
                    onSortDesc={() => setSort({ key: col, dir: "desc" })}
                    onApply={(op, val) => applyFilter(col, op, val)}
                    onClear={() => clearFilter(col)}
                  />
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredData.map((row, i) => (
            <TableRow key={i}>
              <TableCell>{row.transaction}</TableCell>
              <TableCell>{row.transactionnumber}</TableCell>
              <TableCell>${row.date.toFixed(2)}</TableCell>
              <TableCell>{row.requester}</TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Showing top {pageSize} rows
                </span>

                <Select
                  value={String(pageSize)}
                  onValueChange={(v: string) => setPageSize(Number(v))}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Top 5 rows</SelectItem>
                    <SelectItem value="10">Top 10 rows</SelectItem>
                    <SelectItem value="25">Top 25 rows</SelectItem>
                    <SelectItem value="50">Top 50 rows</SelectItem>
                    <SelectItem value="100">Top 100 rows</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
