
import { Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useSettingsState } from "../hooks/useSettingsState";

interface PreferencesSettingsProps {
  className?: string;
}

const PreferencesSettings = ({ className }: PreferencesSettingsProps) => {
  const { settings, handleChange, handleSave } = useSettingsState();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Preferências</CardTitle>
        <CardDescription>
          Personalize as preferências da aplicação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="autosave">Guardar Automaticamente</Label>
            <p className="text-sm text-muted-foreground">
              Guarde automaticamente as alterações
            </p>
          </div>
          <Switch
            id="autosave"
            checked={settings.autosave}
            onCheckedChange={(checked) => handleChange("autosave", checked)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSave}
        >
          <Save className="h-4 w-4 mr-2" />
          Guardar Configurações
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PreferencesSettings;
