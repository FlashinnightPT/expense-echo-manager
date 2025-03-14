
import { useState, useEffect } from "react";
import { PlusCircle, X, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { TransactionCategory } from "@/utils/mockData";
import { toast } from "sonner";

interface CategoryFormProps {
  onSave?: (category: Partial<TransactionCategory>) => void;
  category?: TransactionCategory;
  className?: string;
}

const CategoryForm = ({ onSave, category, className }: CategoryFormProps) => {
  // Estado principal da categoria atual
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>(category?.type || 'expense');
  const [level2Name, setLevel2Name] = useState<string>(category?.level === 2 ? category?.name : '');
  const [level3Name, setLevel3Name] = useState<string>(category?.level === 3 ? category?.name : '');
  const [level4Items, setLevel4Items] = useState<string[]>(
    category?.level === 4 ? [category?.name] : []
  );
  const [level3Items, setLevel3Items] = useState<string[]>(
    category?.level === 3 ? [category?.name] : []
  );

  // Estado para rastrear a hierarquia
  const [parentId, setParentId] = useState<string | undefined>(category?.parentId);
  const [availableParents, setAvailableParents] = useState<TransactionCategory[]>([]);
  const [selectedLevel3Item, setSelectedLevel3Item] = useState<string>('');
  
  useEffect(() => {
    // Carregar categorias existentes
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      const parsedCategories = JSON.parse(storedCategories);
      
      // Encontrar categorias de nível 2 e 3 para o tipo selecionado
      const level2Categories = parsedCategories.filter(
        (cat: TransactionCategory) => cat.type === selectedType && cat.level === 2
      );
      
      const level3Categories = parsedCategories.filter(
        (cat: TransactionCategory) => cat.type === selectedType && cat.level === 3
      );
      
      setAvailableParents([...level2Categories, ...level3Categories]);
    }
  }, [selectedType]);

  // Avançar para o próximo nível
  const goToNextLevel = () => {
    if (currentLevel < 4) {
      setCurrentLevel(currentLevel + 1);
    }
  };

  // Voltar para o nível anterior
  const goToPreviousLevel = () => {
    if (currentLevel > 1) {
      setCurrentLevel(currentLevel - 1);
    }
  };

  // Adicionar um novo item ao nível 3
  const addLevel3Item = () => {
    if (level3Name.trim()) {
      setLevel3Items([...level3Items, level3Name]);
      setLevel3Name('');
    }
  };

  // Adicionar um novo item ao nível 4
  const addLevel4Item = () => {
    if (level4Items.trim()) {
      setLevel4Items([...level4Items, level4Items]);
      setLevel4Items('');
    }
  };

  // Remover um item do nível 3
  const removeLevel3Item = (index: number) => {
    const updatedItems = [...level3Items];
    updatedItems.splice(index, 1);
    setLevel3Items(updatedItems);
  };

  // Remover um item do nível 4
  const removeLevel4Item = (index: number) => {
    const updatedItems = [...level4Items];
    updatedItems.splice(index, 1);
    setLevel4Items(updatedItems);
  };

  // Submeter o formulário para criar/atualizar a categoria
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentLevel === 2 && !level2Name) {
      toast.error("Por favor, insira um nome para a categoria principal");
      return;
    }
    
    if (currentLevel === 3 && level3Items.length === 0) {
      toast.error("Adicione pelo menos uma subcategoria");
      return;
    }
    
    if (currentLevel === 4 && level4Items.length === 0) {
      toast.error("Adicione pelo menos um item");
      return;
    }
    
    // Lógica para salvar a categoria baseada no nível atual
    if (onSave) {
      if (currentLevel === 2) {
        // Salvar categoria de nível 2
        onSave({
          name: level2Name,
          type: selectedType,
          level: 2
        });
        toast.success("Categoria principal criada com sucesso");
      } else if (currentLevel === 3) {
        // Para cada item no nível 3, criar uma subcategoria
        level3Items.forEach(itemName => {
          const level2Category = availableParents.find(p => p.level === 2 && p.name === level2Name);
          onSave({
            name: itemName,
            type: selectedType,
            level: 3,
            parentId: level2Category?.id
          });
        });
        toast.success(`${level3Items.length} subcategorias criadas com sucesso`);
      } else if (currentLevel === 4) {
        // Para cada item no nível 4, criar um item individual
        level4Items.forEach(itemName => {
          const level3Category = availableParents.find(p => p.level === 3 && p.name === selectedLevel3Item);
          onSave({
            name: itemName,
            type: selectedType,
            level: 4,
            parentId: level3Category?.id
          });
        });
        toast.success(`${level4Items.length} itens criados com sucesso`);
      }
      
      // Resetar o formulário
      resetForm();
    }
  };

  // Resetar o formulário
  const resetForm = () => {
    setCurrentLevel(1);
    setLevel2Name('');
    setLevel3Name('');
    setLevel3Items([]);
    setLevel4Items([]);
    setSelectedLevel3Item('');
  };

  return (
    <Card className={cn("animate-fade-in-up", className)}>
      <CardHeader>
        <CardTitle className="text-lg">
          {category ? "Editar Categoria" : "Adicionar Nova Categoria"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {currentLevel === 1 && (
            <div className="space-y-2">
              <Label>Tipo de Categoria (Nível 1)</Label>
              <RadioGroup
                value={selectedType}
                onValueChange={(value) => setSelectedType(value as 'income' | 'expense')}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="income" />
                  <Label htmlFor="income" className="cursor-pointer">Receita</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="expense" />
                  <Label htmlFor="expense" className="cursor-pointer">Despesa</Label>
                </div>
              </RadioGroup>
              
              <div className="pt-4">
                <Button type="button" onClick={goToNextLevel}>
                  Continuar para Nível 2
                </Button>
              </div>
            </div>
          )}

          {currentLevel === 2 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">
                  Tipo selecionado: <span className="font-bold">{selectedType === 'income' ? 'Receita' : 'Despesa'}</span>
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="level2Name">Nome da Categoria Principal (Nível 2)</Label>
                <Input
                  id="level2Name"
                  placeholder="Ex: Pessoal, Moradia, Transporte..."
                  value={level2Name}
                  onChange={(e) => setLevel2Name(e.target.value)}
                />
              </div>
              
              <div className="p-3 bg-muted/10 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Categoria Principal</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Nível 2 de 4
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={goToPreviousLevel}>
                  Voltar
                </Button>
                <Button 
                  type="button" 
                  onClick={goToNextLevel}
                  disabled={!level2Name}
                >
                  Continuar para Nível 3
                </Button>
                <Button 
                  type="submit"
                  disabled={!level2Name}
                >
                  Salvar Categoria Principal
                </Button>
              </div>
            </div>
          )}

          {currentLevel === 3 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">
                  Hierarquia: <span className="font-bold">{selectedType === 'income' ? 'Receita' : 'Despesa'}</span> &gt; <span className="font-bold">{level2Name}</span>
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="level3Name">Nome da Subcategoria (Nível 3)</Label>
                <div className="flex space-x-2">
                  <Input
                    id="level3Name"
                    placeholder="Ex: Salários, Aluguel, Combustível..."
                    value={level3Name}
                    onChange={(e) => setLevel3Name(e.target.value)}
                  />
                  <Button type="button" onClick={addLevel3Item} disabled={!level3Name.trim()}>
                    <Plus className="h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
              </div>
              
              {level3Items.length > 0 && (
                <div className="space-y-2">
                  <Label>Subcategorias Adicionadas</Label>
                  <div className="border rounded-md p-2 space-y-2">
                    {level3Items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-muted/20 p-2 rounded">
                        <span>{item}</span>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeLevel3Item(index)}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="p-3 bg-muted/10 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Subcategorias</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Nível 3 de 4
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={goToPreviousLevel}>
                  Voltar
                </Button>
                <Button 
                  type="button" 
                  onClick={goToNextLevel}
                  disabled={level3Items.length === 0}
                >
                  Continuar para Nível 4
                </Button>
                <Button 
                  type="submit"
                  disabled={level3Items.length === 0}
                >
                  Salvar Subcategorias
                </Button>
              </div>
            </div>
          )}

          {currentLevel === 4 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">
                  Hierarquia: <span className="font-bold">{selectedType === 'income' ? 'Receita' : 'Despesa'}</span> &gt; <span className="font-bold">{level2Name}</span> &gt; <span className="font-bold">Subcategoria</span>
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="level3Select">Selecione a Subcategoria</Label>
                <select
                  id="level3Select"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedLevel3Item}
                  onChange={(e) => setSelectedLevel3Item(e.target.value)}
                >
                  <option value="">Selecione uma subcategoria</option>
                  {level3Items.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedLevel3Item && (
                <div className="space-y-2">
                  <Label htmlFor="level4Item">Nome do Item Individual (Nível 4)</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="level4Item"
                      placeholder="Ex: Carlos, Apartamento 3B, Carro..."
                      value={level4Items}
                      onChange={(e) => setLevel4Items(e.target.value)}
                    />
                    <Button type="button" onClick={addLevel4Item} disabled={!level4Items.trim()}>
                      <Plus className="h-4 w-4" />
                      Adicionar
                    </Button>
                  </div>
                  
                  {level4Items.length > 0 && (
                    <div className="space-y-2 mt-2">
                      <Label>Itens Adicionados</Label>
                      <div className="border rounded-md p-2 space-y-2">
                        {level4Items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center bg-muted/20 p-2 rounded">
                            <span>{item}</span>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => removeLevel4Item(index)}
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="p-3 bg-muted/10 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Itens Individuais</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Nível 4 de 4 (máximo)
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={goToPreviousLevel}>
                  Voltar
                </Button>
                <Button 
                  type="submit"
                  disabled={!selectedLevel3Item || level4Items.length === 0}
                >
                  Salvar Itens
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default CategoryForm;
