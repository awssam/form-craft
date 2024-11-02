"use client"

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
import { GenericProps } from "@/types/common"
import React from "react"
import { SelectSingleEventHandler } from "react-day-picker"


interface DatePickerProps extends GenericProps {
  date: Date,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  setDate: Function,
  placeholder: string,
  placeHolderClasses?: string

}


export function DatePicker({ date, setDate, placeholder, placeHolderClasses,style}: DatePickerProps) {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "min-w-[128px] w-full justify-start items-center overflow-clip text-left font-normal flex p-1",
            !date && "text-muted-foreground",
          )}
          style={style}
        >
          <CalendarIcon className="mx-2 w-4 min-w-4 h-4 min-h-4" />
          {date ? format(date, "PPP") : <span className={cn("mr-2 text-sm", placeHolderClasses)}>{placeholder ?? "Pick a date"}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto">
        <Calendar
          mode={'single'}
          selected={date}
          onSelect={setDate as SelectSingleEventHandler}
          initialFocus
          
        />
      </PopoverContent>
    </Popover>
  )
}
