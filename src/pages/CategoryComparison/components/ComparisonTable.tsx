
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar } from "lucide-react";
import { formatCurrency } from "@/utils/financialCalculations";
import { ComparisonItem } from "@/components/dashboard/comparison/utils/comparisonDataUtils";

interface ComparisonTableProps {
  comparisonItems: ComparisonItem[];
  totalAmount: number;
  onRemoveItem: (itemId: string) => void;
  showValues: boolean;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ 
  comparisonItems, 
  totalAmount, 
  onRemoveItem,
  showValues
}) => {
  const formatDateRange = (item: ComparisonItem) => {
    if (!item.dateRange) return "-";
    
    const { start, end } = item.dateRange;
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const hiddenValue = "•••••••";

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Categoria</TableHead>
            <TableHead className="text-center">Valor</TableHead>
            <TableHead className="text-center">Percentagem</TableHead>
            <TableHead className="text-center">Período</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comparisonItems.map((item) => {
            const percentage = totalAmount > 0 ? ((item.amount / totalAmount) * 100).toFixed(2) : "0.00";
            
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.path.split(" (")[0]} {/* Remove date range suffix if present */}
                </TableCell>
                <TableCell className="text-center tabular-nums">
                  {showValues ? formatCurrency(item.amount) : hiddenValue}
                </TableCell>
                <TableCell className="text-center">
                  {showValues ? `${percentage}%` : hiddenValue}
                </TableCell>
                <TableCell className="text-sm text-center">
                  <span className="inline-flex items-center">
                    <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                    {formatDateRange(item)}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow className="font-bold">
            <TableCell>TOTAL</TableCell>
            <TableCell className="text-center tabular-nums">
              {showValues ? formatCurrency(totalAmount) : hiddenValue}
            </TableCell>
            <TableCell className="text-center">
              {showValues ? "100%" : hiddenValue}
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default ComparisonTable;
