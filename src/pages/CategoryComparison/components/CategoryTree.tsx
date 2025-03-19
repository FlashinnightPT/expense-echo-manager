
import React, { useState } from "react";
import { ChevronRight, ChevronDown, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { calculateCategoryAmount } from "@/components/dashboard/comparison/utils/comparisonDataUtils";
import { formatCurrency } from "@/utils/financialCalculations";

interface CategoryTreeProps {
  categories: any[];
  allCategories: any[];
  transactions: any[];
  dateRange: { startDate: Date; endDate: Date };
  onSelectCategory: (categoryId: string, categoryPath: string) => boolean;
  level?: number;
  parentPath?: string;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  allCategories,
  transactions,
  dateRange,
  onSelectCategory,
  level = 0,
  parentPath = "",
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  // Toggle category expansion
  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  // Get subcategories for a parent
  const getSubcategories = (parentId: string) => {
    return allCategories.filter(cat => cat.parentId === parentId);
  };
  
  // Check if a category has children
  const hasChildren = (categoryId: string) => {
    return allCategories.some(cat => cat.parentId === categoryId);
  };
  
  // Add category to comparison
  const addToComparison = (categoryId: string, categoryName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const fullPath = parentPath ? `${parentPath} > ${categoryName}` : categoryName;
    const success = onSelectCategory(categoryId, fullPath);
    
    if (success) {
      toast.success(`"${fullPath}" adicionado à comparação`);
    } else {
      toast.error("Não foi possível adicionar à comparação. Máximo de 5 categorias ou já existente.");
    }
  };
  
  // Filter root categories if level is 0
  const displayCategories = categories.filter(cat => {
    if (level === 0) {
      return cat.level === 1 || !cat.parentId;
    }
    return true;
  });
  
  return (
    <div className="space-y-1">
      {displayCategories.map(category => {
        // Calculate amount for this category
        const amount = calculateCategoryAmount(
          category.id, 
          transactions, 
          allCategories, 
          dateRange.startDate, 
          dateRange.endDate
        );
        
        // Skip categories with no transactions in period
        if (amount === 0) return null;
        
        const isExpanded = expandedCategories.includes(category.id);
        const subCategories = getSubcategories(category.id);
        const childLevel = level + 1;
        const childPath = parentPath ? `${parentPath} > ${category.name}` : category.name;
        
        return (
          <div key={category.id} className="category-item">
            <div 
              className={cn(
                "flex items-center justify-between py-1 px-2 rounded-md transition-colors hover:bg-muted/50 cursor-pointer",
                isExpanded && "bg-muted/30"
              )}
              onClick={() => hasChildren(category.id) && toggleExpand(category.id)}
            >
              <div className="flex items-center">
                {hasChildren(category.id) ? (
                  <Button variant="ghost" size="icon" className="h-5 w-5 p-0 mr-1">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                ) : (
                  <div className="w-6" />
                )}
                
                <span className="ml-0 text-sm" style={{ paddingLeft: `${level * 8}px` }}>
                  {category.name} 
                  <span className="text-xs text-muted-foreground ml-2 tabular-nums">
                    {formatCurrency(amount)}
                  </span>
                </span>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 mr-1"
                onClick={(e) => addToComparison(category.id, category.name, e)}
              >
                <GitCompare className="h-4 w-4" />
              </Button>
            </div>
            
            {isExpanded && subCategories.length > 0 && (
              <div className="ml-2 mt-1 pl-2 border-l border-muted">
                <CategoryTree 
                  categories={subCategories}
                  allCategories={allCategories}
                  transactions={transactions}
                  dateRange={dateRange}
                  onSelectCategory={onSelectCategory}
                  level={childLevel}
                  parentPath={childPath}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CategoryTree;
