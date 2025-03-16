
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { aiService } from "@/services/aiService";
import { Transaction } from "@/utils/mockData";

export const useAiChat = (transactionList: Transaction[]) => {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);

  // Exemplos de perguntas mais específicas e práticas
  const exampleQuestions = [
    "Quanto gastei com combustível em 2024?",
    "Qual foi o total de pagamentos a Carlos no último ano?",
    "Quais foram as 3 maiores despesas em informática?",
    "Comparar gastos com portagens entre 2023 e 2024"
  ];
  
  // Verificar se a API key está configurada
  useEffect(() => {
    // Verificar se há uma chave salva no localStorage
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      aiService.setApiKey(savedApiKey);
    } else {
      setShowApiKeyInput(!aiService.hasApiKey());
    }
  }, []);
  
  const handleSaveApiKey = () => {
    setShowApiKeyInput(false);
  };
  
  const handleSendPrompt = async () => {
    if (!prompt.trim()) {
      toast.error("Por favor, digite uma pergunta");
      return;
    }
    
    // Verificar se há chave de API
    if (!aiService.hasApiKey()) {
      setShowApiKeyInput(true);
      toast.error("É necessário configurar a chave da API OpenAI primeiro");
      return;
    }
    
    setIsLoading(true);
    setResponse("");
    
    try {
      const result = await aiService.queryOpenAI(prompt, transactionList);
      setResponse(result);
    } catch (error) {
      console.error("Erro ao enviar prompt:", error);
      toast.error("Erro ao processar sua consulta");
      setResponse("Desculpe, ocorreu um erro ao processar sua consulta.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    prompt,
    setPrompt,
    response,
    isLoading,
    apiKey,
    setApiKey,
    showApiKeyInput,
    setShowApiKeyInput,
    exampleQuestions,
    handleSaveApiKey,
    handleSendPrompt
  };
};
