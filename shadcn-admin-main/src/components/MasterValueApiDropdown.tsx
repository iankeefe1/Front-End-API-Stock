import React, { useEffect, useState } from "react"
import axios from "axios"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MasterValueApiDropdownProps {
  apiUrl: string
  placeholder?: string
  onValueChange?: (value: string) => void
  labelKey?: string
  valueKey?: string
  value?: string
  disabled?: boolean
  readOnly?: boolean
}

type MasterValueApiItem = Record<string, string | number>

export const MasterValueApiDropdown: React.FC<MasterValueApiDropdownProps> = ({
  apiUrl,
  placeholder = "Select an option",
  onValueChange,
  labelKey = "masterValueName",
  valueKey = "masterValueId",
  value,
  disabled = false,
  readOnly = false,
}) => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const res = await axios.get<MasterValueApiItem[]>(apiUrl)

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
  }, [apiUrl, labelKey, valueKey])

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label ?? ""

  return (
    <Select
      value={value}
      disabled={disabled}
      onValueChange={(val) => {
        if (!readOnly) {
          onValueChange?.(val)
        }
      }}     
    >
      <SelectTrigger
        className={`w-full ${readOnly ? "cursor-default" : ""}`}
        onPointerDown={(e) => {
          if (readOnly) e.preventDefault()
        }}
        onKeyDown={(e) => {
          if (readOnly) e.preventDefault()
        }}
      >
        <SelectValue placeholder={placeholder}>
          {loading ? "Loading..." : selectedLabel || placeholder}
        </SelectValue>
      </SelectTrigger>

      {!readOnly && (
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      )}
    </Select>
  )
}
