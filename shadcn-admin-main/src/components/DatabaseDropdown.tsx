import  { useEffect, useState } from "react"
import axios from "axios"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DatabaseDropdownProps<T> {
  apiUrl: string
  placeholder?: string
  labelKey: keyof T
  valueKey: keyof T
  value?: string
  disabled?: boolean
  readOnly?: boolean
  onValueChange?: (value: string, item?: T) => void
}

export function DatabaseDropdown<T>({
  apiUrl,
  placeholder = "Select an option",
  labelKey,
  valueKey,
  value,
  disabled = false,
  readOnly = false,
  onValueChange,
}: DatabaseDropdownProps<T>) {
  const [options, setOptions] = useState<T[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await axios.get<T[]>(apiUrl)
        setOptions(res.data)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [apiUrl])

  const selectedItem = options.find(
    (opt) => String(opt[valueKey] as unknown) === value
  )

  return (
    <Select
      value={value}
      disabled={disabled}
      onValueChange={(val) => {
        if (readOnly) return

        const item = options.find(
          (opt) => String(opt[valueKey] as unknown) === val
        )

        onValueChange?.(val, item)
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder}>
          {loading
            ? "Loading..."
            : selectedItem
            ? String(selectedItem[labelKey] as unknown)
            : placeholder}
        </SelectValue>
      </SelectTrigger>

      {!readOnly && (
        <SelectContent>
          {options.map((opt) => (
            <SelectItem
              key={String(opt[valueKey] as unknown)}
              value={String(opt[valueKey] as unknown)}
            >
              {String(opt[labelKey] as unknown)}
            </SelectItem>
          ))}
        </SelectContent>
      )}
    </Select>
  )
}