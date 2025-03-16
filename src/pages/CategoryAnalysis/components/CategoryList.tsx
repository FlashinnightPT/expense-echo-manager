
import React from "react";
import { Card, CardContent } from "@/components/ui-custom/Card";
import { Label } from "@/components/ui/label";
import { TransactionCategory } from "@/utils/mockData";

interface CategoryListProps {
  filteredRootCategories: TransactionCategory[];
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
}

const CategoryList = ({
  filteredRootCategories,
  selectedCategoryId,
  setSelectedCategoryId
}: CategoryListProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <Label className="mb-2 block">Categorias</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {filteredRootCategories.length === 0 ? (
            <div className="col-span-full text-center py-4 text-muted-foreground">
              Nenhuma categoria encontrada
            </div>
          ) : (
            filteredRootCategories.map((category) => (
              <div
                key={category.id}
                className={`p-2 border rounded-md cursor-pointer transition-colors hover:bg-accent hover:border-accent-foreground/20 ${
                  selectedCategoryId === category.id ? "bg-accent border-accent-foreground/20" : "bg-card"
                }`}
                onClick={() => setSelectedCategoryId(category.id)}
              >
                {category.name}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryList;
