
import { Tabs } from "@/components/ui/tabs";
import { 
  CategoryTransactionsTableProps
} from "./types/categoryTypes";
import CategoryTabContent from "./components/CategoryTabContent";
import CategoryTableHeader from "./components/CategoryTableHeader";
import { useCategoryTableData } from "./hooks/useCategoryTableData";

const CategoryTransactionsTable = ({
  transactions,
  categories,
  selectedYear,
  selectedMonth,
  onMonthChange,
  getCategoryById,
}: CategoryTransactionsTableProps) => {
  const {
    activeTab,
    setActiveTab,
    currentGroupedCategories,
    currentTotalAmount,
    handleExportData,
    handleCompareCategory
  } = useCategoryTableData(transactions, categories, selectedYear, selectedMonth);

  return (
    <div className="animate-fade-in-up animation-delay-900">
      <Tabs defaultValue="expense" onValueChange={(value) => setActiveTab(value as "expense" | "income")}>
        <CategoryTableHeader 
          selectedMonth={selectedMonth}
          onMonthChange={onMonthChange}
          onExportData={handleExportData}
          activeTab={activeTab}
        />
        
        <CategoryTabContent 
          value="expense" 
          groupedCategories={activeTab === "expense" ? currentGroupedCategories : []}
          totalAmount={activeTab === "expense" ? currentTotalAmount : 0}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onCompare={handleCompareCategory}
        />
        
        <CategoryTabContent 
          value="income" 
          groupedCategories={activeTab === "income" ? currentGroupedCategories : []}
          totalAmount={activeTab === "income" ? currentTotalAmount : 0}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onCompare={handleCompareCategory}
        />
      </Tabs>
    </div>
  );
};

export default CategoryTransactionsTable;
