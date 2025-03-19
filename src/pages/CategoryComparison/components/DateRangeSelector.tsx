
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEventBus } from "../hooks/useEventBus";

const DateRangeSelector = () => {
  // Get current year and previous 5 years
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);
  
  // Get all months
  const months = [
    { value: "0", label: "Janeiro" },
    { value: "1", label: "Fevereiro" },
    { value: "2", label: "Março" },
    { value: "3", label: "Abril" },
    { value: "4", label: "Maio" },
    { value: "5", label: "Junho" },
    { value: "6", label: "Julho" },
    { value: "7", label: "Agosto" },
    { value: "8", label: "Setembro" },
    { value: "9", label: "Outubro" },
    { value: "10", label: "Novembro" },
    { value: "11", label: "Dezembro" }
  ];
  
  // State for date range
  const [startYear, setStartYear] = useState<number>(currentYear);
  const [startMonth, setStartMonth] = useState<number>(0);
  const [endYear, setEndYear] = useState<number>(currentYear);
  const [endMonth, setEndMonth] = useState<number>(new Date().getMonth());
  
  // Get event bus for publishing date range changes
  const { publish } = useEventBus();
  
  // Update date range and notify subscribers
  const updateDateRange = () => {
    const startDate = new Date(startYear, startMonth, 1);
    const endDate = new Date(endYear, endMonth + 1, 0); // Last day of month
    
    publish("dateRangeChanged", { startDate, endDate });
  };
  
  // Effect to update date range when any component changes
  React.useEffect(() => {
    updateDateRange();
  }, [startYear, startMonth, endYear, endMonth]);

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Período de Análise</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="start-month">Início</Label>
          <div className="flex space-x-2">
            <Select 
              value={startMonth.toString()} 
              onValueChange={(value) => setStartMonth(parseInt(value))}
            >
              <SelectTrigger id="start-month" className="w-full">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={`start-${month.value}`} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={startYear.toString()} 
              onValueChange={(value) => setStartYear(parseInt(value))}
            >
              <SelectTrigger id="start-year" className="w-24">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={`start-${year}`} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="end-month">Fim</Label>
          <div className="flex space-x-2">
            <Select 
              value={endMonth.toString()} 
              onValueChange={(value) => setEndMonth(parseInt(value))}
            >
              <SelectTrigger id="end-month" className="w-full">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={`end-${month.value}`} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={endYear.toString()} 
              onValueChange={(value) => setEndYear(parseInt(value))}
            >
              <SelectTrigger id="end-year" className="w-24">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={`end-${year}`} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangeSelector;
