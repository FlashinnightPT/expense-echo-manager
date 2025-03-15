
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CompareButtonProps {
  onClick: () => void;
  categoryId: string;
  categoryPath: string;
}

const CompareButton = ({ onClick, categoryId, categoryPath }: CompareButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            className="h-5 w-5"
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Adicionar à comparação</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CompareButton;
