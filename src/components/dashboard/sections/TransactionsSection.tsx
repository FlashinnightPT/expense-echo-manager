
import { FC, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import { Transaction } from "@/utils/mockData";
import { formatCurrency } from "@/utils/financialCalculations";

interface TransactionsSectionProps {
  transactions: Transaction[];
  getCategoryById: (categoryId: string) => any;
  getCategoryPath: (categoryId: string) => string[];
  handleDeleteTransactionWithToast: (transactionId: string) => void;
  showValues: boolean;
  canEdit: boolean;
}

const TransactionsSection: FC<TransactionsSectionProps> = ({
  transactions,
  getCategoryById,
  getCategoryPath,
  handleDeleteTransactionWithToast,
  showValues,
  canEdit
}) => {
  const transactionColumns = useMemo(() => [
    {
      id: "date",
      header: "Data",
      accessorFn: (row: Transaction) => (
        <span>{new Date(row.date).toLocaleDateString("pt-PT")}</span>
      ),
      sortable: true
    },
    {
      id: "description",
      header: "Descrição",
      accessorFn: (row: Transaction) => (
        <span className="font-medium">{row.description}</span>
      ),
      sortable: true
    },
    {
      id: "category",
      header: "Categoria",
      accessorFn: (row: Transaction) => {
        const category = getCategoryById(row.categoryId);
        if (!category) return <span>Sem Categoria</span>;
        
        const path = getCategoryPath(row.categoryId);
        return <span>{path.join(' > ')}</span>;
      },
      sortable: true
    },
    {
      id: "type",
      header: "Tipo",
      accessorFn: (row: Transaction) => {
        const badgeClasses = {
          income: "bg-finance-income/10 text-finance-income border-finance-income/20",
          expense: "bg-finance-expense/10 text-finance-expense border-finance-expense/20"
        };
        
        const typeNames = {
          income: "Receita",
          expense: "Despesa"
        };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${badgeClasses[row.type]}`}>
            {typeNames[row.type]}
          </span>
        );
      },
      sortable: true
    },
    {
      id: "amount",
      header: "Valor",
      accessorFn: (row: Transaction) => (
        <span className="font-semibold tabular-nums">
          {showValues ? formatCurrency(row.amount) : "•••••••"}
        </span>
      ),
      sortable: true,
      className: "text-right"
    },
    ...(canEdit ? [{
      id: "actions",
      header: "Ações",
      accessorFn: (row: Transaction) => (
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-red-500 hover:text-red-700 hover:bg-red-100"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTransactionWithToast(row.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Excluir</span>
          </Button>
        </div>
      )
    }] : [])
  ], [getCategoryById, getCategoryPath, handleDeleteTransactionWithToast, canEdit, showValues]);

  return (
    <TransactionsTable 
      transactions={transactions}
      transactionColumns={transactionColumns}
    />
  );
};

export default TransactionsSection;
