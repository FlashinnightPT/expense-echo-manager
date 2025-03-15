
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

const DateSelector = ({ selectedDate, onChange }: DateSelectorProps) => {
  // Limitar ano máximo para o atual
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-2">
      <Label htmlFor="date">Data</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "MMMM yyyy", { locale: pt })
            ) : (
              <span>Selecione uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onChange(date)}
            initialFocus
            className="pointer-events-auto"
            captionLayout="dropdown-buttons"
            fromYear={2020}
            toYear={currentYear}
            defaultMonth={selectedDate}
            month={selectedDate}
            onMonthChange={onChange}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateSelector;
