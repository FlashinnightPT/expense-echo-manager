
import { useMemo } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatCurrency, getMonthName, buildCategoryHierarchy } from "@/utils/financialCalculations";
import { Transaction, TransactionCategory } from "@/utils/mockData";

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
  // Organize transactions by month
  const monthlyTransactions = useMemo(() => {
    const result: Record<number, Transaction[]> = {};
    
    // Initialize all months
    for (let i = 1; i <= 12; i++) {
      result[i] = [];
    }
    
    // Group transactions by month
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const month = date.getMonth() + 1;
      
      if (result[month]) {
        result[month].push(transaction);
      }
    });
    
    return result;
  }, [transactions]);
  
  // Get root categories of the specified type
  const rootCategories = useMemo(() => {
    return categories.filter(cat => 
      cat.level === 2 && cat.type === type
    );
  }, [categories, type]);
  
  // Build category data by month
  const categoryMonthData = useMemo(() => {
    // Create a data structure for each root category with monthly amounts
    return rootCategories.map(rootCategory => {
      const monthlyAmounts: Record<number, number> = {};
      const childCategories: TransactionCategory[] = [];
      
      // Get all direct child categories
      categories.forEach(cat => {
        if (cat.parentId === rootCategory.id) {
          childCategories.push(cat);
        }
      });
      
      // Calculate monthly totals for this root category
      for (let month = 1; month <= 12; month++) {
        const monthTransactions = monthlyTransactions[month];
        if (!monthTransactions || monthTransactions.length === 0) {
          monthlyAmounts[month] = 0;
          continue;
        }
        
        // Calculate the total amount for this category in this month
        monthlyAmounts[month] = monthTransactions
          .filter(t => {
            // Include transactions directly in this category
            if (t.categoryId === rootCategory.id) return true;
            
            // Include transactions in any child category
            const isChildTransaction = categories.some(cat => {
              if (cat.id === t.categoryId) {
                // Check if this category is a descendant of our root category
                let currentCat: TransactionCategory | undefined = cat;
                while (currentCat?.parentId) {
                  const parentCat = categories.find(c => c.id === currentCat?.parentId);
                  if (!parentCat) break;
                  
                  if (parentCat.id === rootCategory.id) return true;
                  currentCat = parentCat;
                }
              }
              return false;
            });
            
            return isChildTransaction;
          })
          .reduce((sum, t) => sum + t.amount, 0);
      }
      
      // Calculate yearly total and monthly average
      const yearlyTotal = Object.values(monthlyAmounts).reduce((sum, amount) => sum + amount, 0);
      const monthlyAverage = yearlyTotal / 12;
      
      return {
        category: rootCategory,
        childCategories,
        monthlyAmounts,
        yearlyTotal,
        monthlyAverage
      };
    });
  }, [rootCategories, categories, monthlyTransactions]);
  
  // Calculate monthly totals across all categories
  const monthlyTotals = useMemo(() => {
    const totals: Record<number, number> = {};
    
    for (let month = 1; month <= 12; month++) {
      totals[month] = 0;
      
      categoryMonthData.forEach(catData => {
        totals[month] += catData.monthlyAmounts[month] || 0;
      });
    }
    
    return totals;
  }, [categoryMonthData]);
  
  // Calculate yearly total and monthly average
  const yearlyTotal = useMemo(() => {
    return Object.values(monthlyTotals).reduce((sum, amount) => sum + amount, 0);
  }, [monthlyTotals]);
  
  const monthlyAverage = useMemo(() => {
    return yearlyTotal / 12;
  }, [yearlyTotal]);
  
  // Check if there is any data to display
  const hasData = useMemo(() => {
    return yearlyTotal > 0;
  }, [yearlyTotal]);
  
  if (!hasData) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        Não existem transações de {type === 'income' ? 'receitas' : 'despesas'} para o ano {year}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[1200px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] sticky left-0 bg-background">Categoria</TableHead>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <TableHead key={month} className="text-right min-w-[80px]">
                {getMonthName(month).substring(0, 3)}
              </TableHead>
            ))}
            <TableHead className="text-right font-bold">Total</TableHead>
            <TableHead className="text-right font-bold">Média</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Summary Row */}
          <TableRow className="font-bold bg-muted/30">
            <TableCell className="sticky left-0 bg-muted/30">
              {type === 'income' ? 'RECEITAS' : 'DESPESAS'}
            </TableCell>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <TableCell key={month} className="text-right tabular-nums">
                {showValues ? formatCurrency(monthlyTotals[month]) : "•••••••"}
              </TableCell>
            ))}
            <TableCell className="text-right tabular-nums">
              {showValues ? formatCurrency(yearlyTotal) : "•••••••"}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {showValues ? formatCurrency(monthlyAverage) : "•••••••"}
            </TableCell>
          </TableRow>
          
          {/* Category Rows */}
          {categoryMonthData.map(catData => (
            <TableRow key={catData.category.id}>
              <TableCell className="sticky left-0 bg-background font-medium">
                {catData.category.name}
              </TableCell>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <TableCell key={month} className="text-right tabular-nums">
                  {showValues ? formatCurrency(catData.monthlyAmounts[month] || 0) : "•••••••"}
                </TableCell>
              ))}
              <TableCell className="text-right tabular-nums font-medium">
                {showValues ? formatCurrency(catData.yearlyTotal) : "•••••••"}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {showValues ? formatCurrency(catData.monthlyAverage) : "•••••••"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryYearTable;
