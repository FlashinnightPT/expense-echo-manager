
import { useState, useEffect } from "react";
import { Save, X, CalendarIcon } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
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
  // Definir a data para o mês anterior por padrão
  const getDefaultDate = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() - 1, 1);
  };

  const [formData, setFormData] = useState<Partial<Transaction>>({
    amount: transaction?.amount || 0,
    date: transaction?.date || format(getDefaultDate(), "yyyy-MM-dd"),
    categoryId: transaction?.categoryId || "",
    type: transaction?.type || "expense"
  });

  const [selectedDate, setSelectedDate] = useState<Date>(
    transaction?.date ? new Date(transaction.date) : getDefaultDate()
  );

  const [categoryPath, setCategoryPath] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<TransactionCategory[]>([]);
  const [categoryLevel, setCategoryLevel] = useState<number>(1);
  const [isAtLeafCategory, setIsAtLeafCategory] = useState<boolean>(false);

  useEffect(() => {
    // Inicializar categorias de primeiro nível baseadas no tipo selecionado
    const firstLevelCategories = flattenedCategories.filter(
      (category) => category.type === formData.type && category.level === 1
    );
    console.log("First level categories:", firstLevelCategories);
    setAvailableCategories(firstLevelCategories);
    setCategoryLevel(1);
    setCategoryPath([]);
    setIsAtLeafCategory(false);
  }, [formData.type]);

  useEffect(() => {
    // Quando a data muda, atualiza o formData
    setFormData(prev => ({
      ...prev,
      date: format(selectedDate, "yyyy-MM-dd")
    }));
  }, [selectedDate]);

  const handleChange = (field: string, value: string | number) => {
    if (field === "categoryId") {
      const selectedCategory = getCategoryById(value as string);
      
      if (selectedCategory) {
        setFormData({
          ...formData,
          categoryId: value as string,
          type: selectedCategory.type || formData.type
        });
        
        // Verifica se existem subcategorias
        const childCategories = flattenedCategories.filter(
          (category) => category.parentId === value
        );
        
        if (childCategories.length > 0) {
          // Se existirem subcategorias, atualiza o caminho e mostra as subcategorias
          setCategoryPath([...categoryPath, value as string]);
          setAvailableCategories(childCategories);
          setCategoryLevel(categoryLevel + 1);
          setIsAtLeafCategory(false);
        } else {
          // Se não existirem subcategorias, estamos em uma categoria folha
          setCategoryPath([...categoryPath, value as string]);
          setIsAtLeafCategory(true);
        }
      }
    } else if (field === "type") {
      setFormData({
        ...formData,
        type: value as "income" | "expense",
        categoryId: "", // Resetar categoria quando o tipo muda
        amount: 0 // Resetar valor quando o tipo muda
      });
      setIsAtLeafCategory(false);
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  const handleResetCategoryPath = (index: number) => {
    // Volta para um nível específico na hierarquia
    const newPath = categoryPath.slice(0, index);
    setCategoryPath(newPath);
    
    // Se volta ao início, mostrar categorias de primeiro nível
    if (index === 0) {
      const firstLevelCategories = flattenedCategories.filter(
        (category) => category.type === formData.type && category.level === 1
      );
      setAvailableCategories(firstLevelCategories);
      setCategoryLevel(1);
      setIsAtLeafCategory(false);
    } else {
      // Senão, mostrar subcategorias do nível selecionado
      const parentId = newPath[newPath.length - 1];
      const childCategories = flattenedCategories.filter(
        (category) => category.parentId === parentId
      );
      setAvailableCategories(childCategories);
      setCategoryLevel(index + 1);
      
      // Verificar se a categoria selecionada é folha
      const hasChildren = flattenedCategories.some(cat => cat.parentId === parentId);
      setIsAtLeafCategory(!hasChildren);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAtLeafCategory) {
      toast.error("Por favor, selecione uma categoria de último nível");
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
          amount: 0,
          date: format(getDefaultDate(), "yyyy-MM-dd"),
          categoryId: "",
          type: "expense"
        });
        setSelectedDate(getDefaultDate());
        setCategoryPath([]);
        setCategoryLevel(1);
        setIsAtLeafCategory(false);
      }
      
      toast.success(transaction ? "Transação atualizada" : "Transação adicionada");
    }
  };

  // Tipos de transações em português
  const typeLabels = {
    income: "Receita",
    expense: "Despesa"
  };

  // Obtém os nomes das categorias no caminho atual
  const getCategoryPathNames = () => {
    return categoryPath.map(id => {
      const category = getCategoryById(id);
      return category?.name || "";
    });
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
              <Label htmlFor="date">Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "MMMM yyyy", { locale: pt })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                    showOutsideDays={false}
                    captionLayout="dropdown-buttons"
                    fromYear={2020}
                    toYear={2030}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Transação</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => 
                  handleChange("type", value as "income" | "expense")
                }
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
            
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1 mb-2">
                <button 
                  type="button"
                  className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded"
                  onClick={() => handleResetCategoryPath(0)}
                >
                  Início
                </button>
                
                {getCategoryPathNames().map((name, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-xs text-muted-foreground mx-1">/</span>
                    <button 
                      type="button"
                      className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded"
                      onClick={() => handleResetCategoryPath(index + 1)}
                    >
                      {name}
                    </button>
                  </div>
                ))}
              </div>
              
              <Label htmlFor="category">
                {categoryLevel === 1 
                  ? "Categoria" 
                  : `Subcategoria (Nível ${categoryLevel})`}
              </Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => handleChange("categoryId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Selecione a ${categoryLevel === 1 ? 'categoria' : 'subcategoria'}`} />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.length === 0 ? (
                    <SelectItem value="none" disabled>
                      Nenhuma categoria disponível
                    </SelectItem>
                  ) : (
                    availableCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount" className={!isAtLeafCategory ? "text-muted-foreground" : ""}>Valor</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={formData.amount || ""}
                onChange={(e) => handleChange("amount", parseFloat(e.target.value) || 0)}
                disabled={!isAtLeafCategory}
                className={!isAtLeafCategory ? "bg-muted cursor-not-allowed" : ""}
              />
              {!isAtLeafCategory && (
                <p className="text-xs text-muted-foreground">Selecione uma categoria de último nível para inserir o valor</p>
              )}
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
                    amount: transaction.amount,
                    date: transaction.date,
                    categoryId: transaction.categoryId,
                    type: transaction.type
                  });
                  setSelectedDate(new Date(transaction.date));
                } else {
                  // Clear form if adding new
                  setFormData({
                    amount: 0,
                    date: format(getDefaultDate(), "yyyy-MM-dd"),
                    categoryId: "",
                    type: "expense"
                  });
                  setSelectedDate(getDefaultDate());
                  setCategoryPath([]);
                  setCategoryLevel(1);
                  setIsAtLeafCategory(false);
                }
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
            <Button type="submit" disabled={!isAtLeafCategory}>
              <Save className="h-4 w-4 mr-2" />
              {transaction ? "Atualizar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
