
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon, LoaderIcon } from "lucide-react";

interface ChatInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isLoading: boolean;
  onSendPrompt: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ prompt, setPrompt, isLoading, onSendPrompt }) => {
  return (
    <div className="flex flex-col space-y-2">
      <Input
        placeholder="Faça uma pergunta sobre seus dados financeiros..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSendPrompt()}
      />
      <Button onClick={onSendPrompt} disabled={isLoading}>
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
  );
};

export default ChatInput;
