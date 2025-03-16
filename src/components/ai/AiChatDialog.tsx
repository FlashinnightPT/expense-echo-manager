
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { aiService } from "@/services/aiService";
import { SendIcon, LoaderIcon, InfoIcon, KeyIcon, CheckCircle2, AlertTriangle } from "lucide-react";
import { useTransactionData } from "@/hooks/useTransactionData";

interface AiChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AiChatDialog: React.FC<AiChatDialogProps> = ({ open, onOpenChange }) => {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);
  
  const { transactionList } = useTransactionData();
  
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
    if (!apiKey.trim()) {
      toast.error("Por favor, digite uma chave de API válida");
      return;
    }
    
    // Salvar no localStorage
    localStorage.setItem('openai_api_key', apiKey);
    
    // Atualizar no serviço
    aiService.setApiKey(apiKey);
    
    setShowApiKeyInput(false);
    toast.success("Chave da API OpenAI configurada com sucesso!");
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

  // Exemplos de perguntas mais específicas e práticas
  const exampleQuestions = [
    "Quanto gastei com combustível em 2024?",
    "Qual foi o total de pagamentos a Carlos no último ano?",
    "Quais foram as 3 maiores despesas em informática?",
    "Comparar gastos com portagens entre 2023 e 2024"
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Assistente IA Financeiro</DialogTitle>
          <DialogDescription>
            Analise seus dados financeiros e obtenha insights sobre gastos e rendimentos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 flex-grow overflow-hidden">
          {showApiKeyInput ? (
            <div className="bg-muted/50 p-4 rounded-md space-y-3 border border-muted-foreground/20">
              <div className="flex items-start space-x-2">
                <KeyIcon className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  É necessário configurar uma chave de API da OpenAI para utilizar o assistente. 
                  Você pode obter uma chave em <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">platform.openai.com/api-keys</a>
                </p>
              </div>
              <Input
                placeholder="Insira sua chave de API da OpenAI (sk-...)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono text-xs"
                type="password"
              />
              <Button onClick={handleSaveApiKey} className="w-full">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Salvar Chave API
              </Button>
            </div>
          ) : (
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
              
              <div className="flex flex-col space-y-2">
                <Input
                  placeholder="Faça uma pergunta sobre seus dados financeiros..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
                />
                <Button onClick={handleSendPrompt} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <SendIcon className="h-4 w-4 mr-2" />
                      Enviar
                    </>
                  )}
                </Button>
              </div>
              
              {/* Exemplos de perguntas que o usuário pode fazer */}
              <div className="mt-2">
                <p className="text-sm font-medium text-muted-foreground mb-2">Exemplos de perguntas:</p>
                <div className="flex flex-wrap gap-2">
                  {exampleQuestions.map((question, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setPrompt(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="overflow-y-auto flex-grow mt-4">
                {response && (
                  <Textarea
                    value={response}
                    readOnly
                    className="min-h-[200px] p-3 resize-none bg-muted/30"
                  />
                )}
              </div>
            </>
          )}
        </div>
        
        <DialogFooter className="sm:justify-end flex-wrap gap-2">
          {!showApiKeyInput && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowApiKeyInput(true)}
              className="text-xs"
            >
              <KeyIcon className="h-3 w-3 mr-1" />
              Configurar API
            </Button>
          )}
          <p className="text-xs text-muted-foreground">
            Usando GPT-4o-mini da OpenAI
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AiChatDialog;
