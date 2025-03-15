
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Transaction } from "@/utils/mockData";
import { cn } from "@/lib/utils";
import { useTransactionForm } from "@/hooks/useTransactionForm";
import DateSelector from "./components/DateSelector";
import TypeSelector from "./components/TypeSelector";
import CategorySelector from "./components/CategorySelector";
import CategoryBreadcrumbNav from "./components/CategoryBreadcrumbNav";
import AmountInput from "./components/AmountInput";
import FormActions from "./components/FormActions";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface TransactionFormProps {
  onSave?: (transaction: Partial<Transaction>) => void;
  transaction?: Transaction;
  className?: string;
}

const TransactionForm = ({ onSave, transaction, className }: TransactionFormProps) => {
  const { canEdit } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!canEdit) {
      toast.error("Não tem permissões para adicionar ou editar transações");
      navigate("/dashboard");
    }
  }, [canEdit, navigate]);

  const {
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
  } = useTransactionForm({ 
    transaction, 
    onSave 
  });

  const categoryPathNames = getCategoryPathNames();

  // If user doesn't have edit permissions, don't render the form
  if (!canEdit) {
    return null;
  }

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
            {/* Date Selector */}
            <DateSelector 
              selectedDate={selectedDate} 
              onChange={setSelectedDate} 
            />
            
            {/* Type Selector */}
            <TypeSelector 
              value={formData.type || "expense"} 
              onChange={(value) => handleChange("type", value)} 
            />
            
            {/* Category Navigation */}
            <div className="space-y-2">
              <CategoryBreadcrumbNav 
                categoryNames={categoryPathNames} 
                onNavigate={handleResetCategoryPath} 
              />
              
              {/* Category Selector */}
              <CategorySelector 
                value={formData.categoryId || ""} 
                onChange={(value) => handleChange("categoryId", value)} 
                categories={availableCategories} 
                level={categoryLevel} 
              />
            </div>
            
            {/* Amount Input */}
            <AmountInput 
              value={formData.amount || ""} 
              onChange={(value) => handleChange("amount", value)} 
              isEnabled={isAtLeafCategory} 
            />
          </div>
          
          {/* Form Actions */}
          <FormActions 
            onReset={handleReset} 
            isEditing={!!transaction} 
            isSubmitDisabled={!isAtLeafCategory} 
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
