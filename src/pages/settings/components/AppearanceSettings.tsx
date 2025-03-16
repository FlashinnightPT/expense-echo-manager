
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-custom/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sun, MoonStar, Laptop } from "lucide-react";
import { useSettingsState } from "../hooks/useSettingsState";

interface AppearanceSettingsProps {
  className?: string;
}

const AppearanceSettings = ({ className }: AppearanceSettingsProps) => {
  const { settings, theme, handleChange, handleThemeChange } = useSettingsState();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Aparência</CardTitle>
        <CardDescription>
          Personalize a aparência da aplicação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="language">Idioma</Label>
          <Select
            value={settings.language}
            onValueChange={(value) => handleChange("language", value)}
          >
            <SelectTrigger id="language">
              <SelectValue placeholder="Selecione o idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt-PT">Português (Portugal)</SelectItem>
              <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
              <SelectItem value="en">Inglês</SelectItem>
              <SelectItem value="es">Espanhol</SelectItem>
              <SelectItem value="fr">Francês</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tema</Label>
          <RadioGroup
            value={theme}
            onValueChange={handleThemeChange}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2 rounded-md border p-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                <Sun className="h-4 w-4" />
                <span>Claro</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                <MoonStar className="h-4 w-4" />
                <span>Escuro</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system" className="flex items-center gap-2 cursor-pointer">
                <Laptop className="h-4 w-4" />
                <span>Sistema</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
