
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Transaction, TransactionCategory } from "@/utils/mockData";

interface UseTransactionFormProps {
  transaction?: Transaction;
  onSave?: (transaction: Partial<Transaction>) => void;
}

export function useTransactionForm({ transaction, onSave }: UseTransactionFormProps) {
  // Definir a data para o mês anterior por padrão
  const getDefaultDate = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() - 1, 1);
  };

  // Estado inicial para a data e outros campos do formulário
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
  const [allCategories, setAllCategories] = useState<TransactionCategory[]>([]);
  
  // Carregar categorias do localStorage
  useEffect(() => {
    const storedCategories = localStorage.getItem('categories');
    const localCategories = storedCategories ? JSON.parse(storedCategories) : [];
    
    // Usar apenas as categorias locais, não mesclar com as mockadas
    setAllCategories(localCategories);
    
    // Log para depuração
    console.log("Loaded categories from localStorage:", localCategories);
  }, []);

  useEffect(() => {
    // Inicializar categorias baseadas no tipo selecionado, começando no nível adequado
    // Como suas categorias começam no nível 2, ajustamos aqui
    const firstLevelCategories = allCategories.filter(
      (category) => category.type === formData.type && category.level === 2
    );
    
    console.log("First level categories:", firstLevelCategories);
    setAvailableCategories(firstLevelCategories);
    setCategoryLevel(2); // Começar no nível 2, onde suas categorias começam
    
    setCategoryPath([]);
    setIsAtLeafCategory(false);
    
    // Log para depuração
    console.log("Resetting form for type:", formData.type);
  }, [formData.type, allCategories]);

  useEffect(() => {
    // Quando a data muda, atualiza o formData com uma data padrão (primeiro dia do mês)
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    
    setFormData(prev => ({
      ...prev,
      date: format(firstDayOfMonth, "yyyy-MM-dd")
    }));
  }, [selectedDate]);

  const getCategoryFromAll = (id: string): TransactionCategory | undefined => {
    return allCategories.find(cat => cat.id === id);
  };

  const handleChange = (field: string, value: string | number) => {
    if (field === "categoryId") {
      const selectedCategory = getCategoryFromAll(value as string);
      
      if (selectedCategory) {
        setFormData({
          ...formData,
          categoryId: value as string,
          type: selectedCategory.type || formData.type
        });
        
        // Verifica se existem subcategorias
        const childCategories = allCategories.filter(
          (category) => category.parentId === value
        );
        
        if (childCategories.length > 0) {
          // Se existirem subcategorias, atualiza o caminho e mostra as subcategorias
          setCategoryPath([...categoryPath, value as string]);
          setAvailableCategories(childCategories);
          setCategoryLevel(selectedCategory.level + 1);
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
    
    // Se volta ao início, mostrar categorias de primeiro nível (nível 2 no seu caso)
    if (index === 0) {
      const firstLevelCategories = allCategories.filter(
        (category) => category.type === formData.type && category.level === 2
      );
      
      setAvailableCategories(firstLevelCategories);
      setCategoryLevel(2);
      setIsAtLeafCategory(false);
    } else {
      // Senão, mostrar subcategorias do nível selecionado
      const parentId = newPath[newPath.length - 1];
      const childCategories = allCategories.filter(
        (category) => category.parentId === parentId
      );
      setAvailableCategories(childCategories);
      
      // Definir o nível correto com base na categoria pai
      const parentCategory = getCategoryFromAll(parentId);
      if (parentCategory) {
        setCategoryLevel(parentCategory.level + 1);
      }
      
      // Verificar se a categoria selecionada é folha
      const hasChildren = allCategories.some(cat => cat.parentId === parentId);
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
      
      // Não resetar a data após salvar, mantendo a data selecionada pelo usuário
      setFormData({
        ...formData,
        amount: 0,
        categoryId: "",
      });
      
      // Manter a mesma data e tipo, resetando apenas os outros campos
      setCategoryPath([]);
      setCategoryLevel(2);
      setIsAtLeafCategory(false);
      
      toast.success(transaction ? "Transação atualizada" : "Transação adicionada");
    }
  };

  const handleReset = () => {
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
      // Ao limpar, mantem a data atual, resetando apenas os outros campos
      setFormData({
        ...formData,
        amount: 0,
        categoryId: "",
      });
      // Data e tipo são mantidos
      setCategoryPath([]);
      setCategoryLevel(2);
      setIsAtLeafCategory(false);
    }
  };

  // Obter nomes das categorias no caminho atual
  const getCategoryPathNames = () => {
    return categoryPath.map(id => {
      const category = getCategoryFromAll(id);
      return category?.name || "";
    });
  };

  return {
    formData,
    selectedDate,
    setSelectedDate,
    categoryPath,
    availableCategories,
    categoryLevel,
    isAtLeafCategory,
    handleChange,
    handleResetCategoryPath,
    handleSubmit,
    handleReset,
    getCategoryPathNames
  };
}
