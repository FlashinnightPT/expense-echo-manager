
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { getMonthName } from "@/utils/financialCalculations";
import { TabsContent } from "@/components/ui/tabs";
import CategoryTable from "./CategoryTable";
import { RootCategoryItem } from "../types/categoryTypes";

interface CategoryTabContentProps {
  value: "expense" | "income";
  groupedCategories: RootCategoryItem[];
  totalAmount: number;
  selectedMonth: number;
  selectedYear: number;
}

const CategoryTabContent = ({
  value,
  groupedCategories,
  totalAmount,
  selectedMonth,
  selectedYear,
}: CategoryTabContentProps) => {
  const typeLabel = value === "expense" ? "Despesas" : "Receitas";
  const emptyMessage = value === "expense" 
    ? "Não há despesas registradas para este mês" 
    : "Não há receitas registradas para este mês";

  return (
    <TabsContent value={value} className="m-0">
      <Card className="animate-fade-in-up animation-delay-1000 glass">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            {typeLabel} por Categoria ({getMonthName(selectedMonth)} {selectedYear})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryTable 
            groupedCategories={groupedCategories}
            totalAmount={totalAmount}
            showEmptyMessage={emptyMessage}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default CategoryTabContent;
