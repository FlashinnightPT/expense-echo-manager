
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

interface ComparisonTableProps {
  comparisonData: {
    id: string;
    name: string;
    path: string;
    amount: number;
    dateRange?: {
      start: Date;
      end: Date;
    };
  }[];
  totalAmount: number;
  onRemoveCategory: (categoryId: string) => void;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ 
  comparisonData, 
  totalAmount, 
  onRemoveCategory 
}) => {
  if (!comparisonData || comparisonData.length === 0) return null;

  const formatDateRange = (item: any) => {
    if (!item.dateRange) return "-";
    
    const { start, end } = item.dateRange;
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Categoria</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead className="text-right">% do Total</TableHead>
          <TableHead>Período</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {comparisonData.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">
              {item.path.split(" (")[0]} {/* Remove date range suffix if present */}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCurrency(item.amount)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {totalAmount > 0 ? ((item.amount / totalAmount) * 100).toFixed(2) : 0}%
            </TableCell>
            <TableCell className="text-sm">
              {formatDateRange(item)}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveCategory(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
        <TableRow className="font-bold">
          <TableCell>TOTAL</TableCell>
          <TableCell className="text-right tabular-nums">
            {formatCurrency(totalAmount)}
          </TableCell>
          <TableCell className="text-right tabular-nums">100%</TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default ComparisonTable;
