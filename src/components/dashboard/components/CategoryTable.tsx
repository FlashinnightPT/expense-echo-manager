
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/financialCalculations";
import { RootCategoryItem } from "../types/categoryTypes";
import CategoryRow from "./CategoryRow";

interface CategoryTableProps {
  groupedCategories: RootCategoryItem[];
  totalAmount: number;
  showEmptyMessage: string;
}

const CategoryTable = ({ 
  groupedCategories, 
  totalAmount, 
  showEmptyMessage 
}: CategoryTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Categoria</TableHead>
          <TableHead className="text-right">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groupedCategories.length === 0 ? (
          <TableRow>
            <TableCell colSpan={2} className="text-center text-muted-foreground py-6">
              {showEmptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          <>
            {groupedCategories.map((rootCat) => (
              <React.Fragment key={`level1-${rootCat.category.id}`}>
                <CategoryRow 
                  category={rootCat.category} 
                  amount={rootCat.amount} 
                  level={0} 
                />
                
                {rootCat.subcategories.map((level2Cat) => (
                  <React.Fragment key={`level2-${level2Cat.category.id}`}>
                    <CategoryRow 
                      category={level2Cat.category} 
                      amount={level2Cat.amount} 
                      level={1} 
                    />
                    
                    {level2Cat.subcategories.map((level3Cat) => (
                      <React.Fragment key={`level3-${level3Cat.category.id}`}>
                        <CategoryRow 
                          category={level3Cat.category} 
                          amount={level3Cat.amount} 
                          level={2} 
                        />
                        
                        {level3Cat.subcategories.map((level4Item) => (
                          <CategoryRow 
                            key={`level4-${level4Item.category.id}`}
                            category={level4Item.category} 
                            amount={level4Item.amount} 
                            level={3} 
                          />
                        ))}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
            
            <TableRow className="font-bold">
              <TableCell>TOTAL</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrency(totalAmount)}
              </TableCell>
            </TableRow>
          </>
        )}
      </TableBody>
    </Table>
  );
};

export default CategoryTable;
