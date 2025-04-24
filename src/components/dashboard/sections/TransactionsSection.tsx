
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import { Transaction, TransactionCategory } from "@/utils/mockData";
import { formatCurrency } from "@/utils/financialCalculations";
import EditTransactionDialog from "../dialogs/EditTransactionDialog";

interface TransactionsSectionProps {
  transactions: Transaction[];
  categories: TransactionCategory[];
  getCategoryById: (categoryId: string) => any;
  getCategoryPath: (categoryId: string) => string[];
  handleDeleteTransactionWithToast: (transactionId: string) => void;
  handleSaveTransactionWithToast: (transaction: Partial<Transaction>) => void;
  showValues: boolean;
  canEdit: boolean;
}

const TransactionsSection: FC<TransactionsSectionProps> = ({
  transactions,
  categories,
  getCategoryById,
  getCategoryPath,
  handleDeleteTransactionWithToast,
  handleSaveTransactionWithToast,
  showValues,
  canEdit
}) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCloseDialog = () => {
    setEditingTransaction(null);
  };

  const transactionColumns = [
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
    {
      id: "actions",
      header: "Ações",
      accessorFn: (row: Transaction) => (
        <div className="flex justify-end gap-2">
          {canEdit && (
            <>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(row);
                }}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Button>
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
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <>
      <TransactionsTable 
        transactions={transactions}
        categories={categories}
        transactionColumns={transactionColumns}
      />

      <EditTransactionDialog 
        isOpen={!!editingTransaction}
        onClose={handleCloseDialog}
        transaction={editingTransaction}
        onSave={handleSaveTransactionWithToast}
      />
    </>
  );
};

export default TransactionsSection;
