
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface EmptyDataMessageProps {
  type: 'income' | 'expense';
  year: number;
  hasCategories: boolean;
}

const EmptyDataMessage = ({ type, year, hasCategories }: EmptyDataMessageProps) => {
  if (!hasCategories) {
    return (
      <Alert className="my-4">
        <AlertTitle>Nenhuma categoria encontrada</AlertTitle>
        <AlertDescription>
          Não existem categorias de {type === 'income' ? 'receitas' : 'despesas'} definidas.
          Por favor, adicione categorias na página de Categorias.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert className="my-4" variant="default">
      <AlertTitle>Sem transações para este período</AlertTitle>
      <AlertDescription>
        Não existem transações de {type === 'income' ? 'receitas' : 'despesas'} para o ano {year}
      </AlertDescription>
    </Alert>
  );
};

export default EmptyDataMessage;
