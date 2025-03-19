
interface EmptyDataMessageProps {
  type: 'income' | 'expense';
  year: number;
}

const EmptyDataMessage = ({ type, year }: EmptyDataMessageProps) => {
  return (
    <div className="text-center p-8 text-muted-foreground">
      Não existem transações de {type === 'income' ? 'receitas' : 'despesas'} para o ano {year}
    </div>
  );
};

export default EmptyDataMessage;
