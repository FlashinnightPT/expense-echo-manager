
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEventBus } from "../hooks/useEventBus";

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const years = Array.from(
  { length: 5 }, 
  (_, i) => new Date().getFullYear() - 2 + i
).map(year => year.toString());

const DateRangeSelector = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  const [startMonth, setStartMonth] = useState("0"); // January
  const [startYear, setStartYear] = useState(currentYear.toString());
  const [endMonth, setEndMonth] = useState(currentMonth.toString());
  const [endYear, setEndYear] = useState(currentYear.toString());
  
  const { publish } = useEventBus();
  
  // Calculate and publish date range whenever selections change
  useEffect(() => {
    const startDate = new Date(parseInt(startYear), parseInt(startMonth), 1);
    const endDate = new Date(parseInt(endYear), parseInt(endMonth) + 1, 0); // Last day of month
    
    console.log("Publishing date range:", { startDate, endDate });
    publish("dateRangeChanged", { startDate, endDate });
  }, [startMonth, startYear, endMonth, endYear, publish]);
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Período de Análise</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs mb-1">Início</p>
              <div className="grid grid-cols-2 gap-2">
                <Select 
                  value={startMonth} 
                  onValueChange={setStartMonth}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem key={`start-month-${index}`} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select 
                  value={startYear} 
                  onValueChange={setStartYear}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={`start-year-${year}`} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <p className="text-xs mb-1">Fim</p>
              <div className="grid grid-cols-2 gap-2">
                <Select 
                  value={endMonth} 
                  onValueChange={setEndMonth}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem key={`end-month-${index}`} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select 
                  value={endYear} 
                  onValueChange={setEndYear}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={`end-year-${year}`} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateRangeSelector;
