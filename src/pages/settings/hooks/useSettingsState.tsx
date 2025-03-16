
import { useState } from "react";
import { toast } from "sonner";
import { useTheme } from "@/components/ThemeProvider";
import { backupService } from "@/services/api/BackupService";

export type SettingsState = {
  language: string;
  currency: string;
  currencySymbol: string;
  dateFormat: string;
  autosave: boolean;
};

export function useSettingsState() {
  const { theme, setTheme } = useTheme();
  
  const [settings, setSettings] = useState<SettingsState>({
    language: "pt-PT",
    currency: "EUR",
    currencySymbol: "€",
    dateFormat: "dd/MM/yyyy",
    autosave: true
  });

  const handleChange = (key: string, value: string | boolean) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value
    }));
  };

  const handleThemeChange = (value: string) => {
    setTheme(value as "light" | "dark" | "system");
  };

  const handleSave = () => {
    toast.success("Configurações guardadas com sucesso");
  };

  const handleBackup = async () => {
    toast.loading("A preparar o backup dos dados...");
    try {
      const result = await backupService.exportDatabase();
      if (!result) {
        toast.error("Ocorreu um erro ao criar o backup. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao criar backup:", error);
      toast.error("Falha ao criar backup: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleRestore = () => {
    // Criar um input de arquivo invisível
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    // Quando o arquivo for selecionado
    fileInput.onchange = async (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        
        toast.loading("A restaurar dados...");
        try {
          const result = await backupService.importDatabase(file);
          if (result) {
            toast.success("Dados restaurados com sucesso");
          }
        } catch (error) {
          console.error("Erro ao restaurar dados:", error);
          toast.error("Falha ao restaurar dados: " + (error instanceof Error ? error.message : String(error)));
        }
      }
      document.body.removeChild(fileInput);
    };
    
    // Abrir o seletor de arquivos
    fileInput.click();
  };

  return {
    settings,
    theme,
    handleChange,
    handleThemeChange,
    handleSave,
    handleBackup,
    handleRestore
  };
}
