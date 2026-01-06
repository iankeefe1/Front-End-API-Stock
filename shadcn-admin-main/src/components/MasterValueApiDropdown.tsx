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
  labelKey?: string     // default: "masterValue"
  valueKey?: string     // default: "masterValueId"
  value?: string        // controlled value
}

export const MasterValueApiDropdown: React.FC<MasterValueApiDropdownProps> = ({
  apiUrl,
  placeholder = "Select an option",
  onValueChange,
  labelKey = "masterValueName",
  valueKey = "masterValueId",
  value,
}) => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([])
  const [selectedLabel, setSelectedLabel] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await axios.get(apiUrl)
        const data = res.data

        const mapped = data.map((item: any) => ({
          value: String(item[valueKey]),
          label: item[labelKey],
        }))

        setOptions(mapped)
      } catch (err) {
        console.error("Failed to fetch MasterValue dropdown data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [apiUrl, labelKey, valueKey])

  // Update label when value changes
  useEffect(() => {
    const selected = options.find((opt) => opt.value === value)
    setSelectedLabel(selected ? selected.label : "")
  }, [value, options])

  return (
    <Select
      value={value}
      onValueChange={(val) => {
        if (onValueChange) onValueChange(val)
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder}>
          {loading ? "Loading..." : selectedLabel || placeholder}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
