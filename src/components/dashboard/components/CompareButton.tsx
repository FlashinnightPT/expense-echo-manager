
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { GitCompare, Calendar } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { createDateRange } from "@/pages/CategoryAnalysis/utils/dateUtils";

interface CompareButtonProps {
  onClick: () => void;
  categoryId: string;
  categoryPath: string;
}

const CompareButton = ({ onClick, categoryId, categoryPath }: CompareButtonProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDateInput, setStartDateInput] = useState(`${String(new Date().getMonth() + 1).padStart(2, '0')}/${new Date().getFullYear()}`);
  const [endDateInput, setEndDateInput] = useState(`${String(new Date().getMonth() + 1).padStart(2, '0')}/${new Date().getFullYear()}`);
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    
    if (e.shiftKey) {
      // Se Shift está pressionado, abrir o seletor de datas
      setShowDatePicker(true);
    } else {
      // Caso contrário, adicionar com as datas atuais
      onClick();
    }
  };
  
  const handleCompareWithCustomDates = () => {
    try {
      // Parse the input dates
      const [startMonth, startYear] = startDateInput.split('/').map(part => parseInt(part));
      const [endMonth, endYear] = endDateInput.split('/').map(part => parseInt(part));
      
      if (isNaN(startMonth) || isNaN(startYear) || isNaN(endMonth) || isNaN(endYear)) {
        throw new Error("Formato de data inválido");
      }
      
      // Adjust month index (JavaScript months are 0-based)
      const startDateRange = createDateRange(startYear, startMonth - 1);
      const endDateRange = createDateRange(endYear, endMonth - 1);
      
      // Disparar evento com datas personalizadas
      const event = new CustomEvent("addCategoryToComparison", {
        detail: { 
          categoryId, 
          categoryPath,
          customStartDate: startDateRange.startDate,
          customEndDate: endDateRange.endDate
        }
      });
      window.dispatchEvent(event);
      
      setShowDatePicker(false);
    } catch (error) {
      console.error("Error parsing dates:", error);
      // You could add error handling here, like showing a toast
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClick}
                className="h-5 w-5"
              >
                <GitCompare className="h-3.5 w-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4">
              <div className="space-y-2">
                <h3 className="font-medium">Comparar com período personalizado</h3>
                <p className="text-sm text-muted-foreground">
                  Selecione o período para comparação
                </p>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Data inicial</h4>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      className="w-full pl-9"
                      placeholder="MM/AAAA"
                      value={startDateInput}
                      onChange={(e) => setStartDateInput(e.target.value)}
                      maxLength={7}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Data final</h4>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      className="w-full pl-9"
                      placeholder="MM/AAAA"
                      value={endDateInput}
                      onChange={(e) => setEndDateInput(e.target.value)}
                      maxLength={7}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleCompareWithCustomDates}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Comparar período
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </TooltipTrigger>
        <TooltipContent>
          <p>Adicionar à comparação (Shift+Click para período personalizado)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CompareButton;
