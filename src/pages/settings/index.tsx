
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";

import AppearanceSettings from "./components/AppearanceSettings";
import CurrencySettings from "./components/CurrencySettings";
import DatabaseSettings from "./components/DatabaseSettings";
import BackupSettings from "./components/BackupSettings";
import PreferencesSettings from "./components/PreferencesSettings";

const Settings = () => {
  const navigate = useNavigate();
  const { canEdit } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          className="mr-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold animate-fade-in-up">Configurações</h1>
          <p className="text-muted-foreground mt-1 animate-fade-in-up animation-delay-100">
            Personalize a sua experiência na aplicação
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {canEdit && <DatabaseSettings className="animate-fade-in-up animation-delay-200 md:col-span-2" />}
        
        <AppearanceSettings className="animate-fade-in-up animation-delay-300" />
        
        <CurrencySettings className="animate-fade-in-up animation-delay-400" />
        
        {canEdit && <BackupSettings className="animate-fade-in-up animation-delay-500" />}
        
        {canEdit && <PreferencesSettings className="animate-fade-in-up animation-delay-600" />}
      </div>
    </div>
  );
};

export default Settings;
