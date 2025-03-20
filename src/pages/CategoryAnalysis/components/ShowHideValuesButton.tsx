
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface ShowHideValuesButtonProps {
  showValues?: boolean;
  toggleShowValues?: () => void;
  className?: string;
}

const ShowHideValuesButton = ({ 
  showValues: propShowValues,
  toggleShowValues: propToggleShowValues,
  className = "" 
}: ShowHideValuesButtonProps) => {
  // Internal state if props are not provided
  const [internalShowValues, setInternalShowValues] = useState(false);

  // Use props if provided, otherwise use internal state
  const showValues = propShowValues !== undefined ? propShowValues : internalShowValues;

  // Initialize from sessionStorage when component mounts
  useEffect(() => {
    if (propShowValues === undefined) {
      const savedPreference = sessionStorage.getItem('showFinancialValues');
      if (savedPreference) {
        setInternalShowValues(savedPreference === 'true');
      }
    }
  }, [propShowValues]);

  // Use provided toggle function or internal one
  const toggleShowValues = propToggleShowValues || (() => {
    const newValue = !internalShowValues;
    setInternalShowValues(newValue);
    sessionStorage.setItem('showFinancialValues', String(newValue));
  });

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleShowValues}
      className={`gap-2 ${className}`}
    >
      {showValues ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      {showValues ? "Ocultar valores" : "Mostrar valores"}
    </Button>
  );
};

export default ShowHideValuesButton;
