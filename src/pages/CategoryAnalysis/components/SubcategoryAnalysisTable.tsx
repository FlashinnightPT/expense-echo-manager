
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
            <TableHead>Subcategoria</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="text-right">% do Total</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subcategoryData.map((item) => (
            <TableRow key={item.category.id}>
              <TableCell>{item.category.name}</TableCell>
              <TableCell className="text-right tabular-nums">
                {showValues ? formatCurrency(item.amount) : "•••••••"}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {showValues ? `${item.percentage.toFixed(2)}%` : "•••••••"}
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
            <TableCell>TOTAL</TableCell>
            <TableCell className="text-right tabular-nums">
              {showValues ? formatCurrency(totalAmount) : "•••••••"}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {showValues ? "100%" : "•••••••"}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default SubcategoryAnalysisTable;
