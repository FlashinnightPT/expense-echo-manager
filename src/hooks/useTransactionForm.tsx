
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Transaction, TransactionCategory } from "@/utils/mockData";
import { categoryService } from "@/services/api/category/CategoryService";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Carregar categorias da API em vez do localStorage
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        // Use o serviço de categoria para buscar da API
        const apiCategories = await categoryService.getCategories();
        
        // Usar apenas categorias da API, não usar dados mockados
        setAllCategories(apiCategories);
        
        // Log para depuração
        console.log("Loaded categories from API:", apiCategories);
      } catch (error) {
        console.error("Error loading categories from API:", error);
        toast.error("Não foi possível carregar as categorias");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCategories();
  }, []);

  // Efeito para inicializar corretamente a categoria quando estamos editando uma transação existente
  useEffect(() => {
    if (transaction && transaction.categoryId && allCategories.length > 0) {
      console.log("Setting up category path for existing transaction:", transaction.categoryId);
      setupCategoryPathForExistingTransaction(transaction.categoryId);
    }
  }, [transaction, allCategories]);

  // Função para configurar o caminho da categoria para uma transação existente
  const setupCategoryPathForExistingTransaction = (categoryId: string) => {
    // Encontrar a categoria atual
    const category = getCategoryFromAll(categoryId);
    if (!category) {
      console.error("Category not found:", categoryId);
      return;
    }

    // Construir o caminho da categoria recursivamente
    const path: string[] = [];
    let currentCat: TransactionCategory | undefined = category;
    
    // Adicionar a categoria atual ao caminho
    path.unshift(currentCat.id);
    
    // Adicionar todas as categorias pai ao caminho
    while (currentCat && currentCat.parentId) {
      const parentCat = getCategoryFromAll(currentCat.parentId);
      if (parentCat) {
        path.unshift(parentCat.id);
        currentCat = parentCat;
      } else {
        break;
      }
    }
    
    console.log("Constructed category path:", path);
    setCategoryPath(path);
    
    // Configurar corretamente o nível da categoria e as categorias disponíveis
    if (path.length > 0) {
      // Verificar se a categoria selecionada é uma folha (sem filhos)
      const hasChildren = allCategories.some(cat => 
        cat.parentId === categoryId && 
        cat.isActive !== false
      );
      
      setIsAtLeafCategory(!hasChildren);
      
      // Se não estamos na raiz, mostrar as subcategorias do nível apropriado
      if (path.length > 1) {
        const parentId = path[path.length - 2]; // O penúltimo item no caminho
        const childCategories = allCategories.filter(
          cat => cat.parentId === parentId && cat.isActive !== false
        );
        setAvailableCategories(childCategories);
        
        // Definir o nível correto com base na categoria atual
        setCategoryLevel(category.level);
      } else {
        // Estamos na raiz, mostrar categorias de primeiro nível
        resetToFirstLevelCategories();
      }
    }
  };

  // Resetar para categorias de primeiro nível com base no tipo selecionado
  const resetToFirstLevelCategories = () => {
    // Como suas categorias começam no nível 2, ajustamos aqui
    const firstLevelCategories = allCategories.filter(
      (category) => 
        category.type === formData.type && 
        category.level === 2 && 
        category.isActive !== false // Mostrar apenas categorias ativas
    );
    
    console.log("Resetting to first level categories:", firstLevelCategories);
    setAvailableCategories(firstLevelCategories);
    setCategoryLevel(2); // Começar no nível 2, onde suas categorias começam
    
    // Não resetar o caminho da categoria se estamos editando uma transação existente
    if (!transaction) {
      setCategoryPath([]);
    }
    setIsAtLeafCategory(false);
  };

  useEffect(() => {
    // Inicializar categorias baseadas no tipo selecionado
    if (!transaction || !transaction.categoryId) {
      resetToFirstLevelCategories();
    }
    
    // Log para depuração
    console.log("Form type updated:", formData.type);
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
        
        // Verifica se existem subcategorias ativas
        const childCategories = allCategories.filter(
          (category) => category.parentId === value && category.isActive !== false
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
        amount: transaction ? transaction.amount : 0 // Manter valor original se estiver editando
      });
      setIsAtLeafCategory(false);
      setCategoryPath([]);
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
        (category) => 
          category.type === formData.type && 
          category.level === 2 &&
          category.isActive !== false // Mostrar apenas categorias ativas
      );
      
      setAvailableCategories(firstLevelCategories);
      setCategoryLevel(2);
      setIsAtLeafCategory(false);
    } else {
      // Senão, mostrar subcategorias do nível selecionado
      const parentId = newPath[newPath.length - 1];
      const childCategories = allCategories.filter(
        (category) => 
          category.parentId === parentId && 
          category.isActive !== false // Mostrar apenas categorias ativas
      );
      setAvailableCategories(childCategories);
      
      // Definir o nível correto com base na categoria pai
      const parentCategory = getCategoryFromAll(parentId);
      if (parentCategory) {
        setCategoryLevel(parentCategory.level + 1);
      }
      
      // Verificar se a categoria selecionada é folha
      const hasChildren = allCategories.some(cat => 
        cat.parentId === parentId && 
        cat.isActive !== false // Verificar apenas categorias ativas
      );
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
      
      // Resetar o formulário após salvar, mantendo o tipo e data
      if (!transaction) {
        setFormData(prev => ({
          ...prev,
          amount: 0,
          categoryId: "",
        }));
        
        // Resetar para o primeiro nível de categorias
        resetToFirstLevelCategories();
      }
      
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
      
      // Reset category path to match the original transaction
      if (transaction.categoryId) {
        setupCategoryPathForExistingTransaction(transaction.categoryId);
      }
    } else {
      // Ao limpar, mantem a data atual, resetando apenas os outros campos
      setFormData({
        ...formData,
        amount: 0,
        categoryId: "",
      });
      // Data e tipo são mantidos
      resetToFirstLevelCategories();
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
    getCategoryPathNames,
    isLoading
  };
}
