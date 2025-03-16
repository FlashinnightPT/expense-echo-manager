
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
import { createDateRange } from "@/pages/CategoryAnalysis/utils/dateUtils";

interface CompareButtonProps {
  onClick: () => void;
  categoryId: string;
  categoryPath: string;
}

const CompareButton = ({ onClick, categoryId, categoryPath }: CompareButtonProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedStartMonth, setSelectedStartMonth] = useState<number>(new Date().getMonth());
  const [selectedStartYear, setSelectedStartYear] = useState<number>(new Date().getFullYear());
  const [selectedEndMonth, setSelectedEndMonth] = useState<number>(new Date().getMonth());
  const [selectedEndYear, setSelectedEndYear] = useState<number>(new Date().getFullYear());
  
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
    // Criar objetos de data a partir dos valores de mês e ano selecionados
    const startDateRange = createDateRange(selectedStartYear, selectedStartMonth);
    const endDateRange = createDateRange(selectedEndYear, selectedEndMonth);
    
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
  };

  // Função para lidar com a alteração da data inicial
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length >= 7) {
      const [month, year] = value.split('/');
      if (month && year) {
        setSelectedStartMonth(parseInt(month) - 1); // Ajuste para base 0 dos meses
        setSelectedStartYear(parseInt(year));
      }
    }
  };

  // Função para lidar com a alteração da data final
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length >= 7) {
      const [month, year] = value.split('/');
      if (month && year) {
        setSelectedEndMonth(parseInt(month) - 1); // Ajuste para base 0 dos meses
        setSelectedEndYear(parseInt(year));
      }
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
                    <input
                      type="text"
                      className="w-full pl-9 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      placeholder="MM/AAAA"
                      value={`${String(selectedStartMonth + 1).padStart(2, '0')}/${selectedStartYear}`}
                      onChange={handleStartDateChange}
                      maxLength={7}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Data final</h4>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      className="w-full pl-9 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      placeholder="MM/AAAA"
                      value={`${String(selectedEndMonth + 1).padStart(2, '0')}/${selectedEndYear}`}
                      onChange={handleEndDateChange}
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
