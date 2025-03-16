
import React from 'react';
import { InfoIcon, AlertTriangle } from "lucide-react";

const ChatTips: React.FC = () => {
  return (
    <>
      <div className="flex items-start space-x-2 mb-2">
        <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-muted-foreground">
          Utilize o assistente de IA para analisar seus dados financeiros e obter insights sobre seus gastos e rendimentos.
        </p>
      </div>
      
      <div className="p-2 border border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800 rounded-md">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-yellow-800 dark:text-yellow-400">
            Seja específico em suas perguntas. Mencione categorias, períodos (anos/meses) e tipos de transação para obter respostas mais precisas.
          </p>
        </div>
      </div>
    </>
  );
};

export default ChatTips;
