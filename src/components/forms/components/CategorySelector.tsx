
import { TransactionCategory } from "@/utils/mockData";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  categories: TransactionCategory[];
  level: number;
  isDisabled?: boolean;
}

const CategorySelector = ({ 
  value, 
  onChange, 
  categories, 
  level, 
  isDisabled = false 
}: CategorySelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">
        {level === 2 
          ? "Categoria" 
          : `Subcategoria (Nível ${level})`}
      </Label>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={isDisabled}
      >
        <SelectTrigger>
          <SelectValue placeholder={`Selecione a ${level === 2 ? 'categoria' : 'subcategoria'}`} />
        </SelectTrigger>
        <SelectContent>
          {categories.length === 0 ? (
            <SelectItem value="none" disabled>
              Nenhuma categoria disponível
            </SelectItem>
          ) : (
            categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelector;
