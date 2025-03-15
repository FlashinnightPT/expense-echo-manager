
import { useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format, parse } from "date-fns";
import { pt } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

const DateSelector = ({ selectedDate, onChange }: DateSelectorProps) => {
  const [inputValue, setInputValue] = useState(format(selectedDate, "MM/yyyy"));
  
  // Update input value when selectedDate changes
  useEffect(() => {
    setInputValue(format(selectedDate, "MM/yyyy"));
  }, [selectedDate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    // Format with slash after first 2 digits
    let formattedValue = digitsOnly;
    if (digitsOnly.length > 2) {
      formattedValue = digitsOnly.substring(0, 2) + '/' + digitsOnly.substring(2);
    }
    
    setInputValue(formattedValue);
    
    // Only try to parse if we have the expected MM/yyyy format (6 digits total)
    if (digitsOnly.length === 6 && /^\d{2}\/\d{4}$/.test(formattedValue)) {
      try {
        const parsedDate = parse(formattedValue, "MM/yyyy", new Date());
        // Check if parsing was successful and date is valid
        if (!isNaN(parsedDate.getTime())) {
          onChange(parsedDate);
        }
      } catch (error) {
        // Invalid date format, don't update
        console.error("Invalid date format", error);
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="date">Data</Label>
      <div className="relative">
        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="date"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="MM/AAAA"
          className="pl-9"
          maxLength={7}
        />
      </div>
    </div>
  );
};

export default DateSelector;
