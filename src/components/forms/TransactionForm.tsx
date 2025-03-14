
import { useState } from "react";
import { Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { 
  Transaction, 
  TransactionCategory, 
  getCategoryById, 
  flattenedCategories 
} from "@/utils/mockData";
import { toast } from "sonner";

interface TransactionFormProps {
  onSave?: (transaction: Partial<Transaction>) => void;
  transaction?: Transaction;
  className?: string;
}

const TransactionForm = ({ onSave, transaction, className }: TransactionFormProps) => {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    description: transaction?.description || "",
    amount: transaction?.amount || 0,
    date: transaction?.date || new Date().toISOString().split("T")[0],
    categoryId: transaction?.categoryId || "",
    type: transaction?.type || "expense"
  });

  const handleChange = (field: string, value: string | number) => {
    if (field === "categoryId") {
      const category = getCategoryById(value as string);
      setFormData({
        ...formData,
        categoryId: value as string,
        type: category?.type || formData.type
      });
    } else if (field === "type") {
      setFormData({
        ...formData,
        type: value as "income" | "expense" | "savings" | "investment",
        categoryId: "" // Reset category when type changes
      });
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description) {
      toast.error("Por favor, insira uma descrição");
      return;
    }
    
    if (!formData.amount || formData.amount <= 0) {
      toast.error("Por favor, insira um valor válido");
      return;
    }
    
    if (!formData.categoryId) {
      toast.error("Por favor, selecione uma categoria");
      return;
    }
    
    if (onSave) {
      onSave(formData);
      
      // Reset form after save if it's a new transaction
      if (!transaction) {
        setFormData({
          description: "",
          amount: 0,
          date: new Date().toISOString().split("T")[0],
          categoryId: "",
          type: "expense"
        });
      }
      
      toast.success(transaction ? "Transação atualizada" : "Transação adicionada");
    }
  };

  // Get categories of the selected type
  const filteredCategories = flattenedCategories.filter(
    (category) => category.type === formData.type
  );

  // Tipos de transações em português
  const typeLabels = {
    income: "Receita",
    expense: "Despesa",
    savings: "Poupança",
    investment: "Investimento"
  };

  return (
    <Card className={cn("animate-fade-in-up", className)}>
      <CardHeader>
        <CardTitle className="text-lg">
          {transaction ? "Editar Transação" : "Adicionar Nova Transação"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="Introduza a descrição"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={formData.amount || ""}
                onChange={(e) => handleChange("amount", parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Transação</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => 
                  handleChange("type", value as "income" | "expense" | "savings" | "investment")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Receita</SelectItem>
                  <SelectItem value="expense">Despesa</SelectItem>
                  <SelectItem value="savings">Poupança</SelectItem>
                  <SelectItem value="investment">Investimento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => handleChange("categoryId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.level > 1 ? "└ ".repeat(category.level - 1) : ""}
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                if (transaction) {
                  // Reset to original values if editing
                  setFormData({
                    description: transaction.description,
                    amount: transaction.amount,
                    date: transaction.date,
                    categoryId: transaction.categoryId,
                    type: transaction.type
                  });
                } else {
                  // Clear form if adding new
                  setFormData({
                    description: "",
                    amount: 0,
                    date: new Date().toISOString().split("T")[0],
                    categoryId: "",
                    type: "expense"
                  });
                }
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {transaction ? "Atualizar" : "Adicionar"} Transação
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
