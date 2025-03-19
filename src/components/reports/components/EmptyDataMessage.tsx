
interface EmptyDataMessageProps {
  type: 'income' | 'expense';
  year: number;
  hasCategories: boolean;
}

const EmptyDataMessage = ({ type, year, hasCategories }: EmptyDataMessageProps) => {
  if (!hasCategories) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        Não existem categorias de {type === 'income' ? 'receitas' : 'despesas'} definidas
      </div>
    );
  }
  
  return (
    <div className="text-center p-8 text-muted-foreground">
      Não existem transações de {type === 'income' ? 'receitas' : 'despesas'} para o ano {year}
    </div>
  );
};

export default EmptyDataMessage;
