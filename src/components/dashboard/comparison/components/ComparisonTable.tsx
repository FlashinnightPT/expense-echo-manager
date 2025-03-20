
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
  showValues: boolean;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ 
  comparisonData, 
  totalAmount, 
  onRemoveCategory,
  showValues
}) => {
  if (!comparisonData || comparisonData.length === 0) return null;

  const formatDateRange = (item: any) => {
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
            <TableHead className="text-center">Valor / Percentagem</TableHead>
            <TableHead className="text-center">Período</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comparisonData.map((item) => {
            const percentage = totalAmount > 0 ? ((item.amount / totalAmount) * 100).toFixed(2) : "0.00";
            
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium text-left">
                  {item.path.split(" (")[0]} {/* Remove date range suffix if present */}
                </TableCell>
                <TableCell className="text-center tabular-nums">
                  {showValues ? (
                    <>
                      {formatCurrency(item.amount)}
                      <span className="text-muted-foreground ml-2">
                        ({percentage}%)
                      </span>
                    </>
                  ) : hiddenValue}
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
                    onClick={() => onRemoveCategory(item.id)}
                    title="Remover categoria"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow className="font-bold">
            <TableCell className="text-left">TOTAL</TableCell>
            <TableCell className="text-center tabular-nums">
              {showValues ? formatCurrency(totalAmount) : hiddenValue}
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
