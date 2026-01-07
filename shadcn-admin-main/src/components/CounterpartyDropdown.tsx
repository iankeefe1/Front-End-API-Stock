import { useEffect, useState } from "react"
import axios from "axios"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"

type DropdownOption = {
  value: string
  label: string
}

interface CounterpartyDropdownProps {
  apiUrl: string
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean

  // 👇 allow API mapping flexibility (optional)
  valueKey?: string        // default: "counterpartyID"
  labelKey?: string        // default: "counterpartyName"
}

type ApiItem = Record<string, string | number>

export function CounterpartyDropdown({
  apiUrl,
  value,
  onChange,
//   placeholder = "Select Counterparty",
  disabled = false,
  readOnly = false,
  valueKey = "counterpartyID",
  labelKey = "counterpartyName",
}: CounterpartyDropdownProps) {
  const [options, setOptions] = useState<DropdownOption[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const res = await axios.get<ApiItem[]>(apiUrl)

        const mapped = res.data.map((item) => ({
          value: String(item[valueKey]),
          label: String(item[labelKey]),
        }))

        setOptions(mapped)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [apiUrl, valueKey, labelKey])

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? ""

  const isBlocked = disabled || readOnly

  return (
    <Popover open={isBlocked ? false : open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
            variant="outline"
            role="combobox"
            className={cn(
                "w-full justify-between",
                !value && "text-muted-foreground",
                readOnly && "cursor-default bg-muted"
            )}
            disabled={disabled}
            onPointerDown={(e) => readOnly && e.preventDefault()}
            >
            {loading
                ? "Loading..."
                : selectedLabel || "Select Counterparty"}

            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      {!isBlocked && (
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search counterparty..." />
            <CommandEmpty>No result found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  )
}
