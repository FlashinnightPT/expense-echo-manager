
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FixedExpenseCheckboxProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const FixedExpenseCheckbox = ({ isChecked, onChange, disabled = false }: FixedExpenseCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id="fixed-expense" 
        checked={isChecked} 
        onCheckedChange={onChange}
        disabled={disabled}
      />
      <Label htmlFor="fixed-expense" className="text-sm font-normal cursor-pointer">
        É uma despesa fixa?
      </Label>
    </div>
  );
};

export default FixedExpenseCheckbox;
