
import React from "react";
import { formatCurrency } from "@/utils/financialCalculations";
import { TableCell, TableRow } from "@/components/ui/table";
import { TransactionCategory } from "@/utils/mockData";
import CompareButton from "./CompareButton";

interface CategoryRowProps {
  category: TransactionCategory;
  amount: number;
  level: number;
  onCompare?: (categoryId: string, categoryPath: string) => void;
  categoryPath?: string;
}

const CategoryRow = ({ 
  category,
  amount,
  level,
  onCompare,
  categoryPath = category.name
}: CategoryRowProps) => {
  const paddingLeft = level * 1.5;
  
  const handleCompare = () => {
    if (onCompare) {
      console.log("Category row: calling onCompare with", category.id, categoryPath);
      onCompare(category.id, categoryPath);
    }
  };
  
  return (
    <TableRow>
      <TableCell>
        <div 
          className="flex items-center justify-between"
          style={{ paddingLeft: `${paddingLeft}rem` }}
        >
          <span>{category.name}</span>
          {onCompare && (
            <CompareButton 
              onClick={handleCompare}
              categoryId={category.id}
              categoryPath={categoryPath}
            />
          )}
        </div>
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {formatCurrency(amount)}
      </TableCell>
    </TableRow>
  );
};

export default CategoryRow;
