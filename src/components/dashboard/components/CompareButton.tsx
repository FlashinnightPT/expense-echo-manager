
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
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { pt } from "date-fns/locale";

interface CompareButtonProps {
  onClick: () => void;
  categoryId: string;
  categoryPath: string;
}

const CompareButton = ({ onClick, categoryId, categoryPath }: CompareButtonProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
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
    if (!startDate || !endDate) {
      return;
    }
    
    // Disparar evento com datas personalizadas
    const event = new CustomEvent("addCategoryToComparison", {
      detail: { 
        categoryId, 
        categoryPath,
        customStartDate: startDate,
        customEndDate: endDate
      }
    });
    window.dispatchEvent(event);
    
    setShowDatePicker(false);
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
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    locale={pt}
                    initialFocus
                  />
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Data final</h4>
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    locale={pt}
                    initialFocus
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleCompareWithCustomDates}
                    disabled={!startDate || !endDate}
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
