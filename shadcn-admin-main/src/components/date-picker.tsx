import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = {
  selected?: Date
  onSelect: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  readOnly?: boolean
}

export function DatePicker({
  selected,
  onSelect,
  placeholder = "Pick a date",
  className,
  disabled = false,
  readOnly = false,
}: DatePickerProps) {
  const isBlocked = disabled || readOnly

  return (
    <Popover open={!isBlocked ? undefined : false}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          data-empty={!selected}
          className={cn(
            "w-full h-10 justify-start text-left font-normal",
            "data-[empty=true]:text-muted-foreground",
            readOnly && "cursor-default bg-muted text-muted-foreground",
            className
          )}
          onPointerDown={(e) => {
            if (readOnly) e.preventDefault()
          }}
          onKeyDown={(e) => {
            if (readOnly) e.preventDefault()
          }}
        >
          {selected ? (
            format(selected, "dd-MM-yyyy")
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      {!isBlocked && (
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            selected={selected}
            onSelect={onSelect}
            // disabled={(date) =>
            //   date > new Date() || date < new Date("1900-01-01")
            // }
            initialFocus
          />
        </PopoverContent>
      )}
    </Popover>
  )
}
