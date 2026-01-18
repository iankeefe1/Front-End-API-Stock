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

const OPERATOR_LABELS: Record<Operator, string> = {
  contains: "Contains",
  equals: "Equals",
  gt: "Greater than",
  lt: "Less than",
}

type Operator =
  | "contains"
  | "equals"
  | "gt"
  | "lt"

type FilterType = "string" | "number" | "date"

type FilterState = {
  operator: Operator
  value: string
}

type SortState = {
  key: string
  dir: "asc" | "desc"
} | null

export type ColumnDef<T> = {
  key: keyof T & string
  label: string
  filterable?: boolean
  filterType?: FilterType
}

type DataTableProps<T extends Record<string, unknown>> = {
  endpoint: string
  columns: ColumnDef<T>[]
  renderActions?: (row: T) => React.ReactNode // 👈 add this
}

/* =======================
   Column Filter
======================= */

function ColumnFilter({
  type,
  current,
  onSortAsc,
  onSortDesc,
  onApply,
  onClear,
}: {
  type: FilterType
  current?: FilterState
  onSortAsc: () => void
  onSortDesc: () => void
  onApply: (operator: Operator, value: string) => void
  onClear: () => void
}) {
  const operators: Operator[] =
    type === "string"
      ? ["contains", "equals"]
      : ["equals", "gt", "lt"]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64 p-3 space-y-2">
        <DropdownMenuItem onClick={onSortAsc}>
          ↑ Sort Ascending
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSortDesc}>
          ↓ Sort Descending
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <Select
          value={current?.operator ?? operators[0]}
          onValueChange={(v) =>
            onApply(v as Operator, current?.value ?? "")
          }
        >
          <SelectTrigger>
            <SelectValue>
              {current
                ? OPERATOR_LABELS[current.operator]
                : OPERATOR_LABELS[operators[0]]}
            </SelectValue>
          </SelectTrigger>

          <SelectContent>
            {operators.map((op) => (
              <SelectItem key={op} value={op}>
                {OPERATOR_LABELS[op]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type={type === "number" ? "number" : type === "date" ? "date" : "text"}
          placeholder="Value..."
          value={current?.value ?? ""}
          onChange={(e) =>
            onApply(current?.operator ?? operators[0], e.target.value)
          }
        />

        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1">
            Apply
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={onClear}
          >
            Clear
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


/* =======================
   DataTable
======================= */

export function DataTable<T extends Record<string, unknown>>({
  endpoint,
  columns,
  renderActions, // 👈 ADD THIS
}: DataTableProps<T>) {
  const [data, setData] = React.useState<T[]>([])
  const [filters, setFilters] = React.useState<Record<string, FilterState>>({})
  const [sort, setSort] = React.useState<SortState>(null)
  const [pageSize, setPageSize] = React.useState(10)
  const [loading, setLoading] = React.useState(false)

  const fetchData = React.useCallback(async () => {
    setLoading(true)

    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, f]) => {
      if (f.value) {
        params.append("column", key)
        params.append("operator", f.operator)
        params.append("value", f.value)
      }
    })

    if (sort) {
      params.append("orderBy", sort.key)
      params.append("orderDir", sort.dir)
    }

    const url = new URL(endpoint, window.location.origin)

// append filters
    Object.entries(filters).forEach(([key, f]) => {
      if (f.value) {
        url.searchParams.append("column", key)
        url.searchParams.append("operator", f.operator)
        url.searchParams.append("value", f.value)
      }
    })

    // append sorting
    if (sort) {
      url.searchParams.append("orderBy", sort.key)
      url.searchParams.append("orderDir", sort.dir)
    }

    const res = await fetch(url.toString())
    const json = await res.json()

    setData(Array.isArray(json) ? json : [])
    setLoading(false)
  }, [endpoint, filters, sort])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.filterable && (
                    <ColumnFilter
                      type={col.filterType ?? "string"}
                      current={filters[col.key]}
                      onSortAsc={() =>
                        setSort({ key: col.key, dir: "asc" })
                      }
                      onSortDesc={() =>
                        setSort({ key: col.key, dir: "desc" })
                      }
                      onApply={(op, val) =>
                        setFilters((f) => ({
                          ...f,
                          [col.key]: { operator: op, value: val },
                        }))
                      }
                      onClear={() =>
                        setFilters((f) => {
                          const copy = { ...f }
                          delete copy[col.key]
                          return copy
                        })
                      }
                    />
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            data.slice(0, pageSize).map((row, i) => (
              <TableRow key={i}>
                {columns.map((col) => {
                 const rawValue = row[col.key] as unknown;
                  let displayValue: string = "";

                  if (col.filterType === "date" && rawValue) {
                    const date = new Date(rawValue as string);
                    displayValue = date.toLocaleDateString("en-GB").replace(/\//g, "-");
                  } else {
                    displayValue = String(rawValue ?? "");
                  }
                  return (
                    <TableCell key={col.key}>
                      {displayValue}
                    </TableCell>
                  );
                })}
                 {/* ✅ Actions column */}
                <TableCell className="text-right">
                  {renderActions ? renderActions(row) : null}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>

        <TableFooter className="bg-muted/50">
          <TableRow>
             {/* 👇 Add +1 if you have an Actions column */}
              <TableCell colSpan={columns.length + 1} className="p-0">
                <div className="flex justify-between items-center px-4 py-3 w-full bg-muted/30">
                  <span className="text-sm text-muted-foreground">
                    Total {Math.min(pageSize, data.length)} of {pageSize} rows
                  </span>

                <Select
                  value={String(pageSize)}
                  onValueChange={(v) =>
                    setPageSize(Number(v))
                  }
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 25, 50, 100].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        Top {n} rows
                      </SelectItem>
                    ))}
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
