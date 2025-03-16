
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { KeyIcon } from "lucide-react";
import { useTransactionData } from "@/hooks/useTransactionData";
import { useAiChat } from "@/hooks/useAiChat";
import ApiKeyConfig from "./ApiKeyConfig";
import ExampleQuestions from "./ExampleQuestions";
import ChatInput from "./ChatInput";
import ResponseDisplay from "./ResponseDisplay";
import ChatTips from "./ChatTips";

interface AiChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AiChatDialog: React.FC<AiChatDialogProps> = ({ open, onOpenChange }) => {
  const { transactionList } = useTransactionData();
  const {
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
  } = useAiChat(transactionList);
  
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
            <ApiKeyConfig 
              apiKey={apiKey}
              setApiKey={setApiKey}
              onKeySaved={handleSaveApiKey}
            />
          ) : (
            <>
              <ChatTips />
              
              <ChatInput 
                prompt={prompt}
                setPrompt={setPrompt}
                isLoading={isLoading}
                onSendPrompt={handleSendPrompt}
              />
              
              <ExampleQuestions 
                questions={exampleQuestions}
                onSelectQuestion={setPrompt}
              />
              
              <ResponseDisplay response={response} />
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
