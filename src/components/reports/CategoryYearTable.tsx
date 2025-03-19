
import { useMemo, useState } from "react";
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
import { ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  // State to track expanded categories
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
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
  
  // Create a hierarchical structure of categories
  const categoryHierarchy = useMemo(() => {
    // Build a map of categories by ID for quick lookup
    const categoryMap = new Map<string, TransactionCategory>();
    categories.forEach(category => {
      categoryMap.set(category.id, category);
    });
    
    // Find root categories (level 1)
    const rootCategories = categories.filter(cat => 
      cat.type === type && cat.level === 1
    );
    
    // Create a hierarchy of categories with their monthly data
    const buildHierarchy = (parentCategories: TransactionCategory[]) => {
      return parentCategories.map(parent => {
        // Find all child categories
        const children = categories.filter(cat => cat.parentId === parent.id);
        
        // Calculate monthly amounts for this category
        const monthlyAmounts: Record<number, number> = {};
        
        for (let month = 1; month <= 12; month++) {
          const monthTransactions = monthlyTransactions[month];
          
          // Get all subcategory IDs including this category
          const getAllSubcategoryIds = (categoryId: string): string[] => {
            const subcats = categories.filter(cat => cat.parentId === categoryId);
            if (subcats.length === 0) return [categoryId];
            
            return [
              categoryId,
              ...subcats.flatMap(subcat => getAllSubcategoryIds(subcat.id))
            ];
          };
          
          const allCategoryIds = getAllSubcategoryIds(parent.id);
          
          // Sum transactions for this category and all its children
          monthlyAmounts[month] = monthTransactions
            .filter(t => allCategoryIds.includes(t.categoryId))
            .reduce((sum, t) => sum + t.amount, 0);
        }
        
        // Calculate yearly total and monthly average
        const yearlyTotal = Object.values(monthlyAmounts).reduce((sum, amount) => sum + amount, 0);
        const monthlyAverage = yearlyTotal / 12;
        
        return {
          category: parent,
          children: buildHierarchy(children),
          monthlyAmounts,
          yearlyTotal,
          monthlyAverage
        };
      });
    };
    
    return buildHierarchy(rootCategories);
  }, [categories, monthlyTransactions, type]);
  
  // Calculate monthly totals across all categories
  const monthlyTotals = useMemo(() => {
    const totals: Record<number, number> = {};
    
    for (let month = 1; month <= 12; month++) {
      totals[month] = 0;
      
      // Sum all transactions for this month and type
      totals[month] = monthlyTransactions[month]
        .filter(t => t.type === type)
        .reduce((sum, t) => sum + t.amount, 0);
    }
    
    return totals;
  }, [monthlyTransactions, type]);
  
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
  
  // Render a category row with its children
  const renderCategoryRows = (
    categoryData: any, 
    level: number = 0,
    isLastChild: boolean = false
  ) => {
    const { category, children, monthlyAmounts, yearlyTotal, monthlyAverage } = categoryData;
    const isExpanded = expandedCategories[category.id] || false;
    const hasChildren = children && children.length > 0;
    const indentPadding = `${level * 1.5}rem`;
    
    return (
      <>
        <TableRow className={cn(
          "transition-colors",
          level === 0 ? "bg-muted/20" : "",
          isExpanded && hasChildren ? "border-b-0" : ""
        )}>
          <TableCell className="sticky left-0 bg-background font-medium">
            <div 
              className="flex items-center cursor-pointer" 
              style={{ paddingLeft: indentPadding }}
              onClick={() => hasChildren && toggleCategory(category.id)}
            >
              {hasChildren ? (
                <Button variant="ghost" size="icon" className="h-6 w-6 p-0 mr-1 hover:bg-transparent">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              ) : (
                <div className="w-6" />
              )}
              {category.name}
            </div>
          </TableCell>
          
          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
            <TableCell key={month} className="text-right tabular-nums">
              {showValues ? formatCurrency(monthlyAmounts[month] || 0) : "•••••••"}
            </TableCell>
          ))}
          
          <TableCell className="text-right tabular-nums font-medium">
            {showValues ? formatCurrency(yearlyTotal) : "•••••••"}
          </TableCell>
          
          <TableCell className="text-right tabular-nums">
            {showValues ? formatCurrency(monthlyAverage) : "•••••••"}
          </TableCell>
        </TableRow>
        
        {isExpanded && hasChildren && children.map((child: any, index: number) => (
          renderCategoryRows(child, level + 1, index === children.length - 1)
        ))}
      </>
    );
  };
  
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
