
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FixedExpenseCheckboxProps {
  isFixedExpense: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

const FixedExpenseCheckbox = ({ isFixedExpense, onToggle, disabled = false }: FixedExpenseCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id="fixed-expense" 
        checked={isFixedExpense} 
        onCheckedChange={onToggle}
        disabled={disabled}
      />
      <Label htmlFor="fixed-expense" className="text-sm font-normal cursor-pointer">
        É uma despesa fixa?
      </Label>
    </div>
  );
};

export default FixedExpenseCheckbox;
