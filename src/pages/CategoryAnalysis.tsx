import React, { useState, useEffect } from "react";
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
import CategoryComparison from "@/components/dashboard/comparison/CategoryComparison";
import Header from "@/components/layout/Header";

const CategoryAnalysis = () => {
  // State for showing/hiding values
  const [showValues, setShowValues] = useState(() => {
    const savedPreference = sessionStorage.getItem("showFinancialValues");
    return savedPreference ? savedPreference === "true" : false;
  });

  // Add state for other variables referenced in the component
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [subcategoryData, setSubcategoryData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");

  // Toggle function for showing/hiding values
  const toggleShowValues = () => {
    const newValue = !showValues;
    setShowValues(newValue);
    sessionStorage.setItem("showFinancialValues", String(newValue));
  };

  // Function to handle adding a category to comparison
  const handleAddToComparison = (categoryId, categoryPath) => {
    // Implementation of adding to comparison
    console.log("Adding to comparison:", categoryId, categoryPath);
  };

  // Render the component
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-4">
        {/* Toggle button for showing/hiding values */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleShowValues}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            {showValues ? "Ocultar Valores" : "Mostrar Valores"}
          </button>
        </div>

        {/* Table */}
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

        {/* Category Comparison Section */}
        <CategoryComparison 
          categories={categories}
          transactions={transactions}
          startDate={startDate}
          endDate={endDate}
          activeTab={activeTab}
          showValues={showValues}
        />
      </main>
    </div>
  );
};

export default CategoryAnalysis;
