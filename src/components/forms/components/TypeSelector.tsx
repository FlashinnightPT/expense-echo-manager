
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface TypeSelectorProps {
  value: string;
  onChange: (value: "income" | "expense") => void;
}

const TypeSelector = ({ value, onChange }: TypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="type">Tipo de Transação</Label>
      <Select
        value={value}
        onValueChange={(value) => onChange(value as "income" | "expense")}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione o tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="income">Receita</SelectItem>
          <SelectItem value="expense">Despesa</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TypeSelector;
