
import { useCategoryTableData } from "./hooks/useCategoryTableData";
import { useCategoryExpansion } from "./hooks/useCategoryExpansion";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Transaction, TransactionCategory } from "@/utils/mockData";
import CategorySummaryRow from "./components/CategorySummaryRow";
import CategoryRow from "./components/CategoryRow";
import MonthHeaderCells from "./components/MonthHeaderCells";
import EmptyDataMessage from "./components/EmptyDataMessage";

interface CategoryYearTableProps {
  transactions: Transaction[];
  categories: TransactionCategory[];
  year: number;
  type: 'income' | 'expense';
  showValues: boolean;
}

const CategoryYearTable = ({
  transactions,
  categories,
  year,
  type,
  showValues
}: CategoryYearTableProps) => {
  // Use our custom hooks
  const { 
    categoryHierarchy, 
    monthlyTotals, 
    yearlyTotal, 
    monthlyAverage, 
    hasData 
  } = useCategoryTableData(transactions, categories, year, type);
  
  const { toggleCategory, isExpanded } = useCategoryExpansion();
  
  // Check if there are categories of this type
  const hasCategories = categories.some(cat => cat.type === type);
  
  // Render a category row with its children
  const renderCategoryRows = (
    categoryData: any, 
    level: number = 0,
    isLastChild: boolean = false
  ) => {
    const { category, children } = categoryData;
    const expanded = isExpanded(category.id);
    const hasChildren = children && children.length > 0;
    
    return (
      <>
        <CategoryRow 
          categoryData={categoryData}
          level={level}
          isExpanded={expanded}
          showValues={showValues}
          hasChildren={hasChildren}
          onToggle={() => toggleCategory(category.id)}
        />
        
        {expanded && hasChildren && children.map((child: any, index: number) => (
          renderCategoryRows(child, level + 1, index === children.length - 1)
        ))}
      </>
    );
  };
  
  if (!hasCategories) {
    return <EmptyDataMessage type={type} year={year} hasCategories={false} />;
  }

  // Always render the table if there are categories, even if there are no transactions
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[1200px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] sticky left-0 bg-background">Categoria</TableHead>
            <MonthHeaderCells />
            <TableHead className="text-right font-bold">Total</TableHead>
            <TableHead className="text-right font-bold">Média</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Summary Row */}
          <CategorySummaryRow 
            type={type}
            monthlyTotals={monthlyTotals}
            yearlyTotal={yearlyTotal}
            monthlyAverage={monthlyAverage}
            showValues={showValues}
          />
          
          {/* Show message if we have categories but no transactions */}
          {yearlyTotal === 0 && categoryHierarchy.length > 0 && (
            <TableRow>
              <TableCell colSpan={14} className="text-center text-muted-foreground py-4">
                Não existem transações de {type === 'income' ? 'receitas' : 'despesas'} para o ano {year}
              </TableCell>
            </TableRow>
          )}
          
          {/* Category Rows with hierarchical structure */}
          {categoryHierarchy.map((categoryData, index) => (
            renderCategoryRows(categoryData, 0, index === categoryHierarchy.length - 1)
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryYearTable;
