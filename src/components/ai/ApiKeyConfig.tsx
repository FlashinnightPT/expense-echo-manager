
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyIcon, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { aiService } from "@/services/aiService";

interface ApiKeyConfigProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  onKeySaved: () => void;
}

const ApiKeyConfig: React.FC<ApiKeyConfigProps> = ({ apiKey, setApiKey, onKeySaved }) => {
  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error("Por favor, digite uma chave de API válida");
      return;
    }
    
    // Salvar no localStorage
    localStorage.setItem('openai_api_key', apiKey);
    
    // Atualizar no serviço
    aiService.setApiKey(apiKey);
    
    onKeySaved();
    toast.success("Chave da API OpenAI configurada com sucesso!");
  };

  return (
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
  );
};

export default ApiKeyConfig;
