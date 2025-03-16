
import { useState } from "react";
import { toast } from "sonner";
import { useTheme } from "@/components/ThemeProvider";

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

  const handleBackup = () => {
    toast.success("Backup criado com sucesso");
  };

  const handleRestore = () => {
    toast.success("Dados restaurados com sucesso");
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
