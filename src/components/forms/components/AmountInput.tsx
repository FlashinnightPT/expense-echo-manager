
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AmountInputProps {
  value: number | string;
  onChange: (value: number) => void;
  isEnabled: boolean;
}

const AmountInput = ({ value, onChange, isEnabled }: AmountInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="amount" className={!isEnabled ? "text-muted-foreground" : ""}>Valor</Label>
      <Input
        id="amount"
        type="number"
        step="0.01"
        min="0"
        placeholder="0,00"
        value={value || ""}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        disabled={!isEnabled}
        className={!isEnabled ? "bg-muted cursor-not-allowed" : ""}
      />
      {!isEnabled && (
        <p className="text-xs text-muted-foreground">Selecione uma categoria de último nível para inserir o valor</p>
      )}
    </div>
  );
};

export default AmountInput;
