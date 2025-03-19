
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/financialCalculations";
import CompareButton from "@/components/dashboard/components/CompareButton";

interface SubcategoryData {
  category: {
    id: string;
    name: string;
  };
  amount: number;
  percentage: number;
}

interface SubcategoryAnalysisTableProps {
  subcategoryData: SubcategoryData[];
  totalAmount: number;
  selectedCategoryName: string;
  showValues: boolean;
}

const SubcategoryAnalysisTable = ({
  subcategoryData,
  totalAmount,
  selectedCategoryName,
  showValues
}: SubcategoryAnalysisTableProps) => {
  // Function to handle adding a category to comparison
  const handleAddToComparison = (categoryId: string, categoryPath: string) => {
    // Implementation of adding to comparison
    console.log("Adding to comparison:", categoryId, categoryPath);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">
        Análise de {selectedCategoryName}
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Subcategoria</TableHead>
            <TableHead className="text-center">Valor / Percentagem</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subcategoryData.map((item) => (
            <TableRow key={item.category.id}>
              <TableCell className="text-center">{item.category.name}</TableCell>
              <TableCell className="text-center tabular-nums">
                {showValues ? (
                  <>
                    {formatCurrency(item.amount)} 
                    <span className="text-muted-foreground ml-2">
                      ({item.percentage.toFixed(2)}%)
                    </span>
                  </>
                ) : (
                  "•••••••"
                )}
              </TableCell>
              <TableCell>
                <CompareButton 
                  onClick={() => handleAddToComparison(item.category.id, `${selectedCategoryName} > ${item.category.name}`)}
                  categoryId={item.category.id}
                  categoryPath={`${selectedCategoryName} > ${item.category.name}`}
                />
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="font-bold">
            <TableCell className="text-center">TOTAL</TableCell>
            <TableCell className="text-center tabular-nums">
              {showValues ? formatCurrency(totalAmount) : "•••••••"}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default SubcategoryAnalysisTable;
