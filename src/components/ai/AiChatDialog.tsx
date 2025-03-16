
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { aiService } from "@/services/aiService";
import { SendIcon, KeyIcon, LoaderIcon, InfoIcon } from "lucide-react";
import { useTransactionData } from "@/hooks/useTransactionData";

interface AiChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AiChatDialog: React.FC<AiChatDialogProps> = ({ open, onOpenChange }) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);
  
  const { transactionList } = useTransactionData();
  
  // Verificar se já temos a API key ao carregar
  useEffect(() => {
    const hasKey = aiService.hasApiKey();
    setHasApiKey(hasKey);
    setShowApiKeyInput(!hasKey);
  }, []);
  
  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error("Por favor, insira uma chave de API válida");
      return;
    }
    
    aiService.setApiKey(apiKey.trim());
    setHasApiKey(true);
    setShowApiKeyInput(false);
    toast.success("Chave da API configurada com sucesso");
  };
  
  const handleSendPrompt = async () => {
    if (!prompt.trim()) {
      toast.error("Por favor, digite uma pergunta");
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
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Assistente IA Financeiro</DialogTitle>
        </DialogHeader>
        
        {showApiKeyInput ? (
          <div className="space-y-4 py-4">
            <div className="flex items-start space-x-2">
              <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Para utilizar o assistente de IA, você precisa fornecer sua própria chave de API da OpenAI. 
                Esta chave será armazenada apenas no seu navegador e não é compartilhada.
              </p>
            </div>
            
            <div className="space-y-2">
              <Input
                placeholder="Insira sua chave da API da OpenAI"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
              />
              <div className="flex items-center space-x-2">
                <Button onClick={handleSaveApiKey} className="w-full">
                  <KeyIcon className="h-4 w-4 mr-2" />
                  Salvar Chave API
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col space-y-4 flex-grow overflow-hidden">
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
              
              <div className="overflow-y-auto flex-grow mt-4">
                {response && (
                  <Textarea
                    value={response}
                    readOnly
                    className="min-h-[200px] p-3 resize-none bg-muted/30"
                  />
                )}
              </div>
            </div>
            
            <DialogFooter className="sm:justify-between flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs" 
                onClick={() => setShowApiKeyInput(true)}
              >
                <KeyIcon className="h-3 w-3 mr-1" />
                Alterar API Key
              </Button>
              
              <p className="text-xs text-muted-foreground">
                Usando GPT-4o da OpenAI
              </p>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AiChatDialog;
