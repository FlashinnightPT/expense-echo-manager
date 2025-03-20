
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown } from "lucide-react";
import { formatCurrency } from "@/utils/financialCalculations";
import { cn } from "@/lib/utils";

interface CategoryRowProps {
  categoryData: any;
  level: number;
  isExpanded: boolean;
  showValues: boolean;
  hasChildren: boolean;
  onToggle: () => void;
}

const CategoryRow = ({
  categoryData,
  level,
  isExpanded,
  showValues,
  hasChildren,
  onToggle
}: CategoryRowProps) => {
  const { category, monthlyAmounts, yearlyTotal, monthlyAverage } = categoryData;
  const indentPadding = `${level * 1.5}rem`;
  
  return (
    <TableRow className={cn(
      "transition-colors hover:bg-accent/50",
      level === 0 ? "bg-muted/20" : "",
      isExpanded && hasChildren ? "border-b-0" : ""
    )}>
      <TableCell className="sticky left-0 bg-background font-medium">
        <div 
          className="flex items-center cursor-pointer" 
          style={{ paddingLeft: indentPadding }}
          onClick={onToggle}
        >
          {hasChildren ? (
            <Button variant="ghost" size="icon" className="h-6 w-6 p-0 mr-1 hover:bg-transparent">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <div className="w-6 mr-1" />
          )}
          {category.name}
        </div>
      </TableCell>
      
      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
        <TableCell key={month} className="text-right tabular-nums">
          {showValues ? formatCurrency(monthlyAmounts[month] || 0) : "•••••••"}
        </TableCell>
      ))}
      
      <TableCell className="text-right tabular-nums font-medium">
        {showValues ? formatCurrency(yearlyTotal) : "•••••••"}
      </TableCell>
      
      <TableCell className="text-right tabular-nums">
        {showValues ? formatCurrency(monthlyAverage) : "•••••••"}
      </TableCell>
    </TableRow>
  );
};

export default CategoryRow;
